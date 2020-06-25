/* eslint-disable @typescript-eslint/ban-types */
import { GenericObject } from '../defs'

/**
 * Get nearest ancestor by classname
 */

export function parents(
  element: HTMLElement,
  className: string
): HTMLElement | null {
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

/**
 * Check for touchevents.
 */

export function touchevents(): boolean {
  if ('ontouchstart' in window) {
    return true
  }

  return false
}

/**
 * Given a number, return a zero-filled string.
 * Source: https://github.com/feross/zero-fill
 */

function zeroFill(width: number, number: number): string {
  const pad = '0'
  const fill = width - number.toString().length

  if (fill > 0) {
    return new Array(fill + 1).join(pad) + number
  }

  return String(number)
}

/**
 * Format number (zerofill or not)
 */

export function format(
  number: number,
  nbItems: number,
  zerofill: boolean | number
): string {
  if (zerofill === false) {
    return String(number)
  }

  const length = zerofill === true ? nbItems.toString(10).length : zerofill

  return zeroFill(length, number)
}

/**
 * Source: https://gist.github.com/smeijer/6580740a0ff468960a5257108af1384e
 */

function get(path: string, obj: GenericObject, fb = `$\{${path}}`): string {
  return (path
    .split('.')
    .reduce((res, key) => res[key] || fb, obj) as unknown) as string
}

export function parseTpl(
  template: string,
  map: GenericObject,
  fallback?: string
): string {
  return template.replace(/\$\{.+?}/g, (match: string) => {
    const path = match.substr(2, match.length - 3).trim()

    return get(path, map, fallback)
  })
}

// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

export function debounce(
  func: Function,
  wait: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (...args: any[]) => void {
  /* eslint-disable no-invalid-this */
  let timeout: number

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }

    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
  }
  /* eslint-enable no-invalid-this */
}
