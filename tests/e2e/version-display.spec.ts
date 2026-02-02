import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

test.describe('Version Display', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('displays Plone versions sorted newest first', async () => {
		// Get the versions from the first package's title attribute
		const versionTitle = await searchPage.getFirstPackageVersionTitle();
		expect(versionTitle).not.toBeNull();

		// Versions should be in descending order (newer first)
		const versions = versionTitle!.split(', ').map((v) => parseFloat(v));
		const sortedVersions = [...versions].sort((a, b) => b - a);
		expect(versions).toEqual(sortedVersions);
	});

	test('constrains version list with fade effect', async () => {
		// Check that the version list has mask-image CSS property
		const versionList = searchPage.page.locator('.package-card__plone-versions ul').first();
		const maskImage = await versionList.evaluate((el) => {
			const style = window.getComputedStyle(el);
			return style.maskImage || style.webkitMaskImage;
		});

		// Should have a gradient mask for fade effect
		expect(maskImage).toContain('linear-gradient');
	});

	test('shows full version list in tooltip on hover', async () => {
		// Find a package that has Plone versions (title attribute with content)
		const versionListWithTitle = searchPage.page.locator(
			'.package-card__plone-versions ul[title]:not([title=""])'
		).first();

		await expect(versionListWithTitle).toBeVisible();

		const titleAttr = await versionListWithTitle.getAttribute('title');

		expect(titleAttr).not.toBeNull();
		expect(titleAttr!.length).toBeGreaterThan(0);
		// Should contain version numbers
		expect(titleAttr).toMatch(/\d+\.\d+/);
	});

	test('displays monthly downloads compactly', async () => {
		// Wait a bit for all data to load
		await searchPage.page.waitForTimeout(500);

		// Find a package card with downloads data
		const downloadsElement = searchPage.page
			.locator('.package-card__versions-right .package-card__downloads span')
			.first();

		// Skip test if no downloads data available (some packages may not have it)
		const count = await downloadsElement.count();
		if (count > 0) {
			const downloadsText = await downloadsElement.textContent();
			expect(downloadsText).toContain('/mo');
		}
	});
});
