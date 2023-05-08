import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase_types.ts';

const TABLE_NAME = 'clients';

export type Client = Database['public']['Tables']['clients']['Insert'];

export async function getClients(client: SupabaseClient<Database>) {
	const { data } = await client
		.from(TABLE_NAME)
		.select('user_id, email, customer_id, is_invited')
		.throwOnError();
	return data!;
}

export async function createClient(
	client: SupabaseClient<Database>,
	clientOfCustomer: Client
) {
	await client.from(TABLE_NAME).insert(clientOfCustomer).throwOnError();
}
