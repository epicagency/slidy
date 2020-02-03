import Slidy from '..'
import { Options } from '../defs'
import { format } from '../utils'

/**
 * Create a pagination.
 *
 * @export
 * @class Pagination
 */
export class Pagination {
  private _el: HTMLDivElement
  private _current: HTMLSpanElement
  private _separator: HTMLSpanElement
  private _total: HTMLSpanElement

  /**
   * Creates an instance of Pagination.
   */

  constructor(private _slidy: Slidy, private _opts: Options) {
    if (!this._opts.pagination) {
      return
    }

    this._init()
    this._bind()
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

  private _init() {
    this._el = document.createElement('div')
    this._el.classList.add(`${this._slidy.namespace}-pagination`)

    this._current = document.createElement('span')
    this._current.textContent = format(
      this._slidy.currentIndex + 1,
      this._slidy.items.length + 1,
      this._opts.zerofill
    )
    this._current.classList.add(`${this._slidy.namespace}-pagination__current`)

    this._separator = document.createElement('span')
    this._separator.textContent =
      this._opts.pagination === true ? '/' : (this._opts.pagination as string)
    this._separator.classList.add(
      `${this._slidy.namespace}-pagination__separator`
    )

    this._total = document.createElement('span')
    this._total.textContent = format(
      this._slidy.items.length,
      this._slidy.items.length,
      this._opts.zerofill
    )
    this._total.classList.add(`${this._slidy.namespace}-pagination__total`)

    this._el.appendChild(this._current)
    this._el.appendChild(this._separator)
    this._el.appendChild(this._total)
    this._slidy.outer.appendChild(this._el)

    this._update()
  }

  /**
   * Bind event handlers.
   */

  private _bind() {
    this._slidy.hooks.add('beforeSlide', this._update.bind(this))
  }

  /**
   * Update current index.
   */

  private _update() {
    this._current.textContent = format(
      this._slidy.newIndex + 1,
      this._slidy.items.length + 1,
      this._opts.zerofill
    )
  }
}
