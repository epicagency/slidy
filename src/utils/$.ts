/**
 * Get nearest ancestor by classname
 */

export function parents(element: HTMLElement, className: string) {
  for (
    let el = element;
    el && ((el as unknown) as Document) !== document;
    el = el.parentNode as HTMLElement
  ) {
    if (el.classList.contains(className)) {
      return el
    }
  }

  return null
}
