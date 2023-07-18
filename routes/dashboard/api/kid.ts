import type { Handlers } from '$fresh/server.ts';
import { AuthError } from '@supabase/supabase-js';
import { createKid } from '@/utils/kids.ts';
import type { DashboardState } from '@/routes/dashboard/_middleware.ts';

export const handler: Handlers<null, DashboardState> = {
	async POST(request, ctx) {
		try {
			const kid = await request.json();
			// console.log(kid);
			await createKid(ctx.state.supabaseClient, kid);

			return Response.json(null, { status: 201 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;

			return new Response(error.message, { status });
		}
	},
};
