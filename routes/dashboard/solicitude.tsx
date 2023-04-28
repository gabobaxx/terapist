// * Types
import { DashboardState } from './_middleware.ts';
import { Database } from '@/utils/supabase_types.ts';
import type { Handlers, PageProps } from '$fresh/server.ts';
// * Components
import Head from '@/components/Head.tsx';
import Notice from '../../components/Notice.tsx';
import Dashboard from '@/components/Dashboard.tsx';
// * Utils
import { getTodos } from '@/utils/todos.ts';
// * Islands
import TodoList from '@/islands/TodoList.tsx';

interface TodosPageData extends DashboardState {
	todos: Database['public']['Tables']['todos']['Insert'][];
	customer: Database['public']['Tables']['customers']['Row'];
}

export const handler: Handlers<TodosPageData, DashboardState> = {
	async GET(_request, ctx) {
		const customer = await ctx.state.createOrGetCustomer();
		const todos = await getTodos(ctx.state.supabaseClient);
		return ctx.render({
			...ctx.state,
			todos,
			customer,
		});
	},
};

export default function TodosPage(props: PageProps<TodosPageData>) {
	return (
		<>
			<Head title="Vacunas Solicitadas" />
			<Dashboard active="/dashboard/solicitude">
				<Notice class="mb-4">Vacunas solicitadas por el momento</Notice>
				<TodoList
					isSubscribed={props.data.customer.is_subscribed!}
					todos={props.data.todos}
				/>
			</Dashboard>
		</>
	);
}
