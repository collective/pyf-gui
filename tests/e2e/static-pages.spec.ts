import { test, expect } from './fixtures';

test.describe('Static Pages', () => {
	test('loads about page', async ({ page }) => {
		await page.goto('/about');

		// Check for about page content
		const heading = page.locator('h1, h2').first();
		await expect(heading).toBeVisible();
	});

	test('loads help page', async ({ page }) => {
		await page.goto('/help');

		// Check for help page content
		const heading = page.locator('h1, h2').first();
		await expect(heading).toBeVisible();
	});

	test('navigates between pages via header links', async ({ page }) => {
		// Start at home
		await page.goto('/');
		await page.waitForLoadState('networkidle');

		// Click about link and wait for navigation
		const aboutLink = page.locator('.site-header__link[href="/about"]');
		await expect(aboutLink).toBeVisible();

		// Click first, then wait for URL change (avoids race with client-side routing)
		await aboutLink.click();
		await page.waitForURL('**/about');

		// Verify we're on about page
		const aboutUrl = await page.evaluate(() => window.location.pathname);
		expect(aboutUrl).toBe('/about');

		// Click help link
		const helpLink = page.locator('.site-header__link[href="/help"]');
		await expect(helpLink).toBeVisible();

		await helpLink.click();
		await page.waitForURL('**/help');

		// Verify we're on help page
		const helpUrl = await page.evaluate(() => window.location.pathname);
		expect(helpUrl).toBe('/help');

		// Navigate back to home
		const homeLink = page.locator('.site-header__link[href="/"]');
		await expect(homeLink).toBeVisible();

		await homeLink.click();
		await page.waitForURL(/\/$|localhost:\d+$/);

		// Verify we're on home page
		const homeUrl = await page.evaluate(() => window.location.pathname);
		expect(homeUrl).toBe('/');
	});
});
