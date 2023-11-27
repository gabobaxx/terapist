// deno-lint-ignore-file no-explicit-any
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdminClient } from './supabase.ts';
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

interface UserAppMetadata {
	provider?: string;
	[key: string]: any;
}
interface UserMetadata {
	[key: string]: any;
}

interface UserIdentity {
	id: string;
	user_id: string;
	identity_data?: {
		[key: string]: any;
	};
	provider: string;
	created_at?: string;
	last_sign_in_at?: string;
	updated_at?: string;
}

interface Factor {
	id: string;

	friendly_name?: string;

	factor_type: 'totp' | string;

	status: 'verified' | 'unverified';
	created_at: string;
	updated_at: string;
}

interface User {
	id: string;
	app_metadata: UserAppMetadata;
	user_metadata: UserMetadata;
	aud: string;
	confirmation_sent_at?: string;
	recovery_sent_at?: string;
	email_change_sent_at?: string;
	new_email?: string;
	new_phone?: string;
	invited_at?: string;
	action_link?: string;
	email?: string;
	phone?: string;
	created_at: string;
	confirmed_at?: string;
	email_confirmed_at?: string;
	phone_confirmed_at?: string;
	last_sign_in_at?: string;
	role?: string;
	updated_at?: string;
	identities?: UserIdentity[];
	factors?: Factor[];
	kid?: Database['public']['Tables']['kids']['Update'];
}

export async function getUsers(): Promise<User[]> {
	const { data } = await supabaseAdminClient.auth.admin.listUsers();
	const usersFromDatabase = data.users;
	const users = usersFromDatabase.map((user: User) => {
		user.kid = {};
		return user;
	});
	return users;
}

export async function deleteClient(
	client: SupabaseClient<Database>,
	id: Client['user_id']
) {
	await client.from(TABLE_NAME).delete().eq('user_id', id).throwOnError();
}
