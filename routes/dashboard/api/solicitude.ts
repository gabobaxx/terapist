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
			solicitude.client_id = crypto.randomUUID();
			solicitude.date = new Date();
			const actualDate = new Date();

			// ! getSolicitudes returns the date as string
			// ! fix typescript and network typing
			const solicitudes = await getSolicitudes(ctx.state.supabaseClient);
			const lastSolicitude = solicitudes[solicitudes.length - 1];

			if (lastSolicitude) {
				const lastSolicitudeDateFromDB = new Date(lastSolicitude.date);
				console.log(lastSolicitudeDateFromDB.getHours());
				console.log(actualDate.getHours());
				// * so, convert string to date type/format
				solicitude.date =
					lastSolicitudeDateFromDB.getTime() >= actualDate.getTime()
						? lastSolicitudeDateFromDB
						: actualDate;
			}

			// ? new solicitude date going to be 30 min after the last one
			solicitude.date = new Date(
				solicitude.date.getFullYear(),
				solicitude.date.getMonth(),
				solicitude.date.getDay(),
				solicitude.date.getHours(),
				solicitude.date.getMinutes() + 30
			);

			await addSolicitude(ctx.state.supabaseClient, solicitude);

			return Response.json(null, { status: 201 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;
			return new Response(error.message, { status });
		}
	},
};
