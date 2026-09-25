# Prototype review notes

## Design decisions

- **Identity:** Ame Quarter is the project; CRE studio is the short product tag. FIN 355 is a course association, not the repository boundary.
- **Premise interaction:** use the leasing plan or native selector to open a persistent file. Avoid six separate modal dialogs and hidden hover-only information.
- **Stack plan:** a ground-floor leasing plan is more legible for this property than an artificial multistory stack. Position and proportions follow the simplified district footprints; rentable SF remains an explicit teaching assumption.
- **Lease detail:** current economics are immediately visible; commencement, rent steps, expense basis and monthly payment sit in an expandable section. The rent roll provides the property-wide comparison.
- **Activity:** compare renewal and re-leasing of Midori. A common end date makes opportunity cost visible without adding a terminal-value assumption. Downtime shortens the new lease within the common window.
- **Graphics:** the default view is **Explore 3-D Map** with Balanced graphics and native iframe lazy loading. The leasing-plan switch removes the scene. An unavailable renderer automatically returns to the plan. The scene is suspended while reading other panels.
- **Catalog identity:** website and course cards use **3-D Retail Plaza & Leasing**, with the **CRE studio** tag. The page and project name remain **Ame Quarter**. Descriptions lead with exploring the interactive 3-D plaza.
- **Frame:** the description spans the shared content width. The full FIN 355 course badge, secondary CRE studio badge and footer disclaimer match the Atlas/FIN 355 frame. Navigation follows the header immediately, with the property context beneath it.
- **Premise names:** the selector pairs each tenant name with its use.
- **Simplified activity:** no comparison download or written-response box; discussion questions remain.
- **Three.js section:** describes scene construction, existing features, student extension ideas and local graphics rendering without requiring programming knowledge.

## Verified

- Financial tests cover 36 combinations of downtime, concessions and discount rate; an independent annuity check; recovery allocation; escalation dates; TI payment timing; commissions; annual cash reconciliation; invalid assumptions; and directional sensitivity.
- DOM-emulation checks cover automatic 3-D startup, readiness, pause/resume, removal via the leasing-plan switch, stale-frame isolation, unavailable-renderer fallback and retry. They also exercise all six selections, the native premise selector, rent-roll navigation, activity navigation, assumption changes, invalid input states, reset, the rent-roll export, separate-tab scene links in both portable and modular builds, duplicate IDs and label associations.
- Both graphics profiles pass the existing geometry/navigation regression harness: six enterable shops; 18 tour stops; collision-free routes; doors; orbit/walk controls; roof toggles; night/dusk/light changes; streetlight directions; crossings and square scene bounds. Suspension and resume are checked.
- Three.js geometry and materials are constructed during the scene audit; counts and raw resource estimates are saved in `scene-audit-*.json`.

## Published-site verification and remaining device checks

After publication approval, the initial GitHub Pages deployment succeeded and the live studio loaded at `https://desenlin.com/ame-quarter/`. Browser checks confirmed premise selection, the landlord activity's default cash flows, loading the embedded scene page, and opening the scene in a separate tab with the selected graphics setting. The cloud browser reports WebGL unavailable and the page presents its fallback message; actual 3-D rendering, frame rate and peak graphics memory could not be tested there.

The earlier local-page preview was blocked by the browser URL policy. Automated interface checks use DOM emulation and scene checks use a mocked renderer. Testing on hardware-accelerated desktop Chrome/Safari and a representative student phone remains useful for device-specific layout and graphics performance.

Do not present modeled rents or physical design features as appraised value, verified market evidence or code-compliant dimensions. All such assumptions are clearly labeled in the page.

## Integration status

The separate repository is `desenlin/ame-quarter`. Public hosting was explicitly approved and enabled. Labs/Teaching cards sit immediately after the redevelopment case as a peer of both existing projects. The FIN 355 README row targets the same live studio URL. FIN355 PR #8 and academic-website PR #27 are merged.

The repository includes a versioned citation (`CITATION.cff`) and an explicit rights notice (`LICENSE.md`). No new open reuse license is granted for original project material; third-party and separately licensed components retain their existing terms.
