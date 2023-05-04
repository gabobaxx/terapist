import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './supabase_types.ts';

const TABLE_NAME = 'solicitudes';

export type Solicitude = Database['public']['Tables']['solicitudes']['Insert'];

export async function getSolicitudes(client: SupabaseClient<Database>) {
	const { data } = await client
		.from(TABLE_NAME)
		.select('id, vaccine_id, client_id, customer_id, date')
		.throwOnError();
	return data!;
}

export async function addSolicitude(
	client: SupabaseClient<Database>,
	solicitude: Solicitude
) {
	await client.from(TABLE_NAME).insert(solicitude).throwOnError();
}

export async function deleteSolicitude(
	client: SupabaseClient<Database>,
	id: Solicitude['id']
) {
	await client.from(TABLE_NAME).delete().eq('id', id).throwOnError();
}
