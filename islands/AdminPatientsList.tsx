import { assert } from 'std/testing/asserts.ts';
import { Database } from '@/utils/supabase_types.ts';
import { FREE_PLAN_TODOS_LIMIT } from '@/constants.ts';
import { IS_BROWSER } from '$fresh/runtime.ts';
import { type Signal, useSignal } from '@preact/signals';
import { useRef, useState, StateUpdater } from 'preact/hooks';
import Button from '@/components/Button.tsx';
import Input from '@/components/Input.tsx';

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

interface AdminPatientsListProps {
	isAdmin: boolean;
	isSubscribed: boolean;
	patients: Client[];
}

export default function AdminPatientsList(props: AdminPatientsListProps) {
	const clients = useSignal(props.patients);
	const newClientRef = useRef<HTMLInputElement | null>(null);
	const [errorMessage, setError] = useState<string | null>(null);

	const isMoreTodos =
		props.isSubscribed || clients.value.length < FREE_PLAN_TODOS_LIMIT;

	return (
		<>
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
								{client.kid ? (
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
											No ha agregado
										</td>
										<td className="whitespace-nowrap px-6 py-4 text-red-700">
											paciente
										</td>
									</>
								)}
								<td className="whitespace-nowrap px-6 py-4">{client.email}</td>
								<td className="whitespace-nowrap px-6 py-4">
									{client.is_invited ? (
										<p>(Invitado)</p>
									) : (
										<Button
											class="px-4"
											onClick={async () => {
												await inviteClient(clients, client.email);
											}}
										>
											Invitar
										</Button>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<form
				class="flex gap-4 mt-4"
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
					placeholder="Agrega un correo@electronico.com"
				/>
				<Button disabled={!isMoreTodos} type="submit" class="px-4">
					+
				</Button>
			</form>
		</>
	);
}
