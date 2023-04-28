import type { Handlers } from '$fresh/server.ts';
import { createSupabaseClient } from '@/utils/supabase.ts';
import { assert } from 'std/testing/asserts.ts';
import { AUTHENTICATED_REDIRECT_PATH } from '@/constants.ts';

export const handler: Handlers = {
	async POST(request) {
		const form = await request.formData();
		const email = form.get('email');
		assert(typeof email === 'string');

		/**
		 * ? Enable this if you want support
		 * ? for AuthFormWithPassword component
		 * 	const password = form.get('password');
		 * 	assert(typeof password === 'string');
		 * * If yes, remember make validations
		 * * (if password exists or not)
		 */

		const headers = new Headers();

		const { error } = await createSupabaseClient(
			request.headers,
			headers
		).auth.signInWithOtp({ email });

		let redirectUrl =
			new URL(request.url).searchParams.get('redirect_url') ??
			AUTHENTICATED_REDIRECT_PATH;
		if (error) {
			redirectUrl = `/login?error=${encodeURIComponent(error.message)}`;
		}

		headers.set('location', redirectUrl);
		const res = new Response(null, { headers, status: 302 });
		return res;
	},
};
