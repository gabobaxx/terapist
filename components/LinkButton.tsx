// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { JSX } from 'preact';

export default function LinkButton(
	props: JSX.HTMLAttributes<HTMLAnchorElement>
) {
	return (
		<a
			{...props}
			class={`px-4 py-2 bg-white text-black text-2xl rounded-xl font-bold hover:bg-black hover:text-white transition duration-300 disabled:(opacity-50 cursor-not-allowed) ${
				props.class ?? ''
			}`}
		/>
	);
}
