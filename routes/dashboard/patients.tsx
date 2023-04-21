import type { Handlers, PageProps } from '$fresh/server.ts';
import { getClients } from '@/utils/clients.ts';
import Head from '@/components/Head.tsx';
import PatientList from '@/islands/PatientList.tsx';
import Notice from '@/components/Notice.tsx';
import { DashboardState } from './_middleware.ts';
import Dashboard from '@/components/Dashboard.tsx';
import { Database } from '@/utils/supabase_types.ts';

interface PatientsPageData extends DashboardState {
	clients: Database['public']['Tables']['clients']['Update'][];
	customer: Database['public']['Tables']['customers']['Row'];
}

export const handler: Handlers<PatientsPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.createOrGetCustomer();
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
				{!props.data.customer.is_subscribed && (
					<Notice class="mb-4">
						You are on a free subscription. Please{' '}
						<a href="/dashboard/upgrade-subscription" class="underline">
							upgrade
						</a>{' '}
						to enable unlimited todos
					</Notice>
				)}
				{/* Change to PatientList */}
				<PatientList
					isSubscribed={props.data.customer.is_subscribed!}
					patients={props.data.clients}
					isAdmin={Boolean(props.data.customer)}
				/>
			</Dashboard>
		</>
	);
}
