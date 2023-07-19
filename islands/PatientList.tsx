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

type Kid = {
	id?: string;
	name?: string;
	lastname?: string;
	age?: number;
	client_id?: string;
};

async function requestCreateKid(kid: Kid) {
	const response = await fetch('/dashboard/api/kid', {
		method: 'POST',
		body: JSON.stringify(kid),
	});
	if (!response.ok) {
		return await response.json();
	}
	assert(response.ok);
}

function createKidInSignal(kids: Signal<Kid[]>, kid: Kid) {
	kids.value = [...kids.value, kid];
}

async function createKid(
	kids: Signal<Kid[]>,
	name: string,
	lastname: string,
	age: number,
	client_id: string
) {
	const newKid: Kid = {
		id: crypto.randomUUID(),
		name,
		lastname,
		age,
		client_id,
	};
	// console.log(newKid);
	if (IS_BROWSER) {
		// const response = await requestCreateKid(newKid);
	}
	createKidInSignal(kids, newKid);
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

interface clientListProps {
	isAdmin: boolean;
	isSubscribed: boolean;
	patients: Client[];
	client_id: string;
	kids: Kid[];
	users: {
		id: string;
		aud: string;
		role: string;
		email: string;
		email_confirmed_at: string;
		invited_at: string;
		phone: string;
		confirmation_sent_at: string;
		confirmed_at: string;
		recovery_sent_at: string;
		last_sign_in_at: string;
		app_metadata: { provider: 'email'; providers: ['email'] };
		identities: null;
		created_at: string;
		updated_at: string;
	}[];
}

export default function PatientsList(props: clientListProps) {
	const [errorMessage, setError] = useState<string | null>(null);
	const clients = useSignal(props.patients);
	const kidsFromProps = useSignal(props.kids);
	const kids = useSignal(props.kids);
	const newClientRef = useRef<HTMLInputElement | null>(null);

	const kidNameRef = useRef<HTMLInputElement | null>(null);
	const kidLastnameRef = useRef<HTMLInputElement | null>(null);
	const kidAgeRef = useRef<HTMLInputElement | null>(null);

	const isMoreTodos =
		props.isSubscribed || clients.value.length < FREE_PLAN_TODOS_LIMIT;

	const isMoreKids = kids.value.length > 0;

	return (
		<div class="space-y-4">
			<>
				<ul class="divide-y space-y-2">
					<li class="flex items-center justify-between gap-2 p-2">
						<div class="flex-1">Paciente</div>
						<div class="flex-1">Edad</div>
						<div class="flex-1"></div>
						<div class="flex-2">Representante</div>
						<div class="flex-1"></div>
					</li>
					{clients.value.map((client) => (
						<li class="flex items-center justify-between gap-2 p-2">
							{client.kid && (
								<>
									<div class="flex-1">{client.kid.name}</div>
									<div class="flex-1">{client.kid.lastname}</div>
									<div class="flex-1">{client.kid.age} Años</div>
								</>
							)}
							<div class="flex-1"></div>
							<div class="flex-1"></div>
							<div class="flex-1"></div>
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

				{props.isAdmin ? (
					<>
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
								placeholder="Agrega un correo@electronico.com"
							/>
							<Button disabled={!isMoreTodos} type="submit" class="px-4">
								+
							</Button>
						</form>
					</>
				) : (
					<>
						<form
							class="flex gap-4"
							onSubmit={async (event) => {
								event.preventDefault();
								await createKid(
									kids,
									kidNameRef.current!.value,
									kidLastnameRef.current!.value,
									parseInt(kidAgeRef.current!.value),
									props.client_id
								);

								kidNameRef.current!.form!.reset();
								kidLastnameRef.current!.form!.reset();
								kidAgeRef.current!.form!.reset();
							}}
						>
							<Input
								ref={kidNameRef}
								disabled={!isMoreKids}
								class="flex-1"
								required
								placeholder="Nombre"
							/>
							<Input
								ref={kidLastnameRef}
								disabled={!isMoreKids}
								class="flex-1"
								required
								placeholder="Apellido"
							/>
							<Input
								disabled={!isMoreKids}
								ref={kidAgeRef}
								class="flex-2"
								required
								placeholder="Edad"
								type="number"
							/>
							<Button disabled={!isMoreKids} type="submit" class="px-4">
								+
							</Button>
						</form>
					</>
				)}
			</>
		</div>
	);
}
