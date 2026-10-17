# Tests

Browser tests for the built site, with [Playwright](https://playwright.dev).

```sh
npm run build
npm test                         # every suite in tests/suites, in Chromium
npm test -- lab archive          # only the suites whose names contain a word
npm run test:browsers -- webkit  # the cross-browser suite in WebKit (Safari)
npm run test:browsers -- firefox # ... or in Firefox
```

`npm test` serves `dist/` on port 4173 itself, unless something already
answers there (or at `BASE_URL`). The first time, install the browsers with
`npx playwright install chromium webkit firefox`.

- `tests/suites/` holds one suite per part of the site. Each one prints an
  `ok` or `FAIL` line per check.
- `tests/browsers.test.mjs` goes through every page of the sitemap on a
  desktop and a phone (loads, text shows up while scrolling, no sideways
  scroll, axe, no script error), then the main interactions.
- A few checks make sure the site never shows certain words. The words
  themselves stay out of the repo, in `tests/.private-words` (one pattern
  per line, ignored by Git); without that file, those checks print `skip`.
- `.github/workflows/tests.yml` runs all of it on every pull request: the
  suites in Chromium, the cross-browser suite in Chromium, WebKit and
  Firefox.
