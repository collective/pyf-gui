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
</style>
