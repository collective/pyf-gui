import { defineConfig, devices } from '@playwright/test';

const isPresenterMode = !!process.env.PRESENTER;

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: !isPresenterMode,
	workers: isPresenterMode ? 1 : undefined,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		headless: !isPresenterMode,
		viewport: isPresenterMode ? { width: 1920, height: 1080 } : undefined,
		launchOptions: {
			slowMo: isPresenterMode ? 1000 : 0,
			args: isPresenterMode ? ['--window-size=1920,1080'] : []
		}
	},
	projects: [
		{
			name: 'chromium',
			use: isPresenterMode
				? { browserName: 'chromium' }
				: { ...devices['Desktop Chrome'] }
		},
		{ name: 'mobile', use: { ...devices['Pixel 5'] } }
	],
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		url: 'http://localhost:4173',
		reuseExistingServer: !process.env.CI,
		timeout: 120000
	}
});
