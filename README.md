# Cite Creator

## Overview

Cite Creator is a cross-browser extension that creates cites for use primarily in US high school or college competitive debate. It's designed to work well with the [Verbatim](https://paperlessdebate.com) template. Includes keyboard shortcuts for quickly modifying/copying the cite.

Current build targets are Chromium-based browsers (Chrome/Edge) and Firefox. It should be adaptable to Safari in the future.

## Project Layout

```
/.husky            -- Git hooks
/chrome            -- manifest.json for Chrome
/dist              -- Packages for distribution to extension store, via automated build script
/firefox           -- manifest.json for Firefox
/src               -- Main extension source code
+---/icons         -- Icons in different sizes for use in different browser locations
+---/vendor        -- Third-party scripts/dependencies
/store             -- Assets for uploading to extension stores, e.g. screenshots

build.sh           -- Automated build script
setupTests.js      -- pre/post test setup for puppeteer
vite.config.js     -- Vitest configuration
```

## Building

Builds are automated as a pre-commit hook with husky. To manually build packages:

`npm run build`

will produce zip files in dist for each browser, ready to upload to their respective store.

## Testing

Automated tests are run with Vitest and Puppeteer. They're not comprehensive, because mocking browser storage to cover all the different settings permutations or possible input HTML is annoying to do from Node. But, they at least ensure core functionality is working. They're run as a pre-commit hook with husky. To manually run tests:

`npm run test`

## Development

`npm run dev-chrome` (`npm run dev` is an alias) or `npm run dev-firefox` will use web-ext to load the extension in a temporary browser profile. It hot reloads on changes to files in /src.

All contributions should pass linting and be formatted with Prettier. To manually lint: `npm run lint` and `npm run web-ext-lint`.
