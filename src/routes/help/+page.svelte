<article>
  <h1>Help</h1>

  All infos on this service are aggregated from PyPi, GitHub and co.
  To make your Plone package look good, you can make sure that you defined the following PyPi classifieres.

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
"Programming Language :: Python :: 3.11",</pre>

  set the right type of your package, choose one of this:

<pre>"Framework :: Plone :: Addon",
"Framework :: Plone :: Theme",
"Framework :: Plone :: Distribution",
"Framework :: Plone :: Core",</pre>

  Please do not put "Distribution" or "Core" for normal add-on's, as it make filtering them later harder.
  Only use "Core" for Plone core packages, which are comming with Plone be default.


  Also make sure that you have well defined urls to GitHub, docs, homepage aso:

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
