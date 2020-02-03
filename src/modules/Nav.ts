import Slidy from '..'
import { GenericObject, Options } from '../defs'
import { parents, parseTpl, format } from '../utils'

/**
 * Create navigation.
 *
 * @export
 * @class Nav
 */
export class Nav {
  /**
   * Create thumbnail.
   */

  private static _createThumb(slide: HTMLElement) {
    let thumb

    if ('slidyThumb' in slide.dataset) {
      thumb = slide.dataset.slidyThumb
    } else {
      const src = slide.querySelector('img').getAttribute('src')

      thumb = src.replace(/(.*)(\.\w{3,4}$)/, '$1_thumb$2')
    }

    return `<img src="${thumb}">`
  }

  private _items: HTMLElement[]
  private _type: string
  private _template: string
  private _el: HTMLOListElement

  /**
   * Creates an instance of Nav.
   */

  constructor(private _slidy: Slidy, private _opts: Options) {
    this._items = _slidy.items

    if (!this._opts.nav) {
      return
    }

    const type = this._opts.nav === true ? 'number' : this._opts.nav

    if (/\${(number|thumb)}/.test(type)) {
      this._type = 'template'
      this._template = type
    } else if (type === 'thumb') {
      this._type = 'thumb'
    } else if (type === 'number') {
      this._type = 'number'
    } else {
      console.error('Slidy: wrong value for "nav" option')

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

    this._slidy.hooks.remove('beforeSlide', this._clearActive)
    this._slidy.hooks.remove('beforeSlide', this._setActive)
  }

  /**
   * Init component.
   */

  private _init() {
    this._el = document.createElement('ol')
    this._el.classList.add(`${this._slidy.namespace}-nav`)

    let html = ''

    this._items.forEach((slide, i) => {
      let content

      if ('slidyNav' in slide.dataset) {
        // Overrided content if data-slidy-nav attribute
        // data-slidy-nav value will replace ${number} and ${thumb}
        if (this._type === 'template') {
          content = parseTpl(this._template, {
            number: slide.dataset.slidyNav,
            thumb: slide.dataset.slidyNav,
          })
        } else {
          content = `<button type="button">
            <span>
              ${slide.dataset.slidyNav}
            </span>
          </button>`
        }
      } else {
        let number
        let thumb

        // Check for template, thumb or number…
        const dataTpl: GenericObject = {}

        switch (this._type) {
          case 'template':
            // We can have both number and thumb into the template string
            // or nothing…
            if (/\${number}/.test(this._template)) {
              dataTpl.number = format(
                i + 1,
                this._items.length,
                this._opts.zerofill
              )
            }

            if (/\${thumb}/.test(this._template)) {
              dataTpl.thumb = Nav._createThumb(slide)
            }

            content = parseTpl(this._template, dataTpl)
            break

          case 'thumb':
            thumb = Nav._createThumb(slide)
            content = `<button type="button">
              <span>
                ${thumb}
              </span>
            </button>`
            break

          case 'number':
          default:
            number = format(i + 1, this._items.length, this._opts.zerofill)
            content = `<button type="button">
              <span>
                ${number}
              </span>
            </button>`
            break
        }
      }

      html += `<li class="${this._slidy.namespace}-nav__item">${content}</li>`
    })

    this._el.innerHTML = html
    this._slidy.outer.appendChild(this._el)
    this._items = Array.from(this._el.querySelectorAll('li'))

    this._setActive()
  }

  /**
   * Bind event handlers.
   */

  private _bind() {
    this._onClick = this._onClick.bind(this)
    this._clearActive = this._clearActive.bind(this)
    this._setActive = this._setActive.bind(this)

    this._slidy.hooks.add('beforeSlide', this._clearActive)
    this._slidy.hooks.add('beforeSlide', this._setActive)

    this._bindNav()
  }

  /**
   * Bind nav handlers.
   */

  private _bindNav() {
    this._el.addEventListener('click', this._onClick)
  }

  /**
   * Clear active nav item.
   */

  private _clearActive() {
    const currentItem = this._el.querySelector('.is-active')

    if (currentItem) {
      currentItem.classList.remove('is-active')
      const button = currentItem.querySelector('button')

      if (button) {
        button.disabled = false
      }
    }
  }

  /**
   * Set active nav item.
   */

  private _setActive() {
    const newItem = this._items[this._slidy.newIndex]

    newItem.classList.add('is-active')

    const button = newItem.querySelector('button')

    if (button) {
      button.disabled = true
    }
  }

  /**
   * On nav item click
   */

  private _onClick(e: MouseEvent) {
    const clicked = parents(
      e.target as HTMLElement,
      `${this._slidy.namespace}-nav__item`
    )

    if (clicked !== null) {
      const newIndex = Array.from(this._el.children).indexOf(clicked)

      this._slidy.slideTo(newIndex)
    }
  }
}
