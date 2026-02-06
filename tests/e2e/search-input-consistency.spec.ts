import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

test.describe('Search input consistency', () => {
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

	/**
	 * Wait for search results to be fully rendered after the URL reflects the search term.
	 */
	async function waitForSearchResults(term: string) {
		await page.waitForURL(`**/*q=${encodeURIComponent(term)}*`, { timeout: 10000 });
		await page.waitForLoadState('networkidle');
		await searchPage.packageCards.first().waitFor({ timeout: 10000 });
	}

	/**
	 * Get the baseline (canonical) results by navigating directly with URL params.
	 * This bypasses all input-method-specific race conditions.
	 */
	async function getBaselineResults(term: string, sort: string): Promise<string[]> {
		await searchPage.gotoWithParams(`q=${encodeURIComponent(term)}&sort=${encodeURIComponent(sort)}`);
		await searchPage.packageCards.first().waitFor({ timeout: 10000 });
		return searchPage.getPackageNames();
	}

	test('all input methods eventually produce correct search results', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		// Get baseline results via direct URL navigation
		const baseline = await getBaselineResults('plone', '_text_match:desc');
		expect(baseline.length).toBeGreaterThan(0);

		// Test each input method: after typing, the URL updates to q=plone.
		// Reload from that URL to verify the search term was correctly captured.
		const methods = [
			{
				name: 'fast type',
				action: async () => {
					await searchPage.resetPageState();
					await searchPage.typeFast('plone');
				}
			},
			{
				name: 'slow type',
				action: async () => {
					await searchPage.resetPageState();
					await searchPage.typeSlowly('plone', 50);
				}
			},
			{
				name: 'paste',
				action: async () => {
					await searchPage.resetPageState();
					await searchPage.search('plone');
				}
			}
		];

		for (const method of methods) {
			await method.action();
			await waitForSearchResults('plone');

			// Verify the sort auto-switched to relevance
			const sortValue = await searchPage.sortSelect.inputValue();
			expect(sortValue, `${method.name}: sort should be relevance`).toBe('_text_match:desc');

			// Verify the URL correctly captures the search term
			expect(page.url(), `${method.name}: URL should contain q=plone`).toContain('q=plone');

			// Reload from the current URL to get clean results
			await page.reload({ waitUntil: 'networkidle' });
			await searchPage.packageCards.first().waitFor({ timeout: 10000 });

			const results = await searchPage.getPackageNames();
			expect(results, `${method.name}: results after reload should match baseline`).toEqual(baseline);
		}
	});

	test('all input methods produce identical results with explicit A-Z sort', async ({}, testInfo) => {
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		// Get baseline results via direct URL navigation with A-Z sort
		const baseline = await getBaselineResults('plone', 'name_sortable:asc');
		expect(baseline.length).toBeGreaterThan(0);

		const methods = [
			{
				name: 'fast type',
				action: async () => {
					await searchPage.resetPageState();
					await searchPage.typeFast('plone');
				}
			},
			{
				name: 'slow type',
				action: async () => {
					await searchPage.resetPageState();
					await searchPage.typeSlowly('plone', 50);
				}
			},
			{
				name: 'paste',
				action: async () => {
					await searchPage.resetPageState();
					await searchPage.search('plone');
				}
			}
		];

		for (const method of methods) {
			await method.action();
			await waitForSearchResults('plone');

			// Switch to A-Z sort
			await searchPage.selectSort('name_sortable:asc');
			await page.waitForLoadState('networkidle');
			await searchPage.packageCards.first().waitFor({ timeout: 10000 });

			// Reload from the current URL to get clean results
			await page.reload({ waitUntil: 'networkidle' });
			await searchPage.packageCards.first().waitFor({ timeout: 10000 });

			const results = await searchPage.getPackageNames();
			expect(results, `${method.name}: results should match baseline`).toEqual(baseline);
		}
	});
});
