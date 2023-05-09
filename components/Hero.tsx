import LinkButton from '@/components/LinkButton.tsx';

export default function Hero() {
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
