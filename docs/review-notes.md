# Prototype review notes

## Design decisions

- **Identity:** Ame Quarter is the project; CRE studio is the short product tag. FIN 355 is a course association, not the repository boundary.
- **Premise interaction:** use the leasing plan or native selector to open a persistent file. Avoid six separate modal dialogs and hidden hover-only information.
- **Stack plan:** a ground-floor leasing plan is more legible for this property than an artificial multistory stack. Position and proportions follow the simplified district footprints; rentable SF remains an explicit teaching assumption.
- **Lease detail:** current economics are immediately visible; commencement, rent steps, expense basis and monthly payment sit in an expandable section. The rent roll provides the property-wide comparison.
- **Activity:** compare renewal and re-leasing of Midori. A common end date makes opportunity cost visible without adding a terminal-value assumption. Downtime shortens the new lease within the common window.
- **Graphics:** the default view is a lightweight plan. The existing district is available on request, with Balanced and Full reflections modes. The scene is suspended while reading other panels.
- **Frame:** the description spans the shared content width. The full FIN 355 course badge, secondary CRE studio badge and footer disclaimer match the Atlas/FIN 355 frame. Navigation follows the header immediately, with the property context beneath it.
- **Premise names:** the selector pairs each tenant name with its use.
- **Simplified activity:** no comparison download or written-response box; discussion questions remain.
- **Three.js section:** describes scene construction, existing features, student extension ideas and local graphics rendering without requiring programming knowledge.

## Verified

- Financial tests cover 36 combinations of downtime, concessions and discount rate; an independent annuity check; recovery allocation; escalation dates; TI payment timing; commissions; annual cash reconciliation; invalid assumptions; and directional sensitivity.
- DOM-emulation checks exercise all six selections, the native premise selector, rent-roll navigation, activity navigation, assumption changes, invalid input states, reset, the rent-roll export, separate-tab scene links in both portable and modular builds, duplicate IDs and label associations.
- Both graphics profiles pass the existing geometry/navigation regression harness: six enterable shops; 18 tour stops; collision-free routes; doors; orbit/walk controls; roof toggles; night/dusk/light changes; streetlight directions; crossings and square scene bounds. Suspension and resume are checked.
- Three.js geometry and materials are constructed during the scene audit; counts and raw resource estimates are saved in `scene-audit-*.json`.

## Remaining validation before website launch

The browser preview of the local page was blocked by the browser URL policy. The interface tests use DOM emulation and the scene tests use a mocked renderer, so they do not verify responsive layout in a live browser, actual WebGL compilation, frame rate, browser-specific iframe behavior, or peak graphics memory. Check the final page on desktop Chrome/Safari and a representative student phone before launch.

Do not present modeled rents or physical design features as appraised value, verified market evidence or code-compliant dimensions. All such assumptions are clearly labeled in the page.

## Integration status

The separate repository is `desenlin/ame-quarter`. Proposed Labs/Teaching cards sit immediately after the redevelopment case as a peer of both existing projects. The FIN 355 README row links to the prototype repository until a live studio URL is available. Website cards should remain unmerged until the studio is reviewed and published.
