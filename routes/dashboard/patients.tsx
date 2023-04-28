// * Types
import type { Handlers, PageProps } from '$fresh/server.ts';
import { DashboardState } from './_middleware.ts';
// * Components
import Head from '@/components/Head.tsx';
import Dashboard from '@/components/Dashboard.tsx';
// * Utils
import { getClients } from '@/utils/clients.ts';
import { Database } from '@/utils/supabase_types.ts';
// * Islands
import PatientList from '@/islands/PatientList.tsx';

interface PatientsPageData extends DashboardState {
	clients: Database['public']['Tables']['clients']['Update'][];
	customer: Database['public']['Tables']['customers']['Update'] | null;
}

export const handler: Handlers<PatientsPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.getCustomer();
		const clients = await getClients(ctx.state.supabaseClient);
		return ctx.render({
			...ctx.state,
			clients,
			customer,
		});
	},
};

export default function PatientsPage(props: PageProps<PatientsPageData>) {
	return (
		<>
			<Head title="Patients" />
			<Dashboard active="/dashboard/patients">
				<PatientList
					isSubscribed={true}
					patients={props.data.clients}
					isAdmin={Boolean(props.data.customer)}
				/>
			</Dashboard>
		</>
	);
}
