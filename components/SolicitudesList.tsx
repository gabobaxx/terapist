type SolicitudesListProps = {
	solicitudes: {
		id: string;
		vaccine: string | null | undefined;
		date: Date;
		user: {
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
		};
	}[];
};
export default function SolicitudesList(props: SolicitudesListProps) {
	return (
		<div class="space-y-4">
			<ul class="divide-y space-y-2">
				<li class="flex items-center justify-between gap-2 p-2">
					<div class="flex-1">Fecha</div>
					<div class="flex-1">Nombre de Vacuna</div>
					<div class="flex-1">Paciente</div>
				</li>
				{props.solicitudes.map((solicitude) => (
					<li class="flex items-center justify-between gap-2 p-2">
						<div class="flex-1">
							{solicitude.date.toLocaleString('es-US', {
								timeZone: 'America/Caracas',
							})}
						</div>
						<div class="flex-1">{solicitude.vaccine}</div>
						{solicitude.user.kid ? (
							<>
								<div class="flex-1">
									{solicitude.user.kid.name} {solicitude.user.kid.lastname} (
									{solicitude.user.kid.age} años)
								</div>
							</>
						) : (
							<div class="flex-1">{solicitude.user.email}</div>
						)}
						{/* <IconTrash
							onClick={async () => await updateDate(todos, todo.id)}
							class="cursor-pointer text-red-600"
						/> */}
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * TODO -> Update date of solicitude
 * ? let users change the solicitude date
 * ? or add +30 or +1h to date
 */

// async function requestCreateTodo(todo: Todo) {
//   const response = await fetch("/dashboard/api/todo", {
//     method: "POST",
//     body: JSON.stringify(todo),
//   });
//   assert(response.ok);
// }

// function createTodoInSignal(todos: Signal<Todo[]>, todo: Todo) {
//   todos.value = [...todos.value, todo];
// }

// async function createTodo(
//   todos: Signal<Todo[]>,
//   name: string,
// ) {
//   const newTodo: Todo = { name, id: crypto.randomUUID() };
//   if (IS_BROWSER) await requestCreateTodo(newTodo);
//   createTodoInSignal(todos, newTodo);
// }

// async function requestDeleteTodo(id: string) {
//   const response = await fetch("/dashboard/api/todo", {
//     method: "DELETE",
//     body: JSON.stringify({ id }),
//   });
//   assert(response.ok);
// }

// function deleteTodoInSignal(todos: Signal<Todo[]>, id: string) {
//   todos.value = todos.value.filter((todo) => todo.id !== id);
// }

// async function deleteTodo(
//   todos: Signal<Todo[]>,
//   id: string,
// ) {
//   if (IS_BROWSER) await requestDeleteTodo(id);
//   deleteTodoInSignal(todos, id);
// }
