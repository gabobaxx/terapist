import type { Handlers } from '$fresh/server.ts';
import type { DashboardState } from '@/routes/dashboard/_middleware.ts';
import { AuthError } from '@supabase/supabase-js';
import { addSolicitude, getSolicitudes } from '@/utils/solicitudes.ts';
import { Database } from '@/utils/supabase_types.ts';

type Solicitude = Database['public']['Tables']['solicitudes']['Insert'];

export const handler: Handlers<null, DashboardState> = {
	async POST(request, ctx) {
		try {
			const solicitude = (await request.json()) as Solicitude;

			solicitude.date = new Date();

			// ? new solicitude date going to be 30 min after the last one
			solicitude.date = new Date(
				solicitude.date.getFullYear(),
				solicitude.date.getMonth(),
				solicitude.date.getDate(),
				solicitude.date.getHours(),
				solicitude.date.getMinutes() + 30
			);

			await addSolicitude(ctx.state.supabaseClient, solicitude);

			console.log(solicitude.date);

			return Response.json(null, { status: 201 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;
			return new Response(error.message, { status });
		}
	},
};
