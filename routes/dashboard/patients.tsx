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
import { supabaseAdminClient } from '@/utils/supabase.ts';
// * Islands
import AdminPatientsList from '@/islands/AdminPatientsList.tsx';
import ClientPatientsList from '@/islands/ClientPatientList.tsx';

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
	const client_id = props.data.session.user.id;
	const isAdmin = Boolean(props.data.customer);
	const kids = props.data.kids;
	const patients = props.data.clients;

	return (
		<>
			<Head title="Patients" />
			<Dashboard active="/dashboard/patients">
				{isAdmin ? (
					<AdminPatientsList
						isAdmin={true}
						isSubscribed={true}
						patients={patients}
					/>
				) : (
					<ClientPatientsList client_id={client_id} kids={kids} />
				)}
			</Dashboard>
		</>
	);
}
