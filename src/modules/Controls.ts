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
    this._el = document.querySelector('.slidy-controls')
    this._el.parentNode.removeChild(this._el)
    this._slidy.hooks.remove('beforeSlide', this._update)
  }

  /**
   * Init component.
   */
  private _init() {
    const { namespace: ns, outer } = this._slidy
    const { controls } = this._opts

    let prev = '<'
    let next = '>'

    if (controls !== true) {
      prev = parseTpl(controls as string, {
        label: 'prev slide',
      })
      next = parseTpl(controls as string, {
        label: 'next slide',
      })
    }

    const tpl = document.createElement('template')
    const html = `<div class="${ns}-controls">
  <button type="button" class="${ns}-controls__item--prev">${prev}</button>
  <button type="button class="${ns}-controls__item--next">${next}</button>
</div>`

    tpl.innerHTML = html

    this._el = tpl.content.firstChild as HTMLDivElement
    this._prev = this._el.querySelector('button:first-child')
    this._next = this._el.querySelector('button:last-child')
    outer.appendChild(this._el)

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

    if (this._opts.keyboard) {
      addEventListener('keydown', event => {
        if (event.keyCode === 37) {
          this._slidy.slidePrev('controls')
        } else if (event.keyCode === 39) {
          this._slidy.slideNext('controls')
        }
      })
    }
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
    this._slidy.slidePrev('controls')
  }

  /**
   * On next click.
   */
  private _nextClick() {
    this._slidy.slideNext('controls')
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

      if (newIndex + this._slidy.group >= length) {
        Controls.disable(this._next)
      }
    }
  }
}
