import { test, expect } from './fixtures';

test.describe('Mobile Responsive', () => {
	test('hides filter toggle on desktop (>=640px)', async ({ searchPage }) => {
		// Ensure we're at desktop size
		await searchPage.page.setViewportSize({ width: 800, height: 600 });
		await searchPage.goto();

		// Filter toggle should not be visible on desktop
		await expect(searchPage.filterToggle).not.toBeVisible();
	});

	test('shows filter toggle on mobile (<640px)', async ({ searchPage }) => {
		// Set mobile viewport
		await searchPage.page.setViewportSize({ width: 375, height: 667 });
		await searchPage.goto();

		// Filter toggle should be visible on mobile
		await expect(searchPage.filterToggle).toBeVisible();
	});

	test('expands sidebar when toggle clicked', async ({ searchPage }) => {
		// Set mobile viewport
		await searchPage.page.setViewportSize({ width: 375, height: 667 });
		await searchPage.goto();

		// Initially sidebar should be hidden
		await expect(searchPage.filtersPanel).not.toBeVisible();

		// Click toggle
		await searchPage.toggleFilters();

		// Sidebar should now be visible with expanded class
		await expect(searchPage.filtersPanel).toBeVisible();
		await expect(searchPage.filtersPanel).toHaveClass(/expanded/);
	});

	test('collapses sidebar when toggle clicked again', async ({ searchPage }) => {
		// Set mobile viewport
		await searchPage.page.setViewportSize({ width: 375, height: 667 });
		await searchPage.goto();

		// Open sidebar
		await searchPage.toggleFilters();
		await expect(searchPage.filtersPanel).toBeVisible();

		// Close sidebar
		await searchPage.toggleFilters();

		// Sidebar should be hidden again
		await expect(searchPage.filtersPanel).not.toBeVisible();
	});

	test('shows progressive disclosure toggle for older versions', async ({ searchPage }) => {
		await searchPage.goto();

		// On mobile, we need to expand the sidebar first
		const isMobile = await searchPage.filterToggle.isVisible();
		if (isMobile) {
			await searchPage.toggleFilters();
			await expect(searchPage.filtersPanel).toBeVisible();
		}

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
