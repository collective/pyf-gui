import { test, expect } from './fixtures';

// These tests run only on desktop since mobile has different search UI behavior
test.describe('Live Search', () => {
	test.beforeEach(async ({ searchPage, page }, testInfo) => {
		// Skip mobile project - mobile has hidden search filters
		if (testInfo.project.name === 'mobile') {
			test.skip();
		}
		await searchPage.goto();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
	});

	test.describe('Input Persistence', () => {
		test('search input value persists during character-by-character typing', async ({ searchPage }) => {
			// Type slowly, simulating real user input
			await searchPage.typeSlowly('volto', 100);

			// Verify the input still contains the full typed text
			const value = await searchPage.getSearchInputValue();
			expect(value).toBe('volto');
		});

		test('input does not flash or clear during debounce period', async ({ searchPage }) => {
			// Type a character
			await searchPage.searchInput.fill('v');

			// Sample the input value multiple times during debounce period (300ms)
			const valuesDuringDebounce = await searchPage.getInputValuesDuring(300, 6);

			// All sampled values should be 'v' (no flash/clear)
			for (const value of valuesDuringDebounce) {
				expect(value).toBe('v');
			}
		});

		test('typing multiple characters rapidly preserves all input', async ({ searchPage, page }) => {
			// Type rapidly
			await searchPage.typeSlowly('plone', 30);

			// Wait a moment for any potential flash
			await page.waitForTimeout(100);

			// Verify input wasn't cleared
			const value = await searchPage.getSearchInputValue();
			expect(value).toBe('plone');
		});
	});

	test.describe('URL Updates', () => {
		test('URL contains search term after debounce completes', async ({ searchPage, page }) => {
			// Type and wait for debounce
			await searchPage.search('volto');

			// Check URL contains the search term
			expect(page.url()).toContain('q=volto');
		});

		test('URL updates only once after rapid typing', async ({ searchPage, page }) => {
			// Type multiple characters rapidly
			await searchPage.typeSlowly('test', 50);

			// Wait for debounce to complete
			await page.waitForTimeout(500);

			// URL should contain the final term
			expect(page.url()).toContain('q=test');

			// Verify URL has proper query format (no duplicate q params)
			const url = new URL(page.url());
			const qParams = url.searchParams.getAll('q');
			expect(qParams.length).toBe(1);
		});
	});

	test.describe('Results Update', () => {
		test('search results update after typing completes', async ({ searchPage, page }) => {
			// Search for a term
			await searchPage.search('volto');

			// Wait for results
			await page.waitForLoadState('networkidle');

			// Check that results contain relevant packages
			const names = await searchPage.getPackageNames();
			const hasVoltoPackage = names.some(name => name.toLowerCase().includes('volto'));
			expect(hasVoltoPackage).toBe(true);
		});
	});

	test.describe('Browser Navigation', () => {
		test('browser back restores previous search state', async ({ searchPage, page }) => {
			// Perform first search
			await searchPage.search('volto');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(200);

			// Perform second search
			await searchPage.search('plone');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(200);

			// Go back
			await page.goBack();
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(300);

			// Verify the input has the previous search term
			const value = await searchPage.getSearchInputValue();
			expect(value).toBe('volto');
		});

		test('browser forward restores next search state', async ({ searchPage, page }) => {
			// Perform first search
			await searchPage.search('volto');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(200);

			// Perform second search
			await searchPage.search('plone');
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(200);

			// Go back then forward
			await page.goBack();
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(300);
			await page.goForward();
			await page.waitForLoadState('networkidle');
			await page.waitForTimeout(300);

			// Verify the input has the forward search term
			const value = await searchPage.getSearchInputValue();
			expect(value).toBe('plone');
		});

		test('URL params load correctly on initial page load', async ({ searchPage }) => {
			await searchPage.gotoWithParams('q=collective');

			// Verify the input has the URL search term
			const value = await searchPage.getSearchInputValue();
			expect(value).toBe('collective');
		});
	});

	test.describe('Edge Cases', () => {
		test('clearing input updates URL correctly', async ({ searchPage, page }) => {
			// Search then clear
			await searchPage.search('volto');
			await searchPage.searchInput.clear();
			await page.waitForTimeout(400);

			// URL should not have a q parameter (or have q=* which is default)
			const url = page.url();
			const hasEmptyQ = !url.includes('q=') || url.includes('q=%2A') || url.includes('q=*');
			expect(hasEmptyQ).toBe(true);
		});

		test('special characters in search term are handled', async ({ searchPage, page }) => {
			await searchPage.search('plone-addon');
			expect(page.url()).toContain('q=plone-addon');
		});
	});
});
