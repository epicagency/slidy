"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertAfter = insertAfter;
exports.siblings = siblings;
exports.nextSiblings = nextSiblings;
exports.parents = parents;
exports.offset = offset;
/**
 * Insert a DOM element after another
 *
 * @export
 * @param {HTMLElement} referenceNode existing element
 * @param {HTMLElement} newNode element to insert
 * @returns {undefined}
 */
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Get siblings elements
 *
 * @export
 * @param {HTMLElement} el reference element
 * @returns {HTMLCollection} siblings collection
 */
function siblings(el) {
  return Array.prototype.filter.call(el.parentNode.children, function (child) {
    return child !== el;
  });
}

/**
 * Get next siblings elements
 *
 * @export
 * @param {any} el reference element
 * @returns {undefined}
 */
function nextSiblings(el) {
  var siblings = [];

  /* eslint-disable no-param-reassign */
  el = el.nextElementSibling;
  while (el) {
    siblings.push(el);
    el = el.nextElementSibling;
  }
  /* eslint-enable no-param-reassign */

  return siblings;
}

/**
 * Get nearest ancestor by classname
 *
 * @export
 * @param {HTMLElement} el reference element
 * @param {string} className CSS class name
 * @returns {undefined}
 */
function parents(el, className) {
  /* eslint-disable no-param-reassign */
  for (; el && el !== document; el = el.parentNode) {
    if (el.classList.contains(className)) {
      return el;
    }
  }
  /* eslint-enable no-param-reassign */

  return null;
}

/**
 * Offset calculations
 *
 * @export
 * @param {HTMLElement} el reference element
 * @returns {object} left and top values
 */
function offset(el) {
  return {
    left: el.getBoundingClientRect().left + document.body.scrollLeft,
    top: el.getBoundingClientRect().top + document.body.scrollTop
  };
}