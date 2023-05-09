// * Components
import Nav from '@/components/Nav.tsx';
import Hero from '@/components/Hero.tsx';
import Header from '@/components/Header.tsx';
// * Utils
import { navItems } from '@/constants/constants.ts';

export default function TopSection() {
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
