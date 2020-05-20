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

  private static _createContent(content: string) {
    return `<button type="button">
    <span>
      ${content}
    </span>
  </button>`
  }

  private _type: string
  private _template: string
  private _el: HTMLOListElement
  private _items: HTMLLIElement[]

  /**
   * Creates an instance of Nav.
   */

  constructor(private _slidy: Slidy, private _opts: Options) {
    if (!this._opts.nav) {
      return
    }

    // Check nav 'type' (template | thumb | number)
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
    const { items, groupsMax, namespace: ns, outer } = this._slidy
    const { zerofill } = this._opts

    // HTML elements.
    const el = document.createElement('ol')

    el.classList.add(`${ns}-nav`)

    const html = items
      .filter((slide, i) => i % this._slidy.group === 0)
      .map((slide, i) => {
        if ('slidyNav' in slide.dataset) {
          const { slidyNav } = slide.dataset

          // Overrided content if data-slidy-nav attribute
          // data-slidy-nav value will replace ${number} and ${thumb}
          if (this._type === 'template') {
            return parseTpl(this._template, {
              number: slidyNav,
              thumb: slidyNav,
            })
          }

          return Nav._createContent(slidyNav)
        }

        let number
        let thumb

        // Check for template, thumb or number…
        const dataTpl: GenericObject = {}

        switch (this._type) {
          case 'template':
            // We can have both number and thumb into the template string
            // or nothing…
            if (/\${number}/.test(this._template)) {
              dataTpl.number = format(i + 1, groupsMax, zerofill)
            }

            if (/\${thumb}/.test(this._template)) {
              dataTpl.thumb = Nav._createThumb(slide)
            }

            return parseTpl(this._template, dataTpl)

          case 'thumb':
            thumb = Nav._createThumb(slide)

            return Nav._createContent(thumb)

          case 'number':
          default:
            number = format(i + 1, groupsMax, zerofill)

            return Nav._createContent(number)
        }
      })
      .map(content => `<li class="${ns}-nav__item">${content}</li>`)
      .join('')

    el.innerHTML = html
    this._el = el
    outer.appendChild(this._el)
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
    const newItem = this._items[this._slidy.newGroup]

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
      const newGroup = Array.from(this._el.children).indexOf(clicked)

      this._slidy.slideTo(newGroup, 'nav')
    }
  }
}
