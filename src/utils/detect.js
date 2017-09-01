/* global DocumentTouch */

/**
 * Check for touchevents.
 *
 * @export
 * @returns {Boolean} if it's supported or not…
 */
export default function touchevents() {
  // eslint-disable-next-line
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  return false;
}
