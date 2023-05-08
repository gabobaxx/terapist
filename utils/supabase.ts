// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import type { Database } from './supabase_types.ts';
import { createServerSupabaseClient } from '@supabase/auth-helpers-shared';
import { getCookies, setCookie } from 'std/http/cookie.ts';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Stripe } from 'stripe';

export function createSupabaseClient(
	requestHeaders: Headers,
	responseHeaders?: Headers
) {
	return createServerSupabaseClient<Database>({
		supabaseUrl: Deno.env.get('SUPABASE_URL')!,
		supabaseKey: Deno.env.get('SUPABASE_ANON_KEY')!,
		getRequestHeader: (key) => requestHeaders.get(key) ?? undefined,
		getCookie: (name) => {
			const cookie = getCookies(requestHeaders)[name] ?? '';
			return decodeURIComponent(cookie);
		},
		setCookie: (name, value, options) => {
			if (responseHeaders) {
				setCookie(responseHeaders, {
					name,
					value: encodeURIComponent(value),
					...options,
					sameSite: 'Lax',
					httpOnly: false,
				});
			}
		},
	});
}

// Required to bypass Row Level Security (RLS)
export const supabaseAdminClient = createClient<Database>(
	Deno.env.get('SUPABASE_URL')!,
	Deno.env.get('SUPABASE_SERVICE_KEY')!
);

export async function getCustomer(supabaseClient: SupabaseClient<Database>) {
	const { data } = await supabaseClient.from('customers').select().single();
	return data;
}
export async function getClient(supabaseClient: SupabaseClient<Database>) {
	const { data } = await supabaseClient.from('clients').select().single();
	return data;
}

export async function createCustomer(
	supabaseClient: SupabaseClient<Database>,
	stripeClient: Stripe
) {
	const {
		data: { user },
		error,
	} = await supabaseClient.auth.getUser();
	if (error) console.error(error);

	const { id } = await stripeClient.customers.create({
		email: user!.email,
	});

	const customer = { stripe_customer_id: id, is_subscribed: false };

	const { data } = await supabaseClient
		.from('customers')
		.insert(customer)
		.select()
		.single()
		.throwOnError();

	return data!;
}
