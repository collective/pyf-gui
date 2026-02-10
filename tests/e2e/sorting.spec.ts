import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

const SORT_STORAGE_KEY = 'pyf_sort';

test.describe('Sorting', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('displays sort dropdown above results', async () => {
		// Sort select should be visible
		await expect(searchPage.sortSelect).toBeVisible();

		// Should be within results header
		const sortWrapper = searchPage.page.locator('.results-header__sort-wrapper');
		await expect(sortWrapper).toBeVisible();
	});

	test('sorts A-Z by default', async () => {
		// Default sort should be A-Z (name_sortable:asc)
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('name_sortable:asc');
	});

	test('loads Z-A sort from URL', async () => {
		// Navigate with sort param in URL - this bypasses the select interaction issue
		await searchPage.gotoWithParams('sort=name_sortable:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the select shows Z-A (use retry assertion for async initialization)
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:desc');
	});

	test('loads last modified sort from URL', async () => {
		// Navigate with sort param in URL
		await searchPage.gotoWithParams('sort=upload_timestamp:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the select shows Last Modified
		await expect(searchPage.sortSelect).toHaveValue('upload_timestamp:desc');
	});

	test('auto-selects By Relevance sort when searching', async ({}, testInfo) => {
		// Skip on mobile - search input not visible on mobile viewport
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Default should be A-Z
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');

		// Enter a search term using typeSlowly to simulate real user behavior
		await searchPage.typeSlowly('plone', 50);
		await searchPage.page.waitForTimeout(500);

		// Relevance sort should be auto-selected (use retry assertion)
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// User can switch to a different sort if desired
		await searchPage.selectSort('name_sortable:asc');
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');

		// Clear search for next tests
		await searchPage.clearSearchInput();
	});

	test('URL sort does not override localStorage preference', async () => {
		// Set localStorage sort preference first
		await searchPage.page.goto('/');
		await searchPage.page.evaluate(() => {
			localStorage.setItem('pyf_sort', 'upload_timestamp:desc');
		});

		// Navigate with different sort in URL
		await searchPage.gotoWithParams('sort=name_sortable:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// URL sort should be used for display
		const displayedSort = await searchPage.sortSelect.inputValue();
		expect(displayedSort).toBe('name_sortable:desc');

		// But localStorage should still have the original preference
		const storedSort = await searchPage.page.evaluate(() => {
			return localStorage.getItem('pyf_sort');
		});
		expect(storedSort).toBe('upload_timestamp:desc');
	});
});

test.describe('localStorage Persistence', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		// Clear localStorage and navigate
		await page.goto('/');
		await page.evaluate((key) => {
			localStorage.removeItem(key);
		}, SORT_STORAGE_KEY);
		await searchPage.goto();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('stores Z-A sort setting in localStorage when selected via UI', async () => {
		await searchPage.goto();
		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Select Z-A sort
		await searchPage.selectSort('name_sortable:desc');

		// Verify it's stored in localStorage
		const storedSort = await searchPage.page.evaluate((key) => {
			return localStorage.getItem(key);
		}, SORT_STORAGE_KEY);
		expect(storedSort).toBe('name_sortable:desc');
	});

	test('stores Last Modified sort setting in localStorage when selected via UI', async () => {
		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Select Last Modified sort
		await searchPage.selectSort('upload_timestamp:desc');

		// Verify it's stored in localStorage
		const storedSort = await searchPage.page.evaluate((key) => {
			return localStorage.getItem(key);
		}, SORT_STORAGE_KEY);
		expect(storedSort).toBe('upload_timestamp:desc');
	});

	test('does NOT store By Relevance sort in localStorage', async ({}, testInfo) => {
		// Skip on mobile - search input not visible, and localStorage behavior is viewport-independent
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// First set a known sort value
		await searchPage.selectSort('name_sortable:desc');
		let storedSort = await searchPage.page.evaluate((key) => {
			return localStorage.getItem(key);
		}, SORT_STORAGE_KEY);
		expect(storedSort).toBe('name_sortable:desc');

		// Enter a search term to make relevance sort available
		await searchPage.search('plone');
		await searchPage.page.waitForTimeout(500);

		// Select relevance sort
		await searchPage.selectSort('_text_match:desc');

		// Verify localStorage still has the previous sort, NOT relevance
		storedSort = await searchPage.page.evaluate((key) => {
			return localStorage.getItem(key);
		}, SORT_STORAGE_KEY);
		expect(storedSort).toBe('name_sortable:desc');

		// Clear search for next tests
		await searchPage.clearSearchInput();
	});

	test('persists Z-A sort setting after page reload', async () => {
		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Select Z-A sort
		await searchPage.selectSort('name_sortable:desc');

		// Reload the page
		await searchPage.page.reload();
		await searchPage.page.waitForLoadState('networkidle');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the sort is still Z-A
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('name_sortable:desc');
	});

	test('persists Last Modified sort setting after page reload', async () => {
		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Select Last Modified sort
		await searchPage.selectSort('upload_timestamp:desc');

		// Reload the page
		await searchPage.page.reload();
		await searchPage.page.waitForLoadState('networkidle');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the sort is still Last Modified
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('upload_timestamp:desc');
	});

	test('loads stored sort setting on fresh page visit', async () => {
		// Set localStorage directly before visiting the page
		await searchPage.page.evaluate((key) => {
			localStorage.setItem(key, 'upload_timestamp:desc');
		}, SORT_STORAGE_KEY);

		// Navigate to the page fresh
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the sort is loaded from localStorage
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('upload_timestamp:desc');
	});

	test('falls back to stored sort after clearing search with relevance active', async ({}, testInfo) => {
		// Skip on mobile - search input not visible, and localStorage behavior is viewport-independent
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Set Last Modified sort first
		await searchPage.selectSort('upload_timestamp:desc');

		// Search to make relevance available
		await searchPage.search('plone');
		await searchPage.page.waitForTimeout(500);

		// Select relevance sort
		await searchPage.selectSort('_text_match:desc');

		// Verify relevance is selected
		let currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('_text_match:desc');

		// Clear search
		await searchPage.searchInput.clear();
		await searchPage.page.waitForTimeout(500);

		// Verify sort falls back to default (A-Z) since relevance is not applicable
		currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('name_sortable:asc');
	});

	test('stored relevance sort falls back to default on reload', async () => {
		// Manually set an invalid relevance sort in localStorage (edge case)
		await searchPage.page.evaluate((key) => {
			localStorage.setItem(key, '_text_match:desc');
		}, SORT_STORAGE_KEY);

		// Navigate to the page
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Without a search term, relevance sort should not be used
		// The app should fall back to default sort (A-Z)
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('name_sortable:asc');
	});

	test('persists sort setting after clicking logo to navigate home', async () => {
		await searchPage.clearLocalStorageKey(SORT_STORAGE_KEY);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Select Last Modified sort
		await searchPage.selectSort('upload_timestamp:desc');

		// Verify sort is set
		let currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('upload_timestamp:desc');

		// Click the logo to navigate home
		const logo = searchPage.page.locator('.site-header__brand a');
		await logo.click();
		await searchPage.page.waitForLoadState('networkidle');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify sort is still Last Modified
		currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('upload_timestamp:desc');
	});
});

test.describe('Relevance Sorting Quality', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('exact name match appears first in relevance sort', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Search and wait for results to render
		await searchPage.searchAndWait('seo');

		// Wait for relevance sort to be applied
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// First result should contain the search term in its name
		const packageNames = await searchPage.getPackageNames();
		expect(packageNames.length).toBeGreaterThan(0);

		const firstPackageName = packageNames[0].toLowerCase();
		expect(firstPackageName).toContain('seo');

		// Clear search for next test
		await searchPage.clearSearchInput();
	});

	test('relevant results rank above irrelevant ones', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		// Navigate directly with search URL for a clean search
		await searchPage.gotoWithParams('q=restapi&sort=_text_match%3Adesc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		const packageNames = await searchPage.getPackageNames();
		expect(packageNames.length).toBeGreaterThan(0);

		// At least one of the top 5 results should be REST API-related
		const topNames = packageNames.slice(0, 5).map(n => n.toLowerCase());
		const hasRelevantResult = topNames.some(name =>
			name.includes('rest') || name.includes('api')
		);
		expect(hasRelevantResult).toBe(true);
	});

	test('prioritizes title/name matches over changelog matches', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Search for 'seo' - kitconcept.seo has it in name
		await searchPage.search('seo');
		await searchPage.page.waitForTimeout(500);

		// Wait for relevance sort to be applied
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		const packageNames = await searchPage.getPackageNames();
		expect(packageNames.length).toBeGreaterThan(0);

		// kitconcept.seo should rank first (has 'seo' in name)
		expect(packageNames[0]).toBe('kitconcept.seo');

		// The first result should have the search term in its name
		// This verifies that name/title matches are prioritized
		expect(packageNames[0].toLowerCase()).toContain('seo');

		// Clear search for next test
		await searchPage.clearSearchInput();
	});
});

test.describe('URL Sort Preservation', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('respects URL sort param when loading with search term - Last Modified', async () => {
		// Clear localStorage to ensure we're testing URL params only
		await searchPage.page.goto('/');
		await searchPage.page.evaluate(() => localStorage.clear());

		// Navigate with search term AND explicit sort param
		await searchPage.gotoWithParams('q=plone&sort=upload_timestamp:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Sort should be Last Modified (from URL), NOT auto-relevance
		await expect(searchPage.sortSelect).toHaveValue('upload_timestamp:desc');
	});

	test('respects URL sort param when loading with search term - A-Z', async () => {
		await searchPage.page.evaluate(() => localStorage.clear());

		await searchPage.gotoWithParams('q=plone&sort=name_sortable:asc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Sort should be A-Z (from URL), NOT auto-relevance
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');
	});

	test('respects URL sort param when loading with search term - Z-A', async () => {
		await searchPage.page.evaluate(() => localStorage.clear());

		await searchPage.gotoWithParams('q=plone&sort=name_sortable:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Sort should be Z-A (from URL), NOT auto-relevance
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:desc');
	});

	test('respects URL relevance sort when explicitly set with search term', async () => {
		await searchPage.page.evaluate(() => localStorage.clear());

		await searchPage.gotoWithParams('q=plone&sort=_text_match:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Sort should be relevance (explicitly from URL)
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');
	});

	test('auto-selects relevance when URL has search term but no sort param', async () => {
		await searchPage.page.evaluate(() => localStorage.clear());

		// URL has search term but no explicit sort - should auto-select relevance
		await searchPage.gotoWithParams('q=plone');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Sort should auto-select relevance since no explicit sort was specified
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');
	});
});

test.describe('Slow Typing and Auto-Relevance', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('auto-selects relevance when typing slowly in empty search', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await searchPage.page.evaluate(() => localStorage.clear());
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Default should be A-Z
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');

		// Type slowly to simulate real user behavior
		await searchPage.typeSlowly('plone', 100);
		await searchPage.page.waitForTimeout(500);

		// Relevance sort should be auto-selected
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// Clear for next test
		await searchPage.clearSearchInput();
	});

	test('user explicit sort selection prevents auto-relevance on continued typing', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await searchPage.page.evaluate(() => localStorage.clear());
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Type a search term - relevance auto-selected
		await searchPage.typeSlowly('plone', 50);
		await searchPage.page.waitForTimeout(500);
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// User explicitly selects a different sort
		await searchPage.selectSort('name_sortable:asc');
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');

		// Continue typing - sort should stay as user selected (A-Z)
		await searchPage.typeSlowly(' rest', 50);
		await searchPage.page.waitForTimeout(500);

		// Sort should still be A-Z (user selection is respected)
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');

		// Clear for next test
		await searchPage.clearSearchInput();
	});

	test('clearing search resets user sort preference tracking', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await searchPage.page.evaluate(() => localStorage.clear());
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Type and get auto-relevance
		await searchPage.typeSlowly('test', 50);
		await searchPage.page.waitForTimeout(500);
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// Clear the search (while relevance is still selected)
		await searchPage.clearSearchInput();
		await searchPage.page.waitForTimeout(500);

		// Sort should fall back to default (A-Z) since relevance is not available without search
		await expect(searchPage.sortSelect).toHaveValue('name_sortable:asc');

		// Now type again - should auto-select relevance (user preference tracking was reset)
		await searchPage.typeSlowly('plone', 50);
		await searchPage.page.waitForTimeout(500);
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');
	});
});
