/**
 * Insert a DOM element after another
 *
 * @export
 * @param {HTMLElement} referenceNode existing element
 * @param {HTMLElement} newNode element to insert
 * @returns {undefined}
 */
export function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

/**
 * Get siblings elements
 *
 * @export
 * @param {HTMLElement} el reference element
 * @returns {HTMLCollection} siblings collection
 */
export function siblings(el) {
  return Array.prototype.filter.call(el.parentNode.children, (child) => child !== el);
}

/**
 * Get next siblings elements
 *
 * @export
 * @param {any} el reference element
 * @returns {undefined}
 */
export function nextSiblings(el) {
  const siblings = [];

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
export function parents(el, className) {
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
export function offset(el) {
  return {
    left: el.getBoundingClientRect().left + document.body.scrollLeft,
    top: el.getBoundingClientRect().top + document.body.scrollTop,
  };
}
