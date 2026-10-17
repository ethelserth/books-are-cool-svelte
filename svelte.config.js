import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({ runtime: 'nodejs22.x' }),
		prerender: {
			entries: ['/', '/reviews', '/tags'],
			crawl: true,
			handleMissingId: 'warn',
			handleHttpError: 'fail'
		}
	}
};

export default config;
