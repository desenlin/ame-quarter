# Ame Quarter · CRE studio

**Created by [Desen Lin](https://desenlin.com/) · California State University, Fullerton**

An independent retail real estate studio, with a first activity for **FIN 355**. A six-shop Japanese plaza becomes a property to inspect from the perspective of its landlord.

**Status: review prototype.** The repository contains the working static page; GitHub Pages has not been enabled. Website cards are prepared separately for review.

## Explore the prototype

1. Serve this folder with `python3 -m http.server 8000`.
2. Open `http://localhost:8000/` in a current browser.
3. Select a premise on the ground-floor leasing plan. Read its lease, then open the rent roll or landlord activity.
4. Choose **Explore 3-D** to enter the existing district. The leasing activity runs without WebGL.

The default **Balanced** graphics profile retains geometry, direct lighting, the two weather/lighting scenes, and a directional shadow. **Full reflections** restores planar reflections, six storefront shadow maps, and higher resolution. The scene pauses when hidden and can be closed to release its iframe. **Open 3-D in new tab** opens the district at full-window size with the selected graphics setting.

## First activity: renew or re-lease?

Midori occupies 450 SF and its hypothetical lease expires on December 31, 2027. Compare renewal with a new tenant over January 2028–December 2032. Change offered rent, escalation, downtime, free rent, tenant improvements, commission and discount rate. The model reports monthly-discounted NPV and calendar-year operating and leasing cash flows. Discussion questions help students interpret the result; there is no comparison download or written-response form.

The defaults deliberately favor renewal despite the new tenant’s higher rent. This is a teaching illustration, not an estimated market outcome.

## Information structure

- **Property & premises:** a clickable ground-floor leasing plan, persistent premise file and on-demand 3-D view.
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
| `integration/*.patch` | Proposed peer cards and FIN 355 catalog row |

After editing source, run `python3 build.py`. This refreshes the static entry and writes a portable single-file HTML and source ZIP one directory above the repository. Generated archives, dependency folders, screenshots and exports should not be committed repeatedly.

Run `node tests/model.cjs` for the financial checks. For interface checks, install the development-only `jsdom@26.1.0` package and run `node tests/interface.cjs`; no npm package is required to use or host the studio.

## Hosting and scope

This is a static HTML/CSS/JavaScript project. No server calculations, accounts, databases, analytics or API keys are required. Student inputs remain in the page and reset on reload; downloads are generated locally. The optional Japanese font request uses Google Fonts; the scene has a system-font fallback.

After prototype review, the intended website address is `https://desenlin.com/ame-quarter/`, with a peer **CRE studio** card beside Site Feasibility Sandbox and the redevelopment case. The project can grow across courses while retaining a FIN 355 association.

## Attribution and reuse

The bundled Three.js r128 engine and Reflector helper are MIT-licensed; see `scene/vendor/LICENSE-THREE.txt`. The existing glyph data attribution is preserved in `scene/vendor/LICENSE-DEJAVU.txt`. See `ATTRIBUTION.md`. No new license for the original project content or code is selected in this prototype.
