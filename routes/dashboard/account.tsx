// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Handlers, PageProps } from '$fresh/server.ts';
import Head from '@/components/Head.tsx';
import type { DashboardState } from './_middleware.ts';
import Dashboard from '@/components/Dashboard.tsx';
import type { Database } from '@/utils/supabase_types.ts';
import Input from '../../components/Input.tsx';
import Button from '../../components/Button.tsx';

interface AccountPageData extends DashboardState {
	customer: Database['public']['Tables']['customers']['Update'] | null;
}

export const handler: Handlers<AccountPageData, DashboardState> = {
	async GET(_request, ctx) {
		console.log(ctx.state);
		const customer = await ctx.state.getCustomer();
		return ctx.render({ ...ctx.state, customer });
	},
};

export default function AccountPage(props: PageProps<AccountPageData>) {
	const action = props.data.customer?.is_subscribed ? 'Manage' : 'Upgrade';

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
					<li class="flex items-center justify-between gap-2 py-2">
						<div class="flex-1">
							<strong>Update password</strong>
						</div>
						<form
							method="POST"
							class="space-y-4"
							action={`/api/update-password`}
						>
							<Input
								placeholder="Password"
								name="password"
								type="password"
								required
								class="w-full"
							/>
						</form>
					</li>
					<li class="flex items-center justify-between gap-2 py-2">
						<div class="flex-1">
							<strong>Subscription</strong>
						</div>
						<a
							class="underline"
							href={`/dashboard/${action.toLowerCase()}-subscription`}
						>
							{action} subscription
						</a>
					</li>
				</ul>
			</Dashboard>
		</>
	);
}
