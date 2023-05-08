// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from '$fresh/server.ts';
import { createSupabaseClient, supabaseAdminClient } from '@/utils/supabase.ts';
import type { Provider } from '@supabase/supabase-js';

export const handler: Handlers = {
	async POST(request) {
		const form = await request.formData();
		const email = form.get('email') as string;
		// assert(email)

		const supabaseClient = supabaseAdminClient;
		const { origin } = new URL(request.url);
		const { error } = await supabaseClient.auth.admin.inviteUserByEmail(email, {
			redirectTo: origin + '/login/success',
		});

		if (error) throw error;

		return Response.redirect(origin, 302);
	},
};
