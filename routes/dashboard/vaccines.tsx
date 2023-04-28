import type { Handlers, PageProps } from '$fresh/server.ts';
import { getVaccines } from '@/utils/vaccines.ts';
import Head from '@/components/Head.tsx';
import VaccineList from '@/islands/VaccinesList.tsx';
import Notice from '@/components/Notice.tsx';
import { DashboardState } from './_middleware.ts';
import Dashboard from '@/components/Dashboard.tsx';
import { Database } from '@/utils/supabase_types.ts';

interface TodosPageData extends DashboardState {
	vaccines: Database['public']['Tables']['vaccines']['Insert'][];
	customer: Database['public']['Tables']['customers']['Update'] | null;
}

export const handler: Handlers<TodosPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.getCustomer();
		const vaccines = await getVaccines(ctx.state.supabaseClient);
		return ctx.render({
			...ctx.state,
			vaccines,
			customer,
		});
	},
};

export default function VaccinesPage(props: PageProps<TodosPageData>) {
	return (
		<>
			<Head title="Vacunas Disponible " />
			<Dashboard active="/dashboard/vaccines">
				{!props.data.customer?.is_subscribed && (
					<Notice class="mb-4">
						You are on a free subscription. Please{' '}
						<a href="/dashboard/upgrade-subscription" class="underline">
							upgrade
						</a>{' '}
						to enable unlimited todos
					</Notice>
				)}
				<VaccineList
					isSubscribed={props.data.customer?.is_subscribed!}
					vaccines={props.data.vaccines}
				/>
			</Dashboard>
		</>
	);
}
