import type { features } from '@/constants/constants.ts';

interface FeaturesListProps {
	features: typeof features;
}

export default function FeaturesList({ features }: FeaturesListProps) {
	return (
		<>
			{features.map((feature) => (
				<div class="flex-1 space-y-2 text-center">
					<feature.icon class="h-12 w-auto mx-auto" />
					<h2 class="text-2xl font-bold">{feature.title}</h2>
					<p>{feature.description}</p>
				</div>
			))}
		</>
	);
}
