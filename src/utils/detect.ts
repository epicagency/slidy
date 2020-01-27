class DocumentTouch {}

/**
 * Check for touchevents.
 */

export function touchevents() {
  if (
    'ontouchstart' in window ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  return false
}
