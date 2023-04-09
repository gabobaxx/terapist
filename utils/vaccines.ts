import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase_types.ts';

const TABLE_NAME = 'vaccines';

export type Vaccine = Database['public']['Tables']['vaccines']['Insert'];

export async function getVaccines(client: SupabaseClient<Database>) {
	const { data } = await client
		.from(TABLE_NAME)
		.select('id, name, quantity')
		.throwOnError();
	return data!;
}

export async function addVaccine(
	client: SupabaseClient<Database>,
	vaccine: Vaccine
) {
	await client.from(TABLE_NAME).insert(vaccine).throwOnError();
}

export async function deleteVaccine(
	client: SupabaseClient<Database>,
	id: Vaccine['id']
) {
	await client.from(TABLE_NAME).delete().eq('id', id).throwOnError();
}
