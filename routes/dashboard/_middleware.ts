// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { MiddlewareHandlerContext } from '$fresh/server.ts';
import {
	supabaseAdminClient,
	getCustomer,
	createSupabaseClient,
	getClient,
} from '@/utils/supabase.ts';
import { assert } from 'std/testing/asserts.ts';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/utils/supabase_types.ts';

export interface DashboardState {
	session: Session;
	supabaseClient: SupabaseClient<Database>;
	getCustomer: () => Promise<
		Database['public']['Tables']['customers']['Update'] | null
	>;
	getClient: () => Promise<
		Database['public']['Tables']['clients']['Insert'] | null
	>;
}

export function getLoginPath(redirectUrl: string) {
	const params = new URLSearchParams({ redirect_url: redirectUrl });
	return `/login?${params}`;
}

export async function handler(
	request: Request,
	ctx: MiddlewareHandlerContext<DashboardState>
) {
	try {
		const headers = new Headers();
		const supabaseClient = createSupabaseClient(request.headers, headers);

		const {
			data: { session },
		} = await supabaseClient.auth.getSession();
		assert(session);

		ctx.state.session = session;
		ctx.state.supabaseClient = supabaseClient;
		ctx.state.getClient = async () => await getClient(supabaseAdminClient);
		ctx.state.getCustomer = async () => await getCustomer(supabaseClient);

		const response = await ctx.next();
		headers.forEach((value, key) => response.headers.set(key, value));

		return response;
	} catch (_error) {
		return new Response(null, {
			status: 302,
			headers: {
				location: getLoginPath(request.url),
			},
		});
	}
}
