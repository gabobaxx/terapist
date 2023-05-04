// * Components
import Head from '@/components/Head.tsx';
import Dashboard from '@/components/Dashboard.tsx';
// * Types
import type { DashboardState } from './_middleware.ts';
import type { Handlers, PageProps } from '$fresh/server.ts';

export const handler: Handlers<DashboardState> = {
	GET(_request, ctx) {
		return ctx.render({
			session: ctx.state.session as DashboardState['session'],
			getCustomer: ctx.state.getCustomer as DashboardState['getCustomer'],
			supabaseClient: ctx.state
				.supabaseClient as DashboardState['supabaseClient'],
		});
	},
};

export default function AccountPage(props: PageProps<DashboardState>) {
	return (
		<>
			<Head title="Account" />
			<Dashboard active="/dashboard/account">
				<ul class="space-y-2">
					<li class="flex items-center justify-between gap-2 py-2">
						<div class="flex-1">
							<strong>Email</strong>
						</div>
						<div>{props.data.session.user.email}</div>
					</li>
				</ul>
			</Dashboard>
		</>
	);
}
