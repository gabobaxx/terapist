import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase_types.ts';

const TABLE_NAME = 'kids';

export type Kid = Database['public']['Tables']['kids']['Insert'];

export async function getKids(client: SupabaseClient<Database>) {
	const { data } = await client
		.from(TABLE_NAME)
		.select('id, name, lastname, age, client_id')
		.throwOnError();
	return data!;
}

export async function createKid(client: SupabaseClient<Database>, kid: Kid) {
	await client.from(TABLE_NAME).insert(kid).throwOnError();
}
