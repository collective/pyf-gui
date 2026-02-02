import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

test.describe('Mobile Responsive - Desktop', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		await page.setViewportSize({ width: 800, height: 600 });
		searchPage = new SearchPage(page);
		await searchPage.goto();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('hides filter toggle on desktop (>=640px)', async () => {
		// Filter toggle should not be visible on desktop
		await expect(searchPage.filterToggle).not.toBeVisible();
	});

	test('shows progressive disclosure toggle for older versions on desktop', async () => {
		// More versions toggle should be visible
		await expect(searchPage.moreVersionsToggle).toBeVisible();

		// Should have appropriate aria attributes
		await expect(searchPage.moreVersionsToggle).toHaveAttribute('aria-expanded', 'false');

		// Click to expand
		await searchPage.moreVersionsToggle.click();

		// Should update aria-expanded
		await expect(searchPage.moreVersionsToggle).toHaveAttribute('aria-expanded', 'true');
	});
});

test.describe('Mobile Responsive - Mobile', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		await page.setViewportSize({ width: 375, height: 667 });
		searchPage = new SearchPage(page);
		await searchPage.goto();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('shows filter toggle on mobile (<640px)', async () => {
		// Filter toggle should be visible on mobile
		await expect(searchPage.filterToggle).toBeVisible();
	});

	test('expands sidebar when toggle clicked', async () => {
		// Initially sidebar should be hidden
		await expect(searchPage.filtersPanel).not.toBeVisible();

		// Click toggle
		await searchPage.toggleFilters();

		// Sidebar should now be visible with expanded class
		await expect(searchPage.filtersPanel).toBeVisible();
		await expect(searchPage.filtersPanel).toHaveClass(/expanded/);
	});

	test('collapses sidebar when toggle clicked again', async () => {
		// Sidebar should be visible from previous test
		await expect(searchPage.filtersPanel).toBeVisible();

		// Close sidebar
		await searchPage.toggleFilters();

		// Sidebar should be hidden again
		await expect(searchPage.filtersPanel).not.toBeVisible();
	});

	test('shows progressive disclosure toggle for older versions on mobile', async () => {
		// On mobile, we need to expand the sidebar first
		await searchPage.toggleFilters();
		await expect(searchPage.filtersPanel).toBeVisible();

		// More versions toggle should be visible
		await expect(searchPage.moreVersionsToggle).toBeVisible();

		// Should have appropriate aria attributes
		await expect(searchPage.moreVersionsToggle).toHaveAttribute('aria-expanded', 'false');

		// Click to expand
		await searchPage.moreVersionsToggle.click();

		// Should update aria-expanded
		await expect(searchPage.moreVersionsToggle).toHaveAttribute('aria-expanded', 'true');
	});
});
