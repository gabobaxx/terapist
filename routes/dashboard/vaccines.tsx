// * Types
import { DashboardState } from './_middleware.ts';
import { Database } from '@/utils/supabase_types.ts';
import type { Handlers, PageProps } from '$fresh/server.ts';
// * Components
import Head from '@/components/Head.tsx';
import Notice from '../../components/Notice.tsx';
import Dashboard from '@/components/Dashboard.tsx';
// * Utils
import { getVaccines } from '@/utils/vaccines.ts';
// * Islands
import VaccineList from '@/islands/VaccinesList.tsx';
import { getSolicitudes } from '../../utils/solicitudes.ts';

interface TodosPageData extends DashboardState {
	vaccines: Database['public']['Tables']['vaccines']['Insert'][];
	solicitudes: Database['public']['Tables']['solicitudes']['Insert'][];
	customer: Database['public']['Tables']['customers']['Update'] | null;
}

export const handler: Handlers<TodosPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.getCustomer();
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
					/* isSubscribed={true} */ vaccines={props.data.vaccines}
					solicitudes={props.data.solicitudes}
					customer={props.data.customer}
				/>
			</Dashboard>
		</>
	);
}
