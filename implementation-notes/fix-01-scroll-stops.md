# Fix 01 — scroll stops

- **Persistent objects:** all nine act timelines, the single master
  `ScrollTrigger`, navigator anchors and the reduced-motion act observer.
- **Change:** every act declares a stable settle point. Choreography occupies
  the first 70% of its span and a genuine no-motion plateau occupies the rest.
  Snap, hash navigation, navigator clicks and reduced-motion seeking all target
  the same settle points.
- **Timeline range:** Acts 00–08; no choreography coordinates or styling change.
- **Reduced-motion endpoint:** each act section seeks its declared stable state,
  not an act opening or shared seam.
- **Verification:** typecheck, lint, production build, settle-point bounds/order
  checks and inspection of the progress 0/1 snap escape hatch.
