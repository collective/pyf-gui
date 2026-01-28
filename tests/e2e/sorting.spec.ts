import { test, expect } from './fixtures';

test.describe('Sorting', () => {
	test('displays sort dropdown above results', async ({ searchPage }) => {
		await searchPage.goto();

		// Sort select should be visible
		await expect(searchPage.sortSelect).toBeVisible();

		// Should be within results header
		const sortWrapper = searchPage.page.locator('.results-header__sort-wrapper');
		await expect(sortWrapper).toBeVisible();
	});

	test('sorts A-Z by default', async ({ searchPage }) => {
		await searchPage.goto();

		// Default sort should be A-Z (name_sortable:asc)
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('name_sortable:asc');
	});

	test('loads Z-A sort from URL', async ({ searchPage }) => {
		// Navigate with sort param in URL - this bypasses the select interaction issue
		await searchPage.gotoWithParams('sort=name_sortable:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the select shows Z-A
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('name_sortable:desc');

		// Verify results are in Z-A order
		const names = await searchPage.getPackageNames();
		if (names.length > 1) {
			// First package should be alphabetically after or equal to second
			expect(names[0].toLowerCase() >= names[1].toLowerCase()).toBe(true);
		}
	});

	test('loads last modified sort from URL', async ({ searchPage }) => {
		// Navigate with sort param in URL
		await searchPage.gotoWithParams('sort=upload_timestamp:desc');
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Verify the select shows Last Modified
		const currentValue = await searchPage.sortSelect.inputValue();
		expect(currentValue).toBe('upload_timestamp:desc');
	});

	test('URL sort does not override localStorage preference', async ({ searchPage }) => {
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
