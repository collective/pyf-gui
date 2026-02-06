import { test as base, type Page, type Locator } from '@playwright/test';

/**
 * Page object for the main search page
 */
export class SearchPage {
	readonly page: Page;

	// Selectors
	readonly searchInput: Locator;
	readonly sortSelect: Locator;
	readonly filterToggle: Locator;
	readonly filtersPanel: Locator;
	readonly resultsCount: Locator;
	readonly moreVersionsToggle: Locator;
	readonly packageCards: Locator;

	constructor(page: Page) {
		this.page = page;
		this.searchInput = page.locator('.search-form__input');
		this.sortSelect = page.locator('#sort-select');
		this.filterToggle = page.locator('.filter-toggle');
		this.filtersPanel = page.locator('aside#filters-panel');
		this.resultsCount = page.locator('.results-header__count');
		this.moreVersionsToggle = page.locator('.search-form__more-toggle').first();
		this.packageCards = page.locator('.package-card');
	}

	async goto() {
		await this.page.goto('/');
		// Wait for the page to be ready
		await this.page.waitForLoadState('networkidle');
	}

	async gotoWithParams(params: string) {
		await this.page.goto(`/?${params}`);
		await this.page.waitForLoadState('networkidle');
	}

	async search(term: string) {
		await this.searchInput.fill(term);
		// Wait for debounce (300ms) + some buffer
		await this.page.waitForTimeout(400);
	}

	/**
	 * Type text character by character with delay between each character
	 * Useful for testing debounce behavior and live search
	 */
	async typeSlowly(term: string, delayMs: number = 50) {
		await this.searchInput.click();
		for (const char of term) {
			await this.searchInput.pressSequentially(char, { delay: delayMs });
		}
	}

	/**
	 * Type text as fast as possible — fires all keydown/keyup events with zero delay.
	 * Unlike fill(), this triggers keyboard event handlers.
	 */
	async typeFast(term: string) {
		await this.searchInput.click();
		await this.searchInput.pressSequentially(term, { delay: 0 });
	}

	/**
	 * Simulate instant paste: fill() sets value, then dispatch input event.
	 * This is faster than pressSequentially but still triggers reactive updates.
	 */
	async typeInstant(term: string) {
		await this.searchInput.click();
		await this.searchInput.fill(term);
		// Dispatch an input event to ensure Svelte picks up the change
		await this.searchInput.dispatchEvent('input');
	}

	/**
	 * Sample the search input value multiple times during a period
	 * Returns array of values observed
	 */
	async getInputValuesDuring(durationMs: number, sampleCount: number = 5): Promise<string[]> {
		const values: string[] = [];
		const interval = durationMs / sampleCount;

		for (let i = 0; i < sampleCount; i++) {
			const value = await this.searchInput.inputValue();
			values.push(value);
			await this.page.waitForTimeout(interval);
		}

		return values;
	}

	/**
	 * Get the current search input value
	 */
	async getSearchInputValue(): Promise<string> {
		return await this.searchInput.inputValue();
	}

	async selectSort(value: string) {
		// Use direct JavaScript interaction for Svelte 5 controlled selects
		// This bypasses the reactivity issue by setting value and dispatching event in sync
		await this.page.evaluate((newValue) => {
			const select = document.querySelector('#sort-select') as HTMLSelectElement;
			if (select) {
				select.value = newValue;
				// Dispatch both input and change events
				select.dispatchEvent(new Event('input', { bubbles: true }));
				select.dispatchEvent(new Event('change', { bubbles: true }));
			}
		}, value);

		// Wait for any reactive updates
		await this.page.waitForTimeout(500);
	}

	async toggleFilters() {
		await this.filterToggle.click();
	}

	async getPloneVersionCheckbox(version: string) {
		return this.page.locator(`#plone_version_Plone\\ ${version}`);
	}

	async togglePloneVersion(version: string) {
		const checkbox = await this.getPloneVersionCheckbox(version);
		await checkbox.click();
		await this.page.waitForLoadState('networkidle');
	}

	async getPackageNames(): Promise<string[]> {
		const titles = await this.page.locator('.package-card__title h2 a').allTextContents();
		return titles;
	}

	async getFirstPackageVersions(): Promise<string[]> {
		const versions = await this.page
			.locator('.package-card__plone-versions ul li')
			.first()
			.locator('..')
			.locator('li')
			.allTextContents();
		return versions;
	}

	async getFirstPackageVersionTitle(): Promise<string | null> {
		return await this.page.locator('.package-card__plone-versions ul').first().getAttribute('title');
	}

	async getFirstDownloadsText(): Promise<string | null> {
		const downloadsLocator = this.page.locator('.package-card__versions-right .package-card__downloads span').first();
		// Check if element exists with a short timeout
		const count = await downloadsLocator.count();
		if (count === 0) {
			return null;
		}
		return await downloadsLocator.textContent({ timeout: 5000 });
	}

	getCurrentUrl(): string {
		return this.page.url();
	}

	async clearLocalStorageKey(key: string) {
		await this.page.evaluate((k) => localStorage.removeItem(k), key);
	}

	async clearSearchInput() {
		await this.searchInput.clear();
		await this.page.waitForTimeout(400);
	}

	async resetPageState() {
		await this.page.evaluate(() => localStorage.clear());
		await this.goto();
	}
}

/**
 * Extended test fixture with SearchPage
 */
export const test = base.extend<{ searchPage: SearchPage }>({
	searchPage: async ({ page }, use) => {
		const searchPage = new SearchPage(page);
		await use(searchPage);
	}
});

export { expect, type Page, type Browser } from '@playwright/test';
