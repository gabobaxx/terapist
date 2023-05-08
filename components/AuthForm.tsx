import Input from '@/components/Input.tsx';
import Button from '@/components/Button.tsx';

interface AuthFormProps {
	type: 'Login' | 'Signup';
}

export default function AuthForm({ type }: AuthFormProps) {
	return (
		<form method="POST" class="space-y-4" action={`/api/${type.toLowerCase()}`}>
			<Input
				placeholder="email@gmail.com"
				name="email"
				type="email"
				required
				class="w-full max-w-screen-sm"
			/>
			<Button type="submit" class="w-full">
				{type}
			</Button>
		</form>
	);
}
