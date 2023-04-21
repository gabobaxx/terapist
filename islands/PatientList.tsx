import Button from '@/components/Button.tsx';
import { type Signal, useSignal } from '@preact/signals';
import { IS_BROWSER } from '$fresh/runtime.ts';
import { FREE_PLAN_TODOS_LIMIT } from '@/constants.ts';
import IconTrash from 'tabler-icons/trash.tsx';
import { assert } from 'std/testing/asserts.ts';
import { useRef } from 'preact/hooks';
import Input from '@/components/Input.tsx';

import { Database } from '@/utils/supabase_types.ts';

type Client = Database['public']['Tables']['clients']['Update'];

async function requestCreateClient(client: Client) {
	const response = await fetch('/dashboard/api/client', {
		method: 'POST',
		body: JSON.stringify(client),
	});
	assert(response.ok);
}

function createClientInSignal(clients: Signal<Client[]>, client: Client) {
	clients.value = [...clients.value, client];
}

// user_id: string;
// customer_id: string; -> customer_id (el id de las clinicas)
// email: string | null;
// created_at: string | null;

async function createClient(clients: Signal<Client[]>, email: string) {
	const newClient: Client = { email, id: crypto.randomUUID() };
	if (IS_BROWSER) await requestCreateClient(newClient);
	createClientInSignal(clients, newClient);
}

interface PatientListProps {
	isAdmin: boolean;
	isSubscribed: boolean;
	patients: Client[];
}

export default function PatientList(props: PatientListProps) {
	const patients = useSignal(props.patients);
	const newPatientRef = useRef<HTMLInputElement | null>(null);

	const isMoreTodos =
		props.isSubscribed || patients.value.length < FREE_PLAN_TODOS_LIMIT;

	return (
		<div class="space-y-4">
			<ul class="divide-y space-y-2">
				{patients.value.map((client) => (
					<li class="flex items-center justify-between gap-2 p-2">
						<div class="flex-1">{client.email}</div>
						<IconTrash class="cursor-pointer text-red-600" />
					</li>
				))}
			</ul>
			<form
				class="flex gap-4"
				onSubmit={async (event) => {
					event.preventDefault();
					props.isAdmin
						? await createClient(patients, newPatientRef.current!.value)
						: null; // createPatient() -> coming soon!
					newPatientRef.current!.form!.reset();
				}}
			>
				<Input
					ref={newPatientRef}
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
