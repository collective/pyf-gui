<article>
  <h1>Help</h1>

  All information for this service is aggregated from PyPI, GitHub, and other services.
  To make your Plone add-on look good, you should define the following PyPI Trove classifiers in your add-on.
  The following examples use `setup.py` syntax, and you can adapt them to `pyproject.yaml` syntax.

  For supported Plone versions:

<pre>
"Framework :: Plone",
"Framework :: Plone :: 5.2",
"Framework :: Plone :: 6.0",</pre>

  For supported Python versions:

<pre>"Programming Language :: Python",
"Programming Language :: Python :: 3.8",
"Programming Language :: Python :: 3.9",
"Programming Language :: Python :: 3.10",
"Programming Language :: Python :: 3.11",
"Programming Language :: Python :: 3.12",</pre>

  Set the right type of your add-on, choosing only one of the following Trove classifiers:

<pre>"Framework :: Plone :: Addon",
"Framework :: Plone :: Theme",
"Framework :: Plone :: Distribution",
"Framework :: Plone :: Core",</pre>

  "Addon" is for normal add-ons that are neither a theme, distribution, or part of Plone core.
  Please do not put "Distribution" or "Core" for normal add-ons, as it makes filtering them difficult.
  Use "Core" only for Plone core packages, which are those that come with Plone by default.

  Finally define your project URLs for GitHub, documentation, home page, or other project resources:

<pre>
project_urls="&#123;
    "PyPI": "https://pypi.python.org/pypi/plone.pdfexport",
    "Source": "https://github.com/plone/plone.pdfexport",
    "Tracker": "https://github.com/plone/plone.pdfexport/issues",
    'Documentation': 'https://plone.pdfexport.readthedocs.io/en/latest/',
  &#125;",</pre>

  <h2>Understanding the Health Score</h2>

  The health score provides a quick assessment of a package's overall quality and maintenance status.
  It helps users identify well-maintained packages and gives maintainers actionable feedback on how to improve their package's visibility and trustworthiness.

  <h3>Score Categories</h3>

  The health score is calculated from three main components:

  <ul>
    <li><strong>Documentation</strong> - Evaluates the quality and completeness of your package's README and documentation. Packages with comprehensive descriptions, usage examples, and clear installation instructions score higher.</li>
    <li><strong>Metadata</strong> - Assesses the completeness of your package's metadata, including Trove classifiers, keywords, and project URLs. Well-categorized packages are easier to discover and filter.</li>
    <li><strong>Recency</strong> - Measures how recently the package was updated. Actively maintained packages with recent releases score higher in this category.</li>
  </ul>

  <h3>Score Ranges</h3>

  Health scores are color-coded to help you quickly assess package quality:

  <ul>
    <li><strong style="color: green;">Green (70+)</strong> - Good. The package is well-documented, properly categorized, and actively maintained.</li>
    <li><strong style="color: orange;">Yellow/Orange (40-69)</strong> - Fair. The package may be missing some documentation or metadata, or hasn't been updated recently.</li>
    <li><strong style="color: red;">Red (below 40)</strong> - Needs Improvement. The package is missing significant documentation, metadata, or hasn't been updated in a long time.</li>
  </ul>

  <h3>How to Improve Your Score</h3>

  <strong>Documentation:</strong>
  <ul>
    <li>Add a comprehensive README with clear descriptions</li>
    <li>Include installation instructions and usage examples</li>
    <li>Document configuration options and API references</li>
    <li>Add a changelog to track version history</li>
  </ul>

  <strong>Metadata:</strong>
  <ul>
    <li>Add all relevant Trove classifiers (see examples above)</li>
    <li>Include descriptive keywords for better discoverability</li>
    <li>Define project URLs for source code, documentation, and issue tracker</li>
    <li>Specify the correct license classifier</li>
  </ul>

  <strong>Recency:</strong>
  <ul>
    <li>Release updates regularly, even for minor fixes</li>
    <li>Respond to issues and pull requests</li>
    <li>Keep dependencies updated</li>
    <li>Ensure compatibility with the latest Plone and Python versions</li>
  </ul>

  <!-- <p>This service brought to you by <a href="https://derico.de">Derico</a></p> -->
</article>

<style>
  article{
    grid-area: content;
    padding: 1em;
    min-height: 50vh;
  }
  pre{
    margin: 1em 0;
    padding: 0.5em;
    background-color: wheat;
  }
  h2 {
    margin-top: 2em;
    border-bottom: 2px solid #ccc;
    padding-bottom: 0.3em;
  }
  h3 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  ul {
    margin: 0.5em 0 1em 1.5em;
  }
  li {
    margin-bottom: 0.3em;
  }
</style>
