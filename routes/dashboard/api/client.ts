import type { Handlers } from '$fresh/server.ts';
import { AuthError } from '@supabase/supabase-js';
import { createClient } from '@/utils/clients.ts';
import type { DashboardState } from '@/routes/dashboard/_middleware.ts';

export const handler: Handlers<null, DashboardState> = {
	async POST(request, ctx) {
		try {
			const client = await request.json();
			await createClient(ctx.state.supabaseClient, client);

			return Response.json(null, { status: 201 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;

			return new Response(error.message, { status });
		}
	},
};
