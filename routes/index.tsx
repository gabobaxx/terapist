// * Components
import Nav from '@/components/Nav.tsx';
import Head from '@/components/Head.tsx';
import Header from '@/components/Header.tsx';
import LinkButton from '@/components/LinkButton.tsx';
// * Icons
import IconPrompt from 'tabler-icons/prompt.tsx';
import IconCheckbox from 'tabler-icons/checkbox.tsx';
import IconListDetails from 'tabler-icons/list-details.tsx';

function Hero() {
	return (
		<div class="text-center px-8 py-16 max-w-7xl mx-auto text-white space-y-8 flex-1 flex flex-col justify-center mt-[-112px]">
			<h1 class="font-bold text-3xl md:text-8xl">Bienvenido a Terapist.</h1>
			<p class="text-md md:text-2xl">
				Terapist es un sistema web para la planificación y control de vacunación
				infantil.
			</p>
			<div class="flex justify-center gap-8 flex-wrap">
				<LinkButton href="/signup">Probar</LinkButton>
				<LinkButton
					href="/blog"
					class="!bg-white border-2 border-blue-700 text-blue-700 hover:border-black hover:text-black transition duration-300"
				>
					¿Cómo funciona?
				</LinkButton>
			</div>
		</div>
	);
}

function TopSection() {
	const navItems = [
		{
			href: '/blog',
			inner: 'Blog',
		},
		{
			href: '/dashboard',
			inner: 'Dashboard',
		},
	];

	return (
		<div
			style="background-image: url('/hero-dark.svg')"
			class="min-h-screen bg-cover flex flex-col"
		>
			<Header class="text-white">
				<Nav items={navItems} />
			</Header>
			<Hero />
		</div>
	);
}

function FeaturesSection() {
	const features = [
		{
			icon: IconListDetails,
			title: 'Planificacion',
			description: 'Planifica la vacunacion de tus pacientes.',
		},
		{
			icon: IconCheckbox,
			title: 'Automatizacion',
			description: 'Genera automaticamente las citas de vacunacion.',
		},
		{
			icon: IconPrompt,
			title: 'Control',
			description: 'Controla toda la vacunacion de tus pacientes.',
		},
	];

	return (
		<>
			<div class="bg-secondary" id="features">
				<div class="px-8 py-16 max-w-7xl space-y-16 mx-auto text-white">
					<div class="flex md:flex-row flex-col gap-8">
						{features.map((feature) => (
							<div class="flex-1 space-y-2 text-center">
								<feature.icon class="h-12 w-auto mx-auto" />
								<h2 class="text-2xl font-bold">{feature.title}</h2>
								<p>{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>
			<div
				class="h-16 bg-cover bg-bottom w-full"
				style="background-image: url('/transition.svg')"
			></div>
		</>
	);
}

export default function HomePage() {
	return (
		<>
			<Head />
			<TopSection />
			<FeaturesSection />
		</>
	);
}
