import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: false,
      strict: true
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