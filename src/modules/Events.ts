import { GestureDirection, SupportedEvents } from '../defs'

export class Events {
  private _events: Map<SupportedEvents, Function> = new Map()
  private _x0: number
  private _isMoving: boolean
  private _moveDelta = 50
  private _moveDuration = 100
  private _moveTimeout: number

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private _el: HTMLElement) {
    this._lock = this._lock.bind(this)
    this._release = this._release.bind(this)
  }

  public on(name: SupportedEvents, cb: Function) {
    this._events.set(name, cb)

    switch (name) {
      case 'click':
        console.log('click')
        break
      case 'tap':
        console.log('tap')
        break
      case 'drag':
        this._el.addEventListener('mousedown', this._lock, false)
        this._el.addEventListener('mouseup', this._release, false)
        break
      case 'swipe':
        this._el.addEventListener('touchstart', this._lock, false)
        this._el.addEventListener('touchend', this._release, false)
        break
      default:
    }
  }

  public off(name: SupportedEvents) {
    this._events.delete(name)

    switch (name) {
      case 'click':
        console.log('click')
        break
      case 'tap':
        console.log('tap')
        break
      case 'drag':
        this._el.removeEventListener('mousedown', this._lock, false)
        this._el.removeEventListener('mouseup', this._release, false)
        break
      case 'swipe':
        this._el.removeEventListener('touchstart', this._lock, false)
        this._el.removeEventListener('touchend', this._release, false)
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
    this._isMoving = false
    this._moveTimeout = window.setTimeout(() => {
      this._isMoving = true
    }, this._moveDuration)
  }

  private _release(e: TouchEvent | MouseEvent) {
    if (!this._isMoving) {
      return
    }

    const dx = Events.unify(e).clientX - this._x0

    if (Math.abs(dx) < this._moveDelta) {
      return
    }

    const direction: GestureDirection = dx >= 0 ? 'right' : 'left'

    this._events.has('drag') && this._events.get('drag')(direction)
    this._events.has('swipe') && this._events.get('swipe')(direction)

    this._isMoving = false
    window.clearTimeout(this._moveTimeout)
  }
}
