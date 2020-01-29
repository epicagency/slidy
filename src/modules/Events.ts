import { GestureDirection, SupportedEvents } from '../defs'

export class Events {
  private _events: Map<SupportedEvents, Function> = new Map()
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
    this._events.set(name, cb)

    switch (name) {
      case 'click':
      case 'drag':
        if (!this._hasMouseListener) {
          this._el.addEventListener('mousedown', this._lock, false)
          this._el.addEventListener('mouseup', this._release, false)
          this._hasMouseListener = true
        }
        break
      case 'tap':
      case 'swipe':
        if (!this._hasTouchListener) {
          this._el.addEventListener('touchstart', this._lock, false)
          this._el.addEventListener('touchend', this._release, false)
          this._hasTouchListener = true
        }
        break
      default:
    }
  }

  public off(name: SupportedEvents) {
    this._events.delete(name)

    switch (name) {
      case 'click':
      case 'drag':
        if (!this._events.has('click') && !this._events.has('drag')) {
          this._el.removeEventListener('mousedown', this._lock, false)
          this._el.removeEventListener('mouseup', this._release, false)
          this._hasMouseListener = false
        }
        break
      case 'tap':
      case 'swipe':
        if (!this._events.has('tap') && !this._events.has('swipe')) {
          this._el.removeEventListener('touchstart', this._lock, false)
          this._el.removeEventListener('touchend', this._release, false)
          this._hasTouchListener = false
        }
        break
      default:
    }
  }

  public destroy() {
    this._events.forEach((cb, name) => {
      this.off(name)
    })
  }

  private static unify(e: TouchEvent | MouseEvent): Touch | MouseEvent {
    return (e as TouchEvent).changedTouches
      ? (e as TouchEvent).changedTouches[0]
      : (e as MouseEvent)
  }

  private _lock(e: TouchEvent | MouseEvent) {
    this._x0 = Events.unify(e).clientX
    this._t0 = Date.now()
  }

  private _release(e: TouchEvent | MouseEvent) {
    const dx = Events.unify(e).clientX - this._x0
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
}
