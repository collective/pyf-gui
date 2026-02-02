import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

test.describe('URL Parameters', () => {
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

	test('loads search term from URL params', async () => {
		// Navigate with search param
		await searchPage.gotoWithParams('q=plone.restapi');

		// Search input should have the value
		await expect(searchPage.searchInput).toHaveValue('plone.restapi');
	});

	test('loads sort from URL params', async () => {
		// Navigate with sort param
		await searchPage.gotoWithParams('sort=upload_timestamp:desc');

		// Sort should be set
		const sortValue = await searchPage.sortSelect.inputValue();
		expect(sortValue).toBe('upload_timestamp:desc');
	});

	test('loads multiple params from URL', async () => {
		// Navigate with multiple params
		await searchPage.gotoWithParams('q=collective&sort=name_sortable:desc');

		// Search input should have the value
		await expect(searchPage.searchInput).toHaveValue('collective');

		// Sort should be set
		const sortValue = await searchPage.sortSelect.inputValue();
		expect(sortValue).toBe('name_sortable:desc');
	});

	test('omits default params for clean URLs', async () => {
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// With default state, URL should be clean (no query params)
		const url = await searchPage.page.evaluate(() => window.location.search);
		expect(url).toBe('');
	});

	test('URL params override localStorage', async () => {
		// Set localStorage sort preference (correct key: pyf_sort)
		await searchPage.page.goto('/');
		await searchPage.page.evaluate(() => {
			localStorage.setItem('pyf_sort', 'upload_timestamp:desc');
		});

		// Navigate with different sort in URL
		await searchPage.gotoWithParams('sort=name_sortable:desc');

		// URL sort should win
		const sortValue = await searchPage.sortSelect.inputValue();
		expect(sortValue).toBe('name_sortable:desc');
	});
});
