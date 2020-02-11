import { GestureDirection, SupportedEvents, SupportedTypes } from '../defs'

type Cb = (e: TouchEvent | MouseEvent) => void

export class Events {
  private _events: Map<SupportedEvents, Function> = new Map()
  private _types: Map<SupportedTypes, Cb> = new Map()
  private _x0: number
  private _t0: number

  private _holdThreshold = 1000
  private _movePrecision = 50
  private _moveThreshold = 100

  private _hasTouchListener: boolean
  private _hasMouseListener: boolean

  constructor(private _el: HTMLElement) {
    this._lock = this._lock.bind(this)
    this._release = this._release.bind(this)
  }

  public on(name: SupportedEvents, cb: Function) {
    let eventIn
    let eventOut
    let eventMove

    // Add event callback by event name.
    this._events.set(name, cb)

    switch (name) {
      case 'click':
      case 'drag':
        // Do not listen twice.
        if (!this._hasMouseListener) {
          // When it starts
          eventIn =
            Events._defaultType('mousedown') ||
            Events._pointerType('PointerDown')
          // When it ends
          eventOut =
            Events._defaultType('mouseup') || Events._pointerType('PointerUp')
          // In between…
          eventMove =
            Events._defaultType('mousemove') ||
            Events._pointerType('PointerMove')
          this._hasMouseListener = true
        }
        break
      case 'tap':
      case 'swipe':
        // Do not listen twice.
        if (!this._hasTouchListener) {
          // When it starts
          eventIn =
            Events._defaultType('touchstart') ||
            Events._pointerType('PointerDown')
          // When it ends
          eventOut =
            Events._defaultType('touchend') || Events._pointerType('PointerUp')
          // In between…
          eventMove =
            Events._defaultType('touchmove') ||
            Events._pointerType('PointerMove')
          this._hasTouchListener = true
        }
        break
      default:
    }

    // Binding
    eventIn && this._bind(eventIn as SupportedTypes, this._lock)
    eventOut && this._bind(eventOut as SupportedTypes, this._release)
    eventMove && this._bind(eventMove as SupportedTypes, this._prevent)
  }

  public destroy() {
    this._events.forEach((cb, name) => {
      this._events.delete(name)
    })
    this._types.forEach((cb, type) => {
      this._unbind(type)
    })
  }

  /**
   * Convert touch event with multiple fingers
   * to single one, similar to mouse event.
   * Needed to manage coordinates.
   */
  private static _unify(e: TouchEvent | MouseEvent): Touch | MouseEvent {
    return (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0]
      : (e as MouseEvent)
  }

  /**
   * Get pointer event
   * Supports MS prefixed events.
   */
  private static _pointerType(type: string): SupportedTypes | boolean {
    const lo = type.toLowerCase() as SupportedTypes
    const ms = `MS${type}` as SupportedTypes

    // eslint-disable-next-line no-nested-ternary
    return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : false
  }

  /**
   * Get HTML5 native event
   * Receives 'touchstart', returns 'ontouchstart'
   */
  private static _defaultType(type: SupportedTypes): SupportedTypes | boolean {
    return `on${type}` in window ? type : false
  }

  private _bind(type: SupportedTypes, cb: Cb, options = false) {
    if (!this._types.has(type)) {
      this._el.addEventListener(type, cb, options)
      this._types.set(type, cb)
    }
  }

  private _unbind(type: SupportedTypes) {
    if (this._types.has(type)) {
      const cb = this._types.get(type)

      this._el.removeEventListener(type, cb)
      this._types.delete(type)
    }
  }

  /**
   * First step, we lock initial time and coordinates.
   */
  private _lock(e: TouchEvent | MouseEvent) {
    this._x0 = Events._unify(e).clientX
    this._t0 = Date.now()
  }

  /**
   * Last step, do some calculation and trigger event callbacks.
   */
  private _release(e: TouchEvent | MouseEvent) {
    const dx = Events._unify(e).clientX - this._x0
    const dt = Date.now() - this._t0

    // Click if…
    if (Math.abs(dx) <= this._movePrecision && dt <= this._holdThreshold) {
      this._events.has('click') && this._events.get('click')()
      this._events.has('tap') && this._events.get('tap')()

      return
    }

    // Drag if…
    if (Math.abs(dx) > this._movePrecision && dt > this._moveThreshold) {
      const direction: GestureDirection = dx >= 0 ? 'right' : 'left'

      this._events.has('drag') && this._events.get('drag')(direction, 'drag')
      this._events.has('swipe') && this._events.get('swipe')(direction, 'swipe')
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private _prevent(e: TouchEvent | MouseEvent) {
    e.preventDefault()
  }
}
