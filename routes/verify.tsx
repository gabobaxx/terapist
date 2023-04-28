// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers } from '$fresh/server.ts';
import { AUTHENTICATED_REDIRECT_PATH } from '@/constants.ts';
import { supabaseAdminClient } from '@/utils/supabase.ts';
import { assert } from 'std/testing/asserts.ts';

import { createClient } from '@supabase/supabase-js';

export const handler: Handlers = {
	async GET(request, ctx) {
		const resp = await ctx.render();
		const headers = new Headers();

		console.log(request);

		// const res = new Response(null, { headers, status: 302 });

		return resp;
	},
};

export default function SetPasswordPage(props: any) {
	return (
		<main>
			<h1>Link</h1>
			<a>{props.data.link}</a>
		</main>
	);
}
