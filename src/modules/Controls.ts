import Slidy from '..'
import { Options } from '../defs'
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

  private _el: HTMLDivElement
  private _prev: HTMLButtonElement
  private _next: HTMLButtonElement

  /**
   * Creates an instance of Controls.
   */

  constructor(private _slidy: Slidy, private _opts: Options) {
    this._init()
    this._bind()
  }

  /**
   * Destroy component.
   */

  public destroy() {
    this._el.parentNode.removeChild(this._el)
    this._slidy.hooks.remove('beforeSlide', this._update)
  }

  /**
   * Init component.
   */

  private _init() {
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
    this._slidy.outer.appendChild(this._el)

    this._update()
  }

  /**
   * Bind event handlers.
   */

  private _bind() {
    this._prevClick = this._prevClick.bind(this)
    this._nextClick = this._nextClick.bind(this)
    this._update = this._update.bind(this)

    this._slidy.hooks.add('beforeSlide', this._update)

    this._bindControls()
  }

  /**
   * Bind controls handlers
   */

  private _bindControls() {
    this._prev.addEventListener('click', this._prevClick)
    this._next.addEventListener('click', this._nextClick)
  }

  /**
   * On prev click.
   */

  private _prevClick() {
    this._slidy.slidePrev()
  }

  /**
   * On next click.
   */

  private _nextClick() {
    this._slidy.slideNext()
  }

  /**
   * Update controls.
   */

  private _update() {
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
