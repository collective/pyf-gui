import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { isoImport } from 'vite-plugin-iso-import';

const config: UserConfig = {
	plugins: [sveltekit(), isoImport()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	},
};

export default config;
