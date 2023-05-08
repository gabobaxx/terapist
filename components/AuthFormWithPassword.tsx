// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import Input from './Input.tsx';
import Button from './Button.tsx';

interface AuthFormProps {
	type: 'Login' | 'Signup';
}

export default function AuthFormWithEmail({ type }: AuthFormProps) {
	return (
		<form method="POST" class="space-y-4" action={`/api/${type.toLowerCase()}`}>
			<Input
				placeholder="email@gmail.com"
				name="email"
				type="email"
				required
				class="w-full max-w-screen-sm"
			/>
			<Input
				placeholder="Clave de 6 digitos"
				name="password"
				type="password"
				required
				class="w-full"
			/>
			<Button type="submit" class="w-full">
				{type}
			</Button>
		</form>
	);
}
