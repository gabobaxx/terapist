import { assert } from 'std/testing/asserts.ts';
import { Database } from '@/utils/supabase_types.ts';
import { FREE_PLAN_TODOS_LIMIT } from '@/constants.ts';
import { IS_BROWSER } from '$fresh/runtime.ts';
import { type Signal, useSignal } from '@preact/signals';
import { useRef, useState, StateUpdater, MutableRef } from 'preact/hooks';
import Button from '@/components/Button.tsx';
import Input from '@/components/Input.tsx';

import { JSX } from 'preact/jsx-runtime';
import Notice from '@/components/Notice.tsx';
import IconTrash from 'https://deno.land/x/tabler_icons_tsx@0.0.2/tsx/trash.tsx';

type ClientFromDB = Database['public']['Tables']['clients']['Update'];

type Kid = {
	id?: string;
	name?: string;
	lastname?: string;
	age?: number;
	client_id?: string;
};

interface Client extends ClientFromDB {
	kid?: Kid;
}

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
		is_invited: client?.is_invited,
		email: client?.email,
		created_at: client?.created_at,
		kid: client?.kid,
	};

	if (IS_BROWSER) await requestInviteClient(newClient);
	updateClientInSignal(clients, client, newClient);
}

async function requestDeleteClient(id: string | undefined) {
	const response = await fetch('/dashboard/api/client', {
		method: 'DELETE',
		body: JSON.stringify({ id }),
	});
	assert(response.ok);
}

function deleteClientInSignal(
	clients: Signal<Client[]>,
	id: string | undefined
) {
	clients.value = clients.value.filter((client) => client.user_id !== id);
}
async function deleteClient(clients: Signal<Client[]>, id: string | undefined) {
	if (IS_BROWSER) await requestDeleteClient(id);
	deleteClientInSignal(clients, id);
}

interface AdminPatientsListProps {
	isAdmin: boolean;
	isSubscribed: boolean;
	patients: Client[];
}

export default function AdminPatientsList(props: AdminPatientsListProps) {
	const clients = useSignal(props.patients);
	const [timer, setTimer] = useState(false);
	const [notice, setNotice] = useState(false);
	const newClientRef = useRef<HTMLInputElement | null>(null);
	const errorMessage = useSignal<string | null>(null);
	const isMoreTodos =
		props.isSubscribed || clients.value.length < FREE_PLAN_TODOS_LIMIT;

	const onSubmit = async (event: JSX.TargetedEvent<HTMLFormElement, Event>) => {
		event.preventDefault();

		const newClient: Client = {
			email: newClientRef.current!.value,
			user_id: crypto.randomUUID(),
		};

		const response = await requestCreateClient(newClient);
		if (response) {
			errorMessage.value = `Email ya se encuentra registrado. ¡Prueba con otro!`;
			newClientRef.current!.form!.reset();
			return;
		}

		createClientInSignal(clients, newClient);

		errorMessage.value = ``;
		newClientRef.current!.form!.reset();
	};

	return (
		<div>
			{notice && (
				<Notice class="mb-4 bg-green-300 text-green-700">
					Cliente invitado con éxito, revisa el correo electronico para ver la
					invitación!
				</Notice>
			)}
			<table className="min-w-full text-left text-sm font-light">
				<thead className="border-b font-medium dark:border-neutral-500">
					<tr>
						<th scope="col" className="px-6 py-4">
							Paciente
						</th>
						<th scope="col" className="px-6 py-4">
							Edad
						</th>
						<th scope="col" className="px-6 py-4">
							Representante
						</th>
					</tr>
				</thead>
				<tbody>
					{clients.value.map((client) => {
						return (
							<tr className="border-b dark:border-neutral-500">
								{client.kid?.name ? (
									<>
										<td className="whitespace-nowrap px-6 py-4 font-medium">
											{client.kid.name} {client.kid.lastname}
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											{client.kid.age} Años
										</td>
									</>
								) : (
									<>
										<td className="whitespace-nowrap px-6 py-4 font-medium text-red-700">
											No ha agregado paciente
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-red-700">
											0 Años
										</td>
									</>
								)}
								<td className="whitespace-nowrap px-6 py-4">{client.email}</td>

								{!client.is_invited && (
									<>
										<td className="whitespace-nowrap px-6 py-4">
											<Button
												class="px-4 flex-1"
												onClick={async () => {
													setTimer(true);
													await inviteClient(clients, client.email);
													setTimer(false);
													setNotice(true);
												}}
												disabled={timer}
											>
												{timer ? 'Invitando...' : 'Invitar'}
											</Button>
										</td>
										<td className="whitespace-nowrap px-6 py-4">
											<IconTrash
												class="cursor-pointer text-red-600 flex-1"
												onClick={async () =>
													await deleteClient(clients, client?.user_id)
												}
											/>
										</td>
									</>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>

			<form
				class={
					errorMessage.value
						? `flex flex-col gap-4 mt-4`
						: `flex flex-col gap-4 mt-4 lg:flex-row`
				}
				onSubmit={onSubmit}
			>
				{errorMessage.value && (
					<Notice class="bg-red-100 text-red-700 flex-1">
						{errorMessage.value}
					</Notice>
				)}
				<Input
					class="flex-1"
					disabled={!isMoreTodos}
					placeholder="Agrega un correo@electronico.com"
					ref={newClientRef}
					required
					type="email"
				/>
				<Button disabled={!isMoreTodos} type="submit" class="px-4">
					+
				</Button>
			</form>
		</div>
	);
}
