// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { MiddlewareHandlerContext } from '$fresh/server.ts';
import { getCustomer, createSupabaseClient } from '@/utils/supabase.ts';
import { assert } from 'std/testing/asserts.ts';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/utils/supabase_types.ts';
import { stripe } from '@/utils/stripe.ts';

export interface DashboardState {
	session: Session;
	supabaseClient: SupabaseClient<Database>;
	getCustomer: () => Promise<
		Database['public']['Tables']['customers']['Update'] | null
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
		console.log({
			requestHeaders: request.headers,
		});
		const headers = new Headers();
		const supabaseClient = createSupabaseClient(request.headers, headers);
		// console.log({
		// 	clientInMiddleware: supabaseClient,
		// 	headersInMiddleware: headers,
		// });
		const {
			data: { session },
		} = await supabaseClient.auth.getSession();
		// console.log({ sessionInMiddleware: session });
		assert(session);

		ctx.state.session = session;
		ctx.state.supabaseClient = supabaseClient;
		ctx.state.getCustomer = async () => await getCustomer(supabaseClient);

		const response = await ctx.next();
		headers.forEach((value, key) => response.headers.set(key, value));
		console.log({ response });
		return response;
	} catch (error) {
		// console.error({ error });

		return new Response(null, {
			status: 302,
			headers: {
				location: getLoginPath(request.url),
			},
		});
	}
}
