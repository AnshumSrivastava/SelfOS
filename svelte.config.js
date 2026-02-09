import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
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
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/SelfOS' : '',
		},
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore favicon 404s during build
				if (path.includes('favicon.png')) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
