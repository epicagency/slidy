type supportedEvents = 'tap' | 'swipe'

export class Events {
  private _events: Map<supportedEvents, Function> = new Map()
  private _x0: number

  // eslint-disable-next-line no-useless-constructor, no-empty-function
  constructor(private _el: HTMLElement) {
    console.log('EVENTS')
  }

  public on(name: supportedEvents, cb: Function) {
    this._events.set(name, cb)

    switch (name) {
      case 'tap':
        console.log('tap')
        break
      case 'swipe':
        console.log('swipe')
        this._el.addEventListener('mousedown', this.lock, false)
        this._el.addEventListener('touchstart', this.lock, false)
        this._el.addEventListener('mouseup', this.move, false)
        this._el.addEventListener('touchend', this.move, false)
        break
      default:
    }
  }

  public off(name: supportedEvents) {
    this._events.delete(name)

    switch (name) {
      case 'tap':
        console.log('tap')
        break
      case 'swipe':
        this._el.removeEventListener('mousedown', this.lock, false)
        this._el.removeEventListener('touchstart', this.lock, false)
        this._el.removeEventListener('mouseup', this.move, false)
        this._el.removeEventListener('touchend', this.move, false)
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

  private lock(e: TouchEvent | MouseEvent) {
    this._x0 = Events.unify(e).clientX
  }

  private move(e: TouchEvent | MouseEvent) {
    const dx = Events.unify(e).clientX - this._x0

    if (dx >= 0) {
      console.log('SWIPE:RIGHT', dx)
    } else {
      console.log('SWIPE:LEFT', dx)
    }
  }
}
