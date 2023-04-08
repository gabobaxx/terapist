// Copyright 2023 the Deno authors. All rights reserved. MIT license.
import { asset, Head as _Head } from '$fresh/runtime.ts';
import { SITE_DESCRIPTION, SITE_NAME } from '@/constants.ts';

interface HeadProps {
	title?: string;
	description?: string;
}

export default function Head({ title, description }: HeadProps) {
	return (
		<_Head>
			<title>{title ?? SITE_NAME}</title>
			<link rel="icon" href="/favicon.ico" sizes="32x32" />
			<link rel="stylesheet" href={asset('styles/main.css')} />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&display=swap"
				rel="stylesheet"
			/>
			<meta name="description" content={description ?? SITE_DESCRIPTION} />
		</_Head>
	);
}
