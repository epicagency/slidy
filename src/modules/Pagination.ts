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
  private _currentEl: HTMLSpanElement
  private _total: number

  /**
   * Creates an instance of Pagination.
   */
  constructor(private _slidy: Slidy, private _opts: Options) {
    this._init()
    this._bind()
  }

  /**
   * Destroy component.
   */
  public destroy(): void {
    this._el.parentNode.removeChild(this._el)
  }

  /**
   * Init component.
   */
  private _init() {
    const { currentGroup, groupsMax, items, namespace: ns, outer } = this._slidy
    const { length } = items
    const { pagination, zerofill } = this._opts

    // Text content.
    const cur = format(currentGroup + 1, length, zerofill)
    const sep = pagination === true ? '/' : (pagination as string)
    const tot = format(groupsMax, groupsMax, zerofill)

    // HTML elements.
    const el = document.createElement('div')

    el.classList.add(`${ns}-pagination`)

    const html = `<span class="${ns}-pagination__current">${cur}</span>
  <span class="${ns}-pagination__separator">${sep}</span>
  <span class="${ns}-pagination__total">${tot}</span>`

    el.innerHTML = html

    this._el = el
    this._currentEl = this._el.querySelector('span:nth-child(1)')

    outer.appendChild(this._el)

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
    this._currentEl.textContent = format(
      this._slidy.newGroup + 1,
      this._total,
      this._opts.zerofill
    )
  }
}
