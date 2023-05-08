import Button from '@/components/Button.tsx';
import { type Signal, useSignal } from '@preact/signals';
import { IS_BROWSER } from '$fresh/runtime.ts';
import { FREE_PLAN_TODOS_LIMIT } from '@/constants.ts';
import IconTrash from 'tabler-icons/trash.tsx';
import { assert } from 'std/testing/asserts.ts';
import { StateUpdater, useRef, useState } from 'preact/hooks';
import Input from '@/components/Input.tsx';

import { Database } from '@/utils/supabase_types.ts';
import Notice from '@/components/Notice.tsx';

type Client = Database['public']['Tables']['clients']['Update'];

async function requestCreateClient(client: Client) {
	const response = await fetch('/dashboard/api/client', {
		method: 'POST',
		body: JSON.stringify(client),
	});
	if (!response.ok) {
		return await response.json();
	}
	assert(response.ok);
}

function createClientInSignal(clients: Signal<Client[]>, client: Client) {
	clients.value = [...clients.value, client];
}

async function createClient(
	clients: Signal<Client[]>,
	email: string,
	options?: {
		setError: StateUpdater<string | null>;
	}
) {
	const newClient: Client = { email, user_id: crypto.randomUUID() };
	if (IS_BROWSER) {
		const response = await requestCreateClient(newClient);
		if (response) {
			options?.setError('Email ya se encuentra registrado');
			return;
		}
	}
	createClientInSignal(clients, newClient);
}

async function requestInviteClient(client: Client) {
	const response = await fetch('/dashboard/api/client', {
		method: 'PUT',
		body: JSON.stringify(client),
	});

	assert(response.ok);
}

function updateClientInSignal(
	clientsSignal: Signal<Client[]>,
	oldClient: Client,
	newClient: Client
) {
	clientsSignal.value = clientsSignal.value.filter(
		(p) => p.email !== oldClient.email
	);
	clientsSignal.value = [...clientsSignal.value, newClient];
}

async function inviteClient(
	clients: Signal<Client[]>,
	email: string | null | undefined
) {
	const client = clients.value.find((p) => p.email === email);
	if (!client) throw new Error('Client does not exists in signal');
	const newClient = {
		id: client?.user_id,
		customer_id: client?.customer_id,
		is_invited: !client?.is_invited,
		email: client?.email,
		created_at: client?.created_at,
	};
	if (IS_BROWSER) await requestInviteClient(newClient);
	updateClientInSignal(clients, client, newClient);
}

interface clientListProps {
	isAdmin: boolean;
	isSubscribed: boolean;
	patients: Client[];
}

export default function PatientsList(props: clientListProps) {
	const [errorMessage, setError] = useState<string | null>(null);
	const clients = useSignal(props.patients);
	const newClientRef = useRef<HTMLInputElement | null>(null);

	const isMoreTodos =
		props.isSubscribed || clients.value.length < FREE_PLAN_TODOS_LIMIT;

	return (
		<div class="space-y-4">
			<ul class="divide-y space-y-2">
				{clients.value.map((client) => (
					<li class="flex items-center justify-between gap-2 p-2">
						<div class="flex-1">{client.email}</div>
						{props.isAdmin ? (
							client.is_invited ? (
								<p>Invitado</p>
							) : (
								<Button
									class="px-4"
									onClick={async () => {
										await inviteClient(clients, client.email);
									}}
								>
									Invitar
								</Button>
							)
						) : (
							<IconTrash class="cursor-pointer text-red-600" />
						)}
					</li>
				))}
			</ul>
			{typeof errorMessage === 'string' && <Notice>{errorMessage}</Notice>}
			<form
				class="flex gap-4"
				onSubmit={async (event) => {
					event.preventDefault();
					props.isAdmin
						? await createClient(clients, newClientRef.current!.value, {
								setError,
						  })
						: null; // createclient() -> coming soon!
					newClientRef.current!.form!.reset();
				}}
			>
				<Input
					ref={newClientRef}
					disabled={!isMoreTodos}
					class="flex-1"
					required
				/>
				<Button disabled={!isMoreTodos} type="submit" class="px-4">
					+
				</Button>
			</form>
		</div>
	);
}
