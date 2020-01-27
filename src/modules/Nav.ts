import Emitter from 'tiny-emitter'
import zeroFill from 'zero-fill'
import Slidy from '..'
import { GenericObject, Options } from '../defs'
import { parents, parseTpl } from '../utils'

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

  private static createThumb(slide: HTMLElement) {
    let thumb

    if ('slidyThumb' in slide.dataset) {
      thumb = slide.dataset.slidyThumb
    } else {
      const src = slide.querySelector('img').getAttribute('src')

      thumb = src.replace(/(.*)(\.\w{3,4}$)/, '$1_thumb$2')
    }

    return `<img src="${thumb}">`
  }

  private _slidy: Slidy
  private _opts: Options
  private _outer: HTMLDivElement
  private _items: HTMLElement[]
  private _type: string
  private _template: string
  private _dispatcher: Emitter
  private _el: HTMLOListElement

  /**
   * Creates an instance of Nav.
   */

  constructor(slidy: Slidy) {
    this._slidy = slidy
    this._opts = slidy.options
    this._outer = slidy.outer
    this._items = slidy.items

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
              dataTpl.number = this.format(i + 1)
            }

            if (/\${thumb}/.test(this._template)) {
              dataTpl.thumb = Nav.createThumb(slide)
            }

            content = parseTpl(this._template, dataTpl)
            break

          case 'thumb':
            thumb = Nav.createThumb(slide)
            content = `<button type="button">
              <span>
                ${thumb}
              </span>
            </button>`
            break

          case 'number':
          default:
            number = this.format(i + 1)
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
    this._outer.appendChild(this._el)
    this._items = Array.from(this._el.querySelectorAll('li'))

    this.setActive()
  }

  /**
   * Format number (zerofill or not)
   */

  // tslint:disable-next-line:variable-name
  private format(number: number) {
    if (this._opts.zerofill === false) {
      return number
    }

    const length =
      this._opts.zerofill === true
        ? this._slidy.items.length.toString(10).length
        : this._opts.zerofill

    return zeroFill(length, number)
  }

  /**
   * Bind event handlers.
   */

  private bind() {
    this.onClick = this.onClick.bind(this)
    this._dispatcher.on('beforeSlide', this.clearActive.bind(this))
    this._dispatcher.on('beforeSlide', this.setActive.bind(this))
    this.bindNav()
  }

  /**
   * Bind nav handlers.
   */

  private bindNav() {
    this._el.addEventListener('click', this.onClick)
  }

  /**
   * Clear active nav item.
   */

  private clearActive() {
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

  private setActive() {
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

  private onClick(e: MouseEvent) {
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
