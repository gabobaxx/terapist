// * Types
import { DashboardState } from '@/routes/dashboard/_middleware.ts';
import { Database } from '@/utils/supabase_types.ts';
import type { Handlers, PageProps } from '$fresh/server.ts';
// * Components
import Head from '@/components/Head.tsx';
import Notice from '../../components/Notice.tsx';
import Dashboard from '@/components/Dashboard.tsx';
// * Utils
import { getClients } from '@/utils/clients.ts';
import { getVaccines } from '@/utils/vaccines.ts';
import { getSolicitudes } from '@/utils/solicitudes.ts';
// * Islands
import VaccineList from '@/islands/VaccinesList.tsx';

interface TodosPageData extends DashboardState {
	vaccines: Database['public']['Tables']['vaccines']['Insert'][];
	solicitudes: Database['public']['Tables']['solicitudes']['Insert'][];
	customer: Database['public']['Tables']['customers']['Update'] | null;
	clients?: Database['public']['Tables']['clients']['Row'][];
}

export const handler: Handlers<TodosPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.getCustomer();
		const client = await ctx.state.getClient();
		const vaccines = await getVaccines(ctx.state.supabaseClient);
		const solicitudes = await getSolicitudes(ctx.state.supabaseClient);
		return ctx.render({
			...ctx.state,
			vaccines,
			customer,
			solicitudes,
		});
	},
};

export default function VaccinesPage(props: PageProps<TodosPageData>) {
	return (
		<>
			<Head title="Vacunas Disponible " />
			<Dashboard active="/dashboard/vaccines">
				<Notice class="mb-4">Vacunas disponibles por el momento</Notice>
				<VaccineList
					vaccines={props.data.vaccines}
					solicitudes={props.data.solicitudes}
					customer={props.data.customer}
					clientId={props.data.session.user.id}
				/>
				{!props.data.customer && (
					<>
						<Notice class="mt-4">Esquema de vacunacion segun la OMS</Notice>
						<img src="/esquema.jpg" alt="esquema de vacunacion" />
					</>
				)}
			</Dashboard>
		</>
	);
}
