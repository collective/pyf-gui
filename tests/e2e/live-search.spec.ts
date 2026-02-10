import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

// These tests run only on desktop since mobile has different search UI behavior
test.describe('Live Search - Input Persistence', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }, testInfo) => {
		if (testInfo.project.name === 'mobile') {
			test.skip();
			return;
		}
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
	});

	test.afterAll(async () => {
		if (page) {
			await page.close();
		}
	});

	test('search input value persists during character-by-character typing', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Type slowly, simulating real user input
		await searchPage.typeSlowly('volto', 100);

		// Verify the input still contains the full typed text
		const value = await searchPage.getSearchInputValue();
		expect(value).toBe('volto');

		// Clear for next test
		await searchPage.clearSearchInput();
	});

	test('input does not flash or clear during debounce period', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Type a character
		await searchPage.searchInput.fill('v');

		// Sample the input value multiple times during debounce period (300ms)
		const valuesDuringDebounce = await searchPage.getInputValuesDuring(300, 6);

		// All sampled values should be 'v' (no flash/clear)
		for (const value of valuesDuringDebounce) {
			expect(value).toBe('v');
		}

		// Clear for next test
		await searchPage.clearSearchInput();
	});

	test('typing multiple characters rapidly preserves all input', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Type rapidly
		await searchPage.typeSlowly('plone', 30);

		// Wait a moment for any potential flash
		await page.waitForTimeout(100);

		// Verify input wasn't cleared
		const value = await searchPage.getSearchInputValue();
		expect(value).toBe('plone');

		// Clear for next test
		await searchPage.clearSearchInput();
	});
});

test.describe('Live Search - URL Updates', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }, testInfo) => {
		if (testInfo.project.name === 'mobile') {
			test.skip();
			return;
		}
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
	});

	test.afterAll(async () => {
		if (page) {
			await page.close();
		}
	});

	test('URL contains search term after debounce completes', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Type and wait for debounce
		await searchPage.search('volto');

		// Check URL contains the search term
		expect(page.url()).toContain('q=volto');

		// Clear for next test
		await searchPage.clearSearchInput();
	});

	test('URL updates only once after rapid typing', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

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

		// Clear for next test
		await searchPage.clearSearchInput();
	});
});

test.describe('Live Search - Results Update', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }, testInfo) => {
		if (testInfo.project.name === 'mobile') {
			test.skip();
			return;
		}
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
	});

	test.afterAll(async () => {
		if (page) {
			await page.close();
		}
	});

	test('search results update after typing completes', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Search and wait for results to render
		await searchPage.searchAndWait('volto');

		// Check that results contain relevant packages
		const names = await searchPage.getPackageNames();
		const hasVoltoPackage = names.some(name => name.toLowerCase().includes('volto'));
		expect(hasVoltoPackage).toBe(true);
	});
});

test.describe('Live Search - Browser Navigation', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }, testInfo) => {
		if (testInfo.project.name === 'mobile') {
			test.skip();
			return;
		}
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
	});

	test.afterAll(async () => {
		if (page) {
			await page.close();
		}
	});

	test('browser back restores previous search state', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

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

	test('browser forward restores next search state', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Reset to home first to clear history from previous test
		await searchPage.goto();
		await page.waitForLoadState('networkidle');

		// Perform first search and wait for URL to update
		await searchPage.searchAndWait('volto');

		// Perform second search and wait for URL to update
		await searchPage.searchAndWait('plone');

		// Go back - wait for input value to actually change
		await page.goBack();
		await expect(searchPage.searchInput).toHaveValue('volto', { timeout: 5000 });

		// Go forward - wait for input value to change to expected value
		await page.goForward();
		await expect(searchPage.searchInput).toHaveValue('plone', { timeout: 5000 });

		// Final verification
		const value = await searchPage.getSearchInputValue();
		expect(value).toBe('plone');
	});

	test('URL params load correctly on initial page load', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		await searchPage.gotoWithParams('q=collective');

		// Verify the input has the URL search term
		const value = await searchPage.getSearchInputValue();
		expect(value).toBe('collective');
	});
});

test.describe('Live Search - Edge Cases', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }, testInfo) => {
		if (testInfo.project.name === 'mobile') {
			test.skip();
			return;
		}
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);
	});

	test.afterAll(async () => {
		if (page) {
			await page.close();
		}
	});

	test('clearing input updates URL correctly', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		// Search and wait for results, then clear
		await searchPage.searchAndWait('volto');
		await searchPage.searchInput.clear();

		// Wait for URL to drop the q parameter (debounce + goto)
		await page.waitForFunction(
			() => {
				const url = new URL(window.location.href);
				return !url.searchParams.has('q');
			},
			null,
			{ timeout: 5000 }
		);

		const url = page.url();
		const hasEmptyQ = !url.includes('q=') || url.includes('q=%2A') || url.includes('q=*');
		expect(hasEmptyQ).toBe(true);
	});

	test('special characters in search term are handled', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Mobile has different search UI');

		await searchPage.search('plone-addon');
		expect(page.url()).toContain('q=plone-addon');
	});
});
