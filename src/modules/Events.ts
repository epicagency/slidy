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

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private _el: HTMLElement) {
    this._lock = this._lock.bind(this)
    this._release = this._release.bind(this)
  }

  public on(name: SupportedEvents, cb: Function) {
    let eventIn
    let eventOut
    let eventMove

    this._events.set(name, cb)

    switch (name) {
      case 'click':
      case 'drag':
        if (!this._hasMouseListener) {
          eventIn =
            Events._defaultType('mousedown') ||
            Events._pointerType('PointerDown')
          eventOut =
            Events._defaultType('mouseup') || Events._pointerType('PointerUp')
          eventMove =
            Events._defaultType('mousemove') ||
            Events._pointerType('PointerMove')
          this._hasMouseListener = true
        }
        break
      case 'tap':
      case 'swipe':
        if (!this._hasTouchListener) {
          eventIn =
            Events._defaultType('touchstart') ||
            Events._pointerType('PointerDown')
          eventOut =
            Events._defaultType('touchend') || Events._pointerType('PointerUp')
          eventMove =
            Events._defaultType('touchmove') ||
            Events._pointerType('PointerMove')
          this._hasTouchListener = true
        }
        break
      default:
    }

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

  private static _unify(e: TouchEvent | MouseEvent): Touch | MouseEvent {
    return (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0]
      : (e as MouseEvent)
  }

  private static _pointerType(type: string): SupportedTypes | boolean {
    const lo = type.toLowerCase() as SupportedTypes
    const ms = `MS${type}` as SupportedTypes

    // eslint-disable-next-line no-nested-ternary
    return navigator.msPointerEnabled ? ms : window.PointerEvent ? lo : false
  }

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

  private _lock(e: TouchEvent | MouseEvent) {
    this._x0 = Events._unify(e).clientX
    this._t0 = Date.now()
  }

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

      this._events.has('drag') && this._events.get('drag')(direction)
      this._events.has('swipe') && this._events.get('swipe')(direction)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private _prevent(e: TouchEvent | MouseEvent) {
    e.preventDefault()
  }
}
