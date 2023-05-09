import Head from '@/components/Head.tsx';
import Logo from '@/components/Logo.tsx';
import Notice from '@/components/Notice.tsx';
import AuthForm from '@/components/AuthFormWithPassword.tsx';

import type { Handlers, PageProps } from '$fresh/server.ts';

export const handler: Handlers = {
	GET(req, ctx) {
		if (req.headers.get('cookie')?.includes('supabase-auth-token'))
			return new Response(null, {
				status: 302,
				headers: {
					location: '/dashboard/account',
				},
			});

		return ctx.render({ ...ctx.state });
	},
};

export default function SignupPage(props: PageProps) {
	const errorMessage = props.url.searchParams.get('error');

	return (
		<>
			<Head title="Signup" />
			<div class="max-w-xs flex h-screen m-auto">
				<div class="m-auto w-72">
					<a href="/">
						<Logo class="mb-8" />
					</a>
					{errorMessage === 'User already registered' && (
						<Notice>{errorMessage}</Notice>
					)}
					<AuthForm type="Signup" />
					<hr class="my-4" />

					<div class="text-center text-gray-500 hover:text-black mt-8">
						<a href="/login">Ya tienes una cuenta? Ingresa</a>
					</div>
				</div>
			</div>
		</>
	);
}
