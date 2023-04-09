import type { Handlers } from '$fresh/server.ts';
import { AuthError } from '@supabase/supabase-js';
import { addVaccine, deleteVaccine } from '@/utils/vaccines.ts';
import type { DashboardState } from '@/routes/dashboard/_middleware.ts';

export const handler: Handlers<null, DashboardState> = {
	async POST(request, ctx) {
		try {
			const vaccine = await request.json();
			await addVaccine(ctx.state.supabaseClient, vaccine);

			return Response.json(null, { status: 201 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;

			return new Response(error.message, { status });
		}
	},
	async DELETE(request, ctx) {
		try {
			const { id } = await request.json();
			await deleteVaccine(ctx.state.supabaseClient, id);

			return new Response(null, { status: 202 });
		} catch (error) {
			const status = error instanceof AuthError ? 401 : 400;

			return new Response(error, { status });
		}
	},
};
