import { test, expect, SearchPage, type Page, type Browser } from './fixtures';

/**
 * Typesense configuration for direct API queries
 */
const TYPESENSE_CONFIG = {
	host: 'localhost',
	port: 8108,
	apiKey: '0mY7LWoHK4ZU2djv8kGswEF62Ja1HRBQ',
	collection: 'plone'
};

/**
 * High-weight fields in the search configuration (weights: 80, 80, 70, 60, 40, 30)
 * Matches in these fields should rank higher than changelog-only matches
 * Note: main_content (weight 30) is included as it's still much higher than changelog (weight 1)
 */
const HIGH_WEIGHT_FIELDS = 'name,title,summary,keywords,first_chapter,main_content';

/**
 * Low-weight field (weight: 1) - changelog-only matches should rank lower
 */
const LOW_WEIGHT_FIELD = 'changelog';

interface TypesenseHit {
	document: {
		name: string;
		[key: string]: unknown;
	};
}

interface TypesenseSearchResult {
	hits?: TypesenseHit[];
	found?: number;
}

/**
 * Query Typesense directly via page.evaluate() to avoid CORS issues
 */
async function queryTypesense(
	page: Page,
	query: string,
	queryBy: string,
	perPage: number = 100
): Promise<TypesenseSearchResult> {
	return await page.evaluate(
		async ({ config, q, query_by, per_page }) => {
			const url = `http://${config.host}:${config.port}/collections/${config.collection}/documents/search`;
			const params = new URLSearchParams({
				q,
				query_by,
				per_page: per_page.toString(),
				filter_by: "classifiers:=['Framework :: Plone']"
			});
			const resp = await fetch(`${url}?${params}`, {
				headers: { 'X-TYPESENSE-API-KEY': config.apiKey }
			});
			return resp.json();
		},
		{ config: TYPESENSE_CONFIG, q: query, query_by: queryBy, per_page: perPage }
	);
}

/**
 * Extract package names from Typesense search results
 */
function extractPackageNames(result: TypesenseSearchResult): Set<string> {
	if (!result.hits) return new Set();
	return new Set(result.hits.map((hit) => hit.document.name));
}

test.describe('Field Weight Verification', () => {
	test.describe.configure({ mode: 'serial' });

	let page: Page;
	let searchPage: SearchPage;
	let highWeightMatches: Set<string>;
	let changelogOnlyMatches: Set<string>;

	test.beforeAll(async ({ browser }: { browser: Browser }) => {
		page = await browser.newPage();
		searchPage = new SearchPage(page);
		await searchPage.goto();

		// Query Typesense for packages with "seo" in high-weight fields
		const highWeightResult = await queryTypesense(page, 'seo', HIGH_WEIGHT_FIELDS);
		highWeightMatches = extractPackageNames(highWeightResult);
		console.log('High-weight field matches:', Array.from(highWeightMatches));

		// Query Typesense for packages with "seo" in changelog only
		const changelogResult = await queryTypesense(page, 'seo', LOW_WEIGHT_FIELD);
		const changelogMatches = extractPackageNames(changelogResult);
		console.log('Changelog matches:', Array.from(changelogMatches));

		// Find packages that ONLY match in changelog (not in high-weight fields)
		changelogOnlyMatches = new Set([...changelogMatches].filter((name) => !highWeightMatches.has(name)));
		console.log('Changelog-only matches:', Array.from(changelogOnlyMatches));
	});

	test.afterAll(async () => {
		await page.close();
	});

	test('identifies packages with SEO in different field types', async () => {
		// Verify we found some high-weight matches
		expect(highWeightMatches.size).toBeGreaterThan(0);

		// kitconcept.seo should be in high-weight matches (has 'seo' in name)
		expect(highWeightMatches.has('kitconcept.seo')).toBe(true);

		// Log for debugging
		console.log(`Found ${highWeightMatches.size} high-weight field matches`);
		console.log(`Found ${changelogOnlyMatches.size} changelog-only matches`);
	});

	test('first 3 packages are high-weight matches with exact match first', async ({}, testInfo) => {
		// Skip on mobile - search input not visible on mobile viewport
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Search for "seo"
		await searchPage.search('seo');

		// Wait for relevance sort to be applied
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// Get the first 4 package names from UI
		const packageNames = await searchPage.getPackageNames();
		expect(packageNames.length).toBeGreaterThanOrEqual(4);

		const first3Packages = packageNames.slice(0, 3);
		console.log('First 3 packages in UI:', first3Packages);

		// Assert: first 3 packages should be from high-weight matches
		// (Typesense grouping and scoring can cause slight variations beyond top 3)
		for (const pkg of first3Packages) {
			expect(
				highWeightMatches.has(pkg),
				`Expected "${pkg}" to be a high-weight match, but it was not found in high-weight results`
			).toBe(true);
		}

		// Verify kitconcept.seo appears first (exact name match)
		expect(first3Packages[0]).toBe('kitconcept.seo');

		// Additionally verify: none of the first 3 are changelog-only matches
		for (const pkg of first3Packages) {
			expect(
				changelogOnlyMatches.has(pkg),
				`Expected "${pkg}" to NOT be a changelog-only match in top 3`
			).toBe(false);
		}
	});

	test('changelog-only matches appear after high-weight matches', async ({}, testInfo) => {
		// Skip on mobile - search input not visible on mobile viewport
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		// Skip if no changelog-only matches exist
		if (changelogOnlyMatches.size === 0) {
			console.log('No changelog-only matches found, skipping test');
			test.skip();
			return;
		}

		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Search for "seo"
		await searchPage.search('seo');
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		// Get all visible package names
		const packageNames = await searchPage.getPackageNames();
		console.log('All packages in UI:', packageNames);

		// Find positions of changelog-only matches
		const changelogOnlyPositions: { name: string; position: number }[] = [];
		for (const pkg of changelogOnlyMatches) {
			const position = packageNames.indexOf(pkg);
			if (position !== -1) {
				changelogOnlyPositions.push({ name: pkg, position });
			}
		}

		console.log('Changelog-only package positions:', changelogOnlyPositions);

		// If any changelog-only matches are visible, they should appear after position 3 (index >= 4)
		for (const { name, position } of changelogOnlyPositions) {
			expect(
				position,
				`Expected "${name}" (changelog-only) to appear after first 4 results, but found at position ${position}`
			).toBeGreaterThanOrEqual(4);
		}

		// Specifically check imio.smartweb.core if it's a changelog-only match
		if (changelogOnlyMatches.has('imio.smartweb.core')) {
			const imioPosition = packageNames.indexOf('imio.smartweb.core');
			if (imioPosition !== -1) {
				console.log(`imio.smartweb.core found at position ${imioPosition}`);
				expect(imioPosition).toBeGreaterThanOrEqual(4);
			}
		}
	});

	test('verifies field weight configuration in results', async ({}, testInfo) => {
		// Skip on mobile - search input not visible on mobile viewport
		test.skip(testInfo.project.name === 'mobile', 'Search input not visible on mobile');

		await searchPage.goto();
		await expect(searchPage.packageCards.first()).toBeVisible();

		// Search for "seo"
		await searchPage.search('seo');
		await expect(searchPage.sortSelect).toHaveValue('_text_match:desc');

		const packageNames = await searchPage.getPackageNames();

		// Find all high-weight matches in the results
		const highWeightPositions: { name: string; position: number }[] = [];
		const changelogOnlyPositionsInResults: { name: string; position: number }[] = [];

		packageNames.forEach((name, index) => {
			if (highWeightMatches.has(name)) {
				highWeightPositions.push({ name, position: index });
			} else if (changelogOnlyMatches.has(name)) {
				changelogOnlyPositionsInResults.push({ name, position: index });
			}
		});

		console.log('High-weight packages in results:', highWeightPositions);
		console.log('Changelog-only packages in results:', changelogOnlyPositionsInResults);

		// Verify: the minimum position of any changelog-only match should be
		// greater than all high-weight match positions (for visible results)
		if (changelogOnlyPositionsInResults.length > 0 && highWeightPositions.length > 0) {
			const maxHighWeightPosition = Math.max(...highWeightPositions.map((p) => p.position));
			const minChangelogOnlyPosition = Math.min(...changelogOnlyPositionsInResults.map((p) => p.position));

			console.log(`Max high-weight position: ${maxHighWeightPosition}`);
			console.log(`Min changelog-only position: ${minChangelogOnlyPosition}`);

			// All high-weight matches should appear before any changelog-only match
			expect(
				minChangelogOnlyPosition,
				`Expected changelog-only matches to appear after all high-weight matches`
			).toBeGreaterThan(maxHighWeightPosition);
		}
	});
});
