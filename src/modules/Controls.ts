import Emitter from 'tiny-emitter'
import Slidy from '..'
import { ControlsOptions } from '../defs'
import { parseTpl } from '../utils'

/**
 * Create controls.
 */
export class Controls {
  /**
   * Disable control.
   */

  private static disable(el: HTMLButtonElement) {
    el.setAttribute('disabled', '')
    el.classList.add('is-disabled')
  }

  /**
   * Enable control.
   */

  private static enable(el: HTMLButtonElement) {
    el.removeAttribute('disabled')
    el.classList.remove('is-disabled')
  }

  private _slidy: Slidy
  private _opts: ControlsOptions
  private _outer: HTMLDivElement
  private _dispatcher: Emitter
  private _el: HTMLDivElement
  private _prev: HTMLButtonElement
  private _next: HTMLButtonElement

  /**
   * Creates an instance of Controls.
   */

  constructor(slidy: Slidy, opts: ControlsOptions) {
    this._slidy = slidy
    this._opts = opts
    this._outer = this._slidy.outer

    this._dispatcher = this._slidy.dispatcher

    this.init()
    this.bind()
  }

  /**
   * Destroy component.
   */

  public destroy() {
    this._el.parentNode.removeChild(this._el)
  }

  /**
   * Init component.
   */

  private init() {
    this._el = document.createElement('div')
    this._el.classList.add(`${this._slidy.namespace}-controls`)

    this._prev = document.createElement('button')
    this._prev.setAttribute('type', 'button')
    this._prev.classList.add(`${this._slidy.namespace}-controls__item--prev`)

    this._next = document.createElement('button')
    this._next.setAttribute('type', 'button')
    this._next.classList.add(`${this._slidy.namespace}-controls__item--next`)

    if (this._opts.controls === true) {
      this._prev.textContent = '<'
      this._next.textContent = '>'
    } else {
      this._prev.innerHTML = parseTpl(this._opts.controls as string, {
        label: 'previous slide',
      })
      this._next.innerHTML = parseTpl(this._opts.controls as string, {
        label: 'next slide',
      })
    }

    this._el.appendChild(this._prev)
    this._el.appendChild(this._next)
    this._outer.appendChild(this._el)

    this.update()
  }

  /**
   * Bind event handlers.
   */

  private bind() {
    this.prevClick = this.prevClick.bind(this)
    this.nextClick = this.nextClick.bind(this)

    this._dispatcher.on('beforeSlide', this.update.bind(this))

    this.bindControls()
  }

  /**
   * Bind controls handlers
   */

  private bindControls() {
    this._prev.addEventListener('click', this.prevClick)
    this._next.addEventListener('click', this.nextClick)
  }

  /**
   * On prev click.
   */

  private prevClick() {
    this._slidy.slidePrev()
  }

  /**
   * On next click.
   */

  private nextClick() {
    this._slidy.slideNext()
  }

  /**
   * Update controls.
   */

  private update() {
    if (!this._opts.loop) {
      const { newIndex } = this._slidy
      const { length } = this._slidy.items

      Controls.enable(this._prev)
      Controls.enable(this._next)

      if (newIndex === 0) {
        Controls.disable(this._prev)
      }

      if (newIndex === length - 1) {
        Controls.disable(this._next)
      }
    }
  }
}
