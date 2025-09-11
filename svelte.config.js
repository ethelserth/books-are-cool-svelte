import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      // Don't set global runtime - let Vercel auto-detect
    }),
    prerender: {
      entries: [
        '/',
        '/reviews',
        '/tags'
      ],
      crawl: true,
      handleMissingId: 'warn',
      handleHttpError: ({ path, referrer, message }) => {
        console.warn(`Prerender error: ${path} (${message})`);
        if (referrer) console.warn(`  referred from: ${referrer}`);
        return;
      }
    }
  }
};

export default config;