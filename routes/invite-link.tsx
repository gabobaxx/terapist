// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from '$fresh/server.ts';
import { AUTHENTICATED_REDIRECT_PATH } from '@/constants.ts';
import { createSupabaseClient, supabaseAdminClient } from '@/utils/supabase.ts';
import { assert } from 'std/testing/asserts.ts';

import { createClient } from '@supabase/supabase-js';

export const handler: Handlers = {
	async GET(request) {
		const headers = new Headers();

		// const { error } = await supabaseAdminClient.auth.signInWithOtp({
		// 	email: 'gabriely101@hotmail.com',
		// 	options: {
		// 		emailRedirectTo: 'http://localhost:8000/dashboard/account',
		// 	},
		// });

		const { error } = await createSupabaseClient(
			request.headers,
			headers
		).auth.signInWithOtp({
			email: 'gabriely101@hotmail.com',
		});

		return Response.redirect('http://localhost:8000', 302);
	},
};
