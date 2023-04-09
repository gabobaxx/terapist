import Button from '@/components/Button.tsx';
import { type Signal, useSignal } from '@preact/signals';
import { IS_BROWSER } from '$fresh/runtime.ts';

import type { Todo } from '@/utils/todos.ts';
import type { Vaccine } from '@/utils/vaccines.ts';

import { FREE_PLAN_TODOS_LIMIT } from '@/constants.ts';
import IconTrash from 'tabler-icons/trash.tsx';
import { assert } from 'std/testing/asserts.ts';
import { useRef } from 'preact/hooks';
import Input from '@/components/Input.tsx';

async function requestAddVaccine(vaccine: Vaccine) {
	const response = await fetch('/dashboard/api/vaccine', {
		method: 'POST',
		body: JSON.stringify(vaccine),
	});
	assert(response.ok);
}

function addVaccineInSignal(vaccines: Signal<Vaccine[]>, vaccine: Vaccine) {
	vaccines.value = [...vaccines.value, vaccine];
}

async function addVaccine(
	vaccines: Signal<Vaccine[]>,
	name: string,
	quantity: number
) {
	const newVaccine: Vaccine = { name, quantity, id: crypto.randomUUID() };
	if (IS_BROWSER) await requestAddVaccine(newVaccine);
	addVaccineInSignal(vaccines, newVaccine);
}

async function requestDeleteVaccine(id: string) {
	const response = await fetch('/dashboard/api/vaccine', {
		method: 'DELETE',
		body: JSON.stringify({ id }),
	});
	assert(response.ok);
}

function deleteVaccineInSignal(vaccines: Signal<Vaccine[]>, id: string) {
	vaccines.value = vaccines.value.filter((vaccine) => vaccine.id !== id);
}

async function deleteVaccine(vaccines: Signal<Vaccine[]>, id: string) {
	if (IS_BROWSER) await requestDeleteVaccine(id);
	deleteVaccineInSignal(vaccines, id);
}

interface VaccinesListProps {
	isSubscribed: boolean;
	vaccines: Vaccine[];
}

export default function VaccinesList(props: VaccinesListProps) {
	const vaccines = useSignal(props.vaccines);
	const newVaccineNameRef = useRef<HTMLInputElement | null>(null);
	const newVaccineQuantityRef = useRef<HTMLInputElement | null>(null);

	const isMoreTodos =
		props.isSubscribed || vaccines.value.length < FREE_PLAN_TODOS_LIMIT;

	return (
		<div class="space-y-4">
			<ul class="divide-y space-y-2">
				{vaccines.value.map((vaccine) => (
					<li class="flex items-center justify-between gap-2 p-2">
						<div class="flex-1">{vaccine.name}</div>
						<div class="flex-1">{vaccine.quantity}</div>
						<IconTrash
							onClick={async () => await deleteVaccine(vaccines, vaccine.id)}
							class="cursor-pointer text-red-600"
						/>
					</li>
				))}
			</ul>
			<form
				class="flex gap-4"
				onSubmit={async (event) => {
					event.preventDefault();

					await addVaccine(
						vaccines,
						newVaccineNameRef.current!.value,
						parseInt(newVaccineQuantityRef.current!.value)
					);
					newVaccineNameRef.current!.form!.reset();
				}}
			>
				<Input
					ref={newVaccineNameRef}
					disabled={!isMoreTodos}
					class="flex-1"
					required
				/>
				<Input
					ref={newVaccineQuantityRef}
					disabled={!isMoreTodos}
					class="flex-2"
					required
					type="number"
				/>
				<Button disabled={!isMoreTodos} type="submit" class="px-4">
					+
				</Button>
			</form>
		</div>
	);
}
