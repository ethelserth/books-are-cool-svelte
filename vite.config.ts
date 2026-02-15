import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss()
  ],
  server: {
		host: 'wsl.booksarecool.gr',
		port: 8080,
		strictPort: true
	}
});