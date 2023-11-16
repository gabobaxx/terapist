import type { Handlers, PageProps } from '$fresh/server.ts';
import Logo from '@/components/Logo.tsx';
import Head from '@/components/Head.tsx';
import AuthForm from '@/components/AuthForm.tsx';
import Notice from '@/components/Notice.tsx';
import OAuthLoginButton from '@/components/OAuthLoginButton.tsx';
import { GitHub } from '@/components/Icons.tsx';

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

export default function LoginPage(props: PageProps) {
	const errorMessage = props.url.searchParams.get('error');
	const success = props.url.searchParams.get('success');

	return (
		<>
			<Head title="Login" />
			<div class="max-w-xs flex h-screen m-auto">
				<div class="m-auto w-72">
					<a href="/">
						<Logo class="mb-8" />
					</a>
					{errorMessage === 'Signups not allowed for otp' && (
						<div>
							<Notice class="mb-4 bg-red-300 text-red-700">
								Usuario no encontrado
							</Notice>
						</div>
					)}

					{success === 'true' && (
						<div>
							<Notice class="mb-4 bg-green-300 text-green-700">
								Te hemos enviado el link de acceso. ¡Revisa tu correo
								electronico!
							</Notice>
						</div>
					)}

					<AuthForm type="Login" />
					<hr class="my-4" />

					<div class="text-center text-gray-500 hover:text-black mt-8">
						<a href="/signup">¿No tienes una cuenta? Crear una</a>
					</div>
				</div>
			</div>
		</>
	);
}
