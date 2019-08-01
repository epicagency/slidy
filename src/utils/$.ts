/**
 * Insert a DOM element after another
 */
// export function insertAfter(referenceNode: HTMLElement, newNode: HTMLElement) {
//   referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
// }

/**
 * Get siblings elements
 */
// export function siblings(el: HTMLElement): HTMLElement[] {
//   return Array.prototype.filter.call(el.parentNode.children, child => child !== el);
// }

/**
 * Get next siblings elements
 */
// export function nextSiblings(el: HTMLElement): HTMLElement[] {
//   const siblings = []; // tslint:disable-line:no-shadowed-variable

//   el = (el.nextElementSibling as HTMLElement);
//   while (el) {
//     siblings.push(el);
//     el = (el.nextElementSibling as HTMLElement);
//   }

//   return siblings;
// }

/**
 * Get nearest ancestor by classname
 */
export function parents(el: HTMLElement, className: string) {
  for (
    ;
    el && ((el as unknown) as Document) !== document;
    el = el.parentNode as HTMLElement
  ) {
    if (el.classList.contains(className)) {
      return el;
    }
  }

  return null;
}

/**
 * Offset calculations
 */
// export function offset(el: HTMLElement) {
//   return {
//     left: el.getBoundingClientRect().left + document.body.scrollLeft,
//     top: el.getBoundingClientRect().top + document.body.scrollTop,
//   };
// }
