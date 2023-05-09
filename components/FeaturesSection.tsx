import FeaturesList from '@/components/FeaturesList.tsx';
import { features } from '@/constants/constants.ts';

export default function FeaturesSection() {
	return (
		<>
			<div class="bg-secondary" id="features">
				<div class="px-8 py-16 max-w-7xl space-y-16 mx-auto text-white">
					<div class="flex md:flex-row flex-col gap-8">
						<FeaturesList features={features} />
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
