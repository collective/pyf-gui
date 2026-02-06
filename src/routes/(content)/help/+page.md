# Help

All information for this service is aggregated from PyPI, GitHub, and other services.
To make your Plone add-on look good, you should define the following PyPI Trove classifiers in your add-on.
The following examples use `setup.py` syntax, and you can adapt them to `pyproject.yaml` syntax.

For supported Plone versions:

```python
"Framework :: Plone",
"Framework :: Plone :: 5.2",
"Framework :: Plone :: 6.0",
```

For supported Python versions:

```python
"Programming Language :: Python",
"Programming Language :: Python :: 3.8",
"Programming Language :: Python :: 3.9",
"Programming Language :: Python :: 3.10",
"Programming Language :: Python :: 3.11",
"Programming Language :: Python :: 3.12",
```

Set the right type of your add-on, choosing only one of the following Trove classifiers:

```python
"Framework :: Plone :: Addon",
"Framework :: Plone :: Theme",
"Framework :: Plone :: Distribution",
"Framework :: Plone :: Core",
```

"Addon" is for normal add-ons that are neither a theme, distribution, or part of Plone core.
Please do not put "Distribution" or "Core" for normal add-ons, as it makes filtering them difficult.
Use "Core" only for Plone core packages, which are those that come with Plone by default.

Finally define your project URLs for GitHub, documentation, home page, or other project resources:

```python
project_urls={
    "PyPI": "https://pypi.python.org/pypi/plone.pdfexport",
    "Source": "https://github.com/plone/plone.pdfexport",
    "Tracker": "https://github.com/plone/plone.pdfexport/issues",
    "Documentation": "https://plone.pdfexport.readthedocs.io/en/latest/",
}
```

## Understanding the Health Score

The health score provides a quick assessment of a package's overall quality and maintenance status.
It helps users identify well-maintained packages and gives maintainers actionable feedback on how to improve their package's visibility and trustworthiness.

### Score Categories

The health score is calculated from three main components:

- **Documentation** - Evaluates the quality and completeness of your package's README and documentation. Packages with comprehensive descriptions, usage examples, and clear installation instructions score higher.
- **Metadata** - Assesses the completeness of your package's metadata, including Trove classifiers, keywords, and project URLs. Well-categorized packages are easier to discover and filter.
- **Recency** - Measures how recently the package was updated. Actively maintained packages with recent releases score higher in this category.

### Score Ranges

Health scores are color-coded to help you quickly assess package quality:

- <strong style="color: green;">Green (70+)</strong> - Good. The package is well-documented, properly categorized, and actively maintained.
- <strong style="color: orange;">Yellow/Orange (40-69)</strong> - Fair. The package may be missing some documentation or metadata, or hasn't been updated recently.
- <strong style="color: red;">Red (below 40)</strong> - Needs Improvement. The package is missing significant documentation, metadata, or hasn't been updated in a long time.

### How to Improve Your Score

**Documentation:**
- Add a comprehensive README with clear descriptions
- Include installation instructions and usage examples
- Document configuration options and API references
- Add a changelog to track version history

**Metadata:**
- Add all relevant Trove classifiers (see examples above)
- Include descriptive keywords for better discoverability
- Define project URLs for source code, documentation, and issue tracker
- Specify the correct license classifier

**Recency:**
- Release updates regularly, even for minor fixes
- Respond to issues and pull requests
- Keep dependencies updated
- Ensure compatibility with the latest Plone and Python versions

### Detailed Scoring Criteria

The health score is calculated from a base score of up to 100 points, with additional GitHub bonuses that can boost the score (capped at 100).

#### Release Recency (40 points max)

| Age | Points |
|-----|--------|
| Less than 6 months | 40 |
| 6-12 months | 30 |
| 1-2 years | 20 |
| 2-3 years | 10 |
| 3-5 years | 5 |
| More than 5 years | 0 |

#### Documentation (30 points max)

| Criterion | Points |
|-----------|--------|
| Has meaningful description (more than 150 chars) | 18 |
| Has `docs_url` | +4 (bonus) |
| Has documentation link in `project_urls` | +3 (bonus) |
| Has meaningful screenshots | +5 (bonus) |

*Note:* If the README has fewer than 500 words, at least one external documentation link (`docs_url` or a documentation URL in `project_urls`) is recommended. Packages with comprehensive READMEs (500+ words) don't require external documentation links.

#### Metadata (30 points max)

| Criterion | Points |
|-----------|--------|
| Has maintainer or author info | 10 |
| Has license | 10 |
| Has at least 3 classifiers | 10 |

#### GitHub Bonuses (up to +30 points)

When GitHub data is available, bonus points are added:

**Stars Bonus (up to +10 points):**

| Stars | Bonus |
|-------|-------|
| 1000+ | +10 |
| 500-999 | +7 |
| 100-499 | +5 |
| 50-99 | +3 |
| 10-49 | +1 |
| Less than 10 | 0 |

**Activity Bonus (up to +10 points):**

| Last GitHub Update | Bonus |
|--------------------|-------|
| Within 30 days | +10 |
| Within 90 days | +7 |
| Within 180 days | +5 |
| Within 365 days | +3 |
| More than 1 year | 0 |

**Issue Management Bonus (up to +10 points):**

Based on the ratio of open issues to stars (lower is better):

| Issues/Stars Ratio | Bonus |
|--------------------|-------|
| Less than 0.1 (Excellent) | +10 |
| 0.1-0.3 (Good) | +7 |
| 0.3-0.5 (Fair) | +5 |
| 0.5-1.0 (Poor) | +3 |
| More than 1.0 (Very poor) | 0 |

### Common Problems

These are the problem messages you might see in the health score breakdown:

**Recency Problems:**
- "last release over X years ago" - The package hasn't been updated recently
- "no release timestamp" - The package is missing release date information

**Documentation Problems:**
- "description too short" - The package description needs more detail (minimum 150 characters)
- "not enough documentation (extend README to 500+ words or add documentation link)" - Consider expanding the README or linking to external docs

**Metadata Problems:**
- "no license" - Add a license classifier to your package
- "fewer than 3 classifiers" - Add more Trove classifiers for better discoverability
- "no author info" - Include maintainer or author information

### Bonuses

These bonuses are displayed when packages earn extra points:

**Documentation Bonuses:**
- "has dedicated docs URL" (+4 points) - The package has a `docs_url` defined
- "has documentation project URL" (+3 points) - The package has a documentation link in `project_urls`
- "has meaningful screenshots" (+5 points) - The package includes non-badge images (at least 200px wide) in its description
