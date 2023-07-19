// * Types
import type { Handlers, PageProps } from '$fresh/server.ts';
import { DashboardState } from './_middleware.ts';
// * Components
import Head from '@/components/Head.tsx';
import Dashboard from '@/components/Dashboard.tsx';
// * Utils
import { getClients } from '@/utils/clients.ts';
import { getKids } from '@/utils/kids.ts';
import { Database } from '@/utils/supabase_types.ts';
// * Islands
import PatientList from '@/islands/PatientList.tsx';
import { supabaseAdminClient } from '../../utils/supabase.ts';

interface PatientsPageData extends DashboardState {
	clients: Database['public']['Tables']['clients']['Update'][];
	customer: Database['public']['Tables']['customers']['Update'] | null;
	kids: Database['public']['Tables']['kids']['Row'][];
	users: any;
}

export const handler: Handlers<PatientsPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.getCustomer();
		const clients = await getClients(ctx.state.supabaseClient);
		const kids = await getKids(ctx.state.supabaseClient);
		const { data } = await supabaseAdminClient.auth.admin.listUsers();

		data.users.map((user) => {
			kids.map((kid) => {
				if (user.id === kid.client_id) {
					user.kid = kid;
				}
			});
		});

		clients.map((client) => {
			data.users.map((user) => {
				if (client.email === user.email) {
					client.kid = user.kid || '';
					client.is_invited = true;
				}
			});
		});

		return ctx.render({
			...ctx.state,
			clients,
			customer,
			kids,
			users: data.users,
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
					client_id={props.data.session.user.id}
					kids={props.data.kids}
					users={props.data.users}
				/>
			</Dashboard>
		</>
	);
}
