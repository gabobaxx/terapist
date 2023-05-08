import type { Handlers } from '$fresh/server.ts';
import { AuthError } from '@supabase/supabase-js';
import { createClient, getClients } from '@/utils/clients.ts';
import type { DashboardState } from '@/routes/dashboard/_middleware.ts';

import { supabaseAdminClient } from '@/utils/supabase.ts';
import { assert } from 'https://deno.land/std@0.181.0/testing/asserts.ts';

export const handler: Handlers<null, DashboardState> = {
	async POST(request, ctx) {
		try {
			const client = await request.json();
			const clients = await getClients(ctx.state.supabaseClient);

			/**
			 * ! do customer validation
			 * ! if client email is
			 * ! registered as customer
			 */

			// const { data } = await ctx.state.supabaseClient
			// 	.from('customers')
			// 	.select('user_id')
			// 	.throwOnError();
			// const {
			// 	data: { users },
			// } = await supabaseAdminClient.auth.admin.listUsers();
			// let userFound: any = [];

			// users.forEach((user) => {
			// 	data?.forEach((customer) => {
			// 		if (user.id === customer.user_id) {
			// 			userFound.push(user);
			// 		}
			// 	});
			// });
			// console.log(userFound);

			const clientFound = clients.find((c) => c.email === client.email);
			if (clientFound) {
				return Response.json(
					{ msg: 'Email already registered' },
					{ status: 400 }
				);
			}

			await createClient(ctx.state.supabaseClient, client);

			return Response.json(null, { status: 201 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;

			return new Response(error.message, { status });
		}
	},
	async PUT(request) {
		try {
			const client = await request.json();

			const { data } = await supabaseAdminClient.auth.admin.inviteUserByEmail(
				client.email,
				{
					redirectTo: 'http://192.168.0.124:8000/login/success',
				}
			);

			const { error } = await supabaseAdminClient
				.from('clients')
				.update({
					is_invited: true,
					user_id: data.user?.id,
				})
				.eq('id', client.id);

			assert(!error, error?.message);

			return Response.json(null, { status: 200 });
		} catch (error) {
			console.error(error);
			const status = error instanceof AuthError ? 401 : 400;

			return new Response(error.message, { status });
		}
	},
};
