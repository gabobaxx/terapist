// * Types
import { DashboardState } from '@/routes/dashboard/_middleware.ts';
import { Database } from '@/utils/supabase_types.ts';
import type { Handlers, PageProps } from '$fresh/server.ts';
// * Components
import Head from '@/components/Head.tsx';
import Notice from '@/components/Notice.tsx';
import Dashboard from '@/components/Dashboard.tsx';
import SolicitudesList from '@/components/SolicitudesList.tsx';
// * Utils
import { getSolicitudes } from '@/utils/solicitudes.ts';
import { getVaccines } from '@/utils/vaccines.ts';
import { supabaseAdminClient } from '@/utils/supabase.ts';
import { getKids } from '../../utils/kids.ts';

export interface SolicitudesPageData extends DashboardState {
	solicitudes: {
		id: string;
		vaccine: string | null | undefined;
		date: Date;
	}[];
}

export const handler: Handlers<SolicitudesPageData, DashboardState> = {
	async GET(_request, ctx) {
		// ! getSolicitudes returns the date as string
		// ! fix typescript and network typing
		const kids = await getKids(ctx.state.supabaseClient);
		const solicitudes = await getSolicitudes(ctx.state.supabaseClient);
		const vaccines = await getVaccines(ctx.state.supabaseClient);
		const { data, error } = await supabaseAdminClient.auth.admin.listUsers();

		// * convert string to date type/format
		const newSolicitudes = solicitudes.map((solicitude) => {
			const vaccine = vaccines.find(
				(vaccine) => vaccine.id === solicitude.vaccine_id
			);

			data.users.map((user) => {
				kids.map((kid) => {
					if (user.id === kid.client_id) {
						user.kid = kid;
					}
				});
			});

			const user = data.users.find((user) => user.id === solicitude.client_id);

			solicitude.date = new Date(solicitude.date);

			solicitude.date.toLocaleString('es-US', { timeZone: 'America/Caracas' });
			return {
				id: solicitude.id,
				vaccine: vaccine?.name,
				date: solicitude.date,
				user,
			};
		});

		return ctx.render({
			...ctx.state,
			solicitudes: newSolicitudes,
		});
	},
};

export default function SolicitudesPage(props: PageProps<SolicitudesPageData>) {
	return (
		<>
			<Head title="Vacunas Solicitadas" />
			<Dashboard active="/dashboard/solicitudes">
				<Notice class="mb-4">Vacunas solicitadas por el momento</Notice>
				<SolicitudesList solicitudes={props.data.solicitudes} />
			</Dashboard>
		</>
	);
}
