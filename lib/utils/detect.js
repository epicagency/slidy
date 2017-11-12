'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.touchevents = touchevents;
/* global DocumentTouch */

/**
 * Check for touchevents.
 *
 * @export
 * @returns {Boolean} if it's supported or not…
 */
function touchevents() {
  // eslint-disable-next-line
  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }

  return false;
}