/**
 * Initial inline state that the interactions (in /js/interactions.js) animate from:
 * shifted down by `y` and hidden. It must be rendered on the element, exactly as the
 * Webflow export did, or the element flashes before animating in.
 */
export const ixUp = (y: string) =>
  ['-webkit-', '-moz-', '-ms-', '']
    .map((p) => `${p}transform:translate3d(0, ${y}, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0)`)
    .join(';') + ';opacity:0';
