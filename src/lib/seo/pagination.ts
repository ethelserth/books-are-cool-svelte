import { error, redirect } from '@sveltejs/kit';

export function archivePage(value: string, baseUrl: string): number {
	if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
		error(404, 'Page not found');
	}
	const page = Number(value);
	if (page === 1) redirect(308, baseUrl);
	return page;
}
