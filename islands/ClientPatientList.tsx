import { assert } from 'std/testing/asserts.ts';
import { IS_BROWSER } from '$fresh/runtime.ts';
import { type Signal, useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';

import Button from '@/components/Button.tsx';
import Input from '@/components/Input.tsx';

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
		const response = await requestCreateKid(newKid);
	}
	createKidInSignal(kids, newKid);
}

interface ClientPatientsListProps {
	client_id: string;
	kids: Kid[];
}

export default function ClientPatientsList(props: ClientPatientsListProps) {
	const kids = useSignal(props.kids);
	const isMoreKids = kids.value.length <= 10;
	const kidAgeRef = useRef<HTMLInputElement | null>(null);
	const kidNameRef = useRef<HTMLInputElement | null>(null);
	const kidLastnameRef = useRef<HTMLInputElement | null>(null);

	return (
		<>
			<table className="min-w-full text-left text-sm font-light">
				<thead className="border-b font-medium dark:border-neutral-500">
					<tr>
						<th scope="col" className="px-6 py-4">
							Nombre
						</th>
						<th scope="col" className="px-6 py-4">
							Apellido
						</th>
						<th scope="col" className="px-6 py-4">
							Edad
						</th>
					</tr>
				</thead>
				<tbody>
					{kids.value.map((kid) => {
						return (
							<tr className="border-b dark:border-neutral-500">
								<td className="whitespace-nowrap px-6 py-4 font-medium">
									{kid.name}
								</td>
								<td className="whitespace-nowrap px-6 py-4 font-medium">
									{kid.lastname}
								</td>
								<td className="whitespace-nowrap px-6 py-4">{kid.age} Años</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<form
				class="flex flex-col gap-4 lg:flex-row"
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
	);
}
