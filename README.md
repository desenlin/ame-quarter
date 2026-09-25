# Ame Quarter · CRE studio

**Created by [Desen Lin](https://desenlin.com/) · California State University, Fullerton**

An independent retail real estate studio, with a first activity for **FIN 355**. A six-shop Japanese plaza becomes a property to inspect from the perspective of its landlord.

**Status: published prototype · Version 0.1.1.** [Open the CRE studio](https://desenlin.com/ame-quarter/). The project remains **Ame Quarter**; its public tool-card title is **3-D Retail Plaza & Leasing**, with the **CRE studio** tag. It is listed on the FIN 355 course page and the academic website's Teaching and Labs pages.

## Explore the prototype

1. Open the [published studio](https://desenlin.com/ame-quarter/) in a current browser.
2. Start in **Explore 3-D Map**: orbit the plaza, walk into shops or take a guided tour. Select a tenant in the premise file and use **Visit** to go there.
3. Choose **Leasing plan** for the clickable ground-floor layout, or open the rent roll and landlord activity. Switching to the plan removes the 3-D scene; financial controls work without WebGL.

For local development, serve this folder with `python3 -m http.server 8000` and open `http://localhost:8000/`.

The default **Balanced** graphics profile retains geometry, direct lighting, the two weather/lighting scenes, and a directional shadow. **Full reflections** restores planar reflections, six storefront shadow maps, and higher resolution. The scene pauses while reading other panels or when offscreen. Choosing **Leasing plan** removes its iframe; returning to 3-D starts a fresh scene with the selected graphics setting. If WebGL is unavailable, the studio automatically shows the leasing plan with a short notice. **Open 3-D in new tab** opens the district at full-window size with the selected graphics setting.

## First activity: renew or re-lease?

Midori occupies 450 SF and its hypothetical lease expires on December 31, 2027. Compare renewal with a new tenant over January 2028–December 2032. Change offered rent, escalation, downtime, free rent, tenant improvements, commission and discount rate. The model reports monthly-discounted NPV and calendar-year operating and leasing cash flows. Discussion questions help students interpret the result; there is no comparison download or written-response form.

The defaults deliberately favor renewal despite the new tenant’s higher rent. This is a teaching illustration, not an estimated market outcome.

## Information structure

- **Property & premises:** the default interactive 3-D map, a clickable ground-floor leasing plan and a persistent premise file.
- **Rent roll:** all six leases, area-weighted expiration exposure and annual landlord operating income.
- **Landlord activity:** one decision, two offers, explicit assumptions and transparent cash flows.
- **Assumptions:** modeled areas, recovery rules, timing and exclusions.
- **How 3-D works:** an accessible introduction to Three.js, implemented scene features, possible student extensions and device-side rendering.

All six rent-roll premises are ground-floor retail. Decorative upper structures are not additional rentable units. Areas are rounded assumptions, not surveyed measurements. There is no automatic relationship between appearance and rent, traffic or sales.

## Files and development

| Path | Purpose |
| --- | --- |
| `index.html` | Static production entry; no build needed to serve it |
| `studio/shell.html`, `studio/style.css` | Shared FIN 355 visual frame and studio interface |
| `studio/model.js` | Hypothetical leases and pure cash-flow functions |
| `studio/app.js` | Portable interface source |
| `studio/app.modular.js` | Generated interface using a lazy scene URL |
| `scene/` | Existing Three.js district and bundled renderer |
| `docs/hosting-audit.md` | GitHub limits, measured sizes and graphics constraints |
| `docs/review-notes.md` | Prototype decisions and validation scope |
| `integration/*.patch` | Reference patches for the published peer cards and FIN 355 catalog row |

After editing source, run `python3 build.py`. This refreshes the static entry and writes a portable single-file HTML and source ZIP one directory above the repository. Generated archives, dependency folders, screenshots and exports should not be committed repeatedly.

Run `node tests/model.cjs` for the financial checks. For interface checks, install the development-only `jsdom@26.1.0` package and run `node tests/interface.cjs`; no npm package is required to use or host the studio.

## Hosting and scope

This is a static HTML/CSS/JavaScript project. No server calculations, accounts, databases, analytics or API keys are required. Student inputs remain in the page and reset on reload; downloads are generated locally. The optional Japanese font request uses Google Fonts; the scene has a system-font fallback.

The website is published at [desenlin.com/ame-quarter/](https://desenlin.com/ame-quarter/) through GitHub Pages, using the `main` branch and repository root. A peer **CRE studio** card sits beside Site Feasibility Sandbox and the redevelopment case. The project can grow across courses while retaining a FIN 355 association.

The complete portable studio is approximately **0.83 MB**. The modular interface is about **0.05 MB**, and its automatically opened 3-D scene adds about **0.76 MB** before HTTP compression and caching. The iframe uses browser-native lazy loading, so browsers can defer it when far from the viewport. Three.js rendering runs on the visitor's device. GitHub serves static files; it does not render each frame. See the [hosting audit](docs/hosting-audit.md) for file sizes, bandwidth estimates and graphics limits.

## Educational scope and validation

All tenants, lease terms, rentable areas and investment assumptions are hypothetical. The district is an illustrative design, not a surveyed property, appraisal, verified market observation or code-compliance assessment. Financial outputs depend on the stated timing, recovery and discount-rate assumptions.

Automated checks cover the lease calculations, timing scenarios, interface interactions and scene structure. These checks do not establish device-specific frame rates or replace testing on student laptops and phones. See [review notes](docs/review-notes.md) for the validation scope.

This educational illustration is not financial, investment, tax, legal, or appraisal advice. The project is created by Desen Lin for instructional purposes; it does not imply endorsement by California State University, Fullerton or the California State University.

## Citation

GitHub's **Cite this repository** feature uses [`CITATION.cff`](CITATION.cff). Suggested citation:

> Lin, D. (2026). *Ame Quarter: CRE studio* (Version 0.1.1) [Computer software]. https://github.com/desenlin/ame-quarter

For reproducible discussion of a particular result, also record the commit used and the edited assumptions. Citation acknowledges the source; it does not grant reuse rights.

## Attribution and reuse

Copyright © 2026 Desen Lin, to the extent copyright applies. **No project-wide open-source or Creative Commons license has been granted for the original Ame Quarter code or educational content.** See [LICENSE.md](LICENSE.md). Public repository access is not a general permission to reuse its original material.

Third-party and separately licensed material retain their own terms:

- Three.js r128 and the Reflector helper: [MIT license](scene/vendor/LICENSE-THREE.txt).
- DejaVu font outlines: [bundled font license](scene/vendor/LICENSE-DEJAVU.txt).
- Optional Noto Sans JP: externally loaded through Google Fonts, with no font binary bundled.

See [ATTRIBUTION.md](ATTRIBUTION.md) for sources and scope. University names and marks are excluded from any reuse permission. Existing licenses attached to separately licensed material are not withdrawn or changed by this notice.

## Maintenance

Keep application changes focused, run the relevant checks, and regenerate the static entry with `python3 build.py` when source files change. Do not commit development dependencies, generated archives, credentials or student information. This prototype has no account system, stored submissions or backend data service.
