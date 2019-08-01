class DocumentTouch {}

/**
 * Check for touchevents.
 */
export function touchevents() {
  if (
    'ontouchstart' in window ||
    ((window as any).DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true;
  }

  return false;
}
