import zeroFill from 'zero-fill';
const forEach = require('lodash/forEach');
const indexOf = require('lodash/indexOf');

import parseTpl from './utils/parse-es6-template';
import { parents } from './utils/$';

/**
 * Create navigation.
 *
 * @export
 * @class Nav
 */
export class Nav {
  /**
   * Creates an instance of Nav.
   * @param {Slidy} slidy slidy instance
   * @memberof Nav
   */
  constructor(slidy) {
    this._slidy = slidy;
    this._opts = slidy.options;
    this._outer = slidy.outer;
    this._slides = slidy.items;

    const type = this._opts.nav;

    if ((/\${(number|thumb)}/).test(type)) {
      this._type = 'template';
      this._template = type;
    } else if (type === 'thumb') {
      this._type = 'thumb';
    } else if (type === 'number' || type === true) {
      this._type = 'number';
    } else {
      console.error('Slidy: wrong value for "nav" option');

      return;
    }

    this._dispatcher = this._slidy.dispatcher;

    this.init();
    this.bind();
  }

  /**
   * Init component.
   *
   * @returns {undefined}
   * @memberof Nav
   */
  init() {
    this._el = document.createElement('ol');
    this._el.classList.add(`${this._slidy.namespace}-nav`);

    let html = '';

    forEach(this._slides, (slide, i) => {
      let content;

      if ('slidyNav' in slide.dataset) {
        // Overrided content if data-slidy-nav attribute
        // data-slidy-nav value will replace ${number} and ${thumb}
        if (this._type === 'template') {
          content = parseTpl(
            this._template,
            {
              number: slide.dataset.slidyNav,
              thumb: slide.dataset.slidyNav,
            }
          );
        } else {
          content = `<button type="button">
            <span>
              ${slide.dataset.slidyNav}
            </span>
          </button>`;
        }
      } else {
        let number;
        let thumb;

        // Check for template, thumb or number…
        const dataTpl = {};

        switch (this._type) {
          case 'template':

            // We can have both number and thumb into the template string
            // or nothing…
            if ((/\${number}/).test(this._template)) {
              dataTpl.number = this.format(i + 1);
            }

            if ((/\${thumb}/).test(this._template)) {
              dataTpl.thumb = Nav.createThumb(slide);
            }

            content = parseTpl(this._template, dataTpl);
            break;

          case 'thumb':
            thumb = Nav.createThumb(slide);
            content = `<button type="button">
              <span>
                ${thumb}
              </span>
            </button>`;
            break;

          case 'number':
          default:
            number = this.format(i + 1);
            content = `<button type="button">
              <span>
                ${number}
              </span>
            </button>`;
            break;
        }
      }

      html += `<li class="${this._slidy.namespace}-nav__item">${content}</li>`;
    });

    this._el.innerHTML = html;
    this._outer.appendChild(this._el);
    this._items = this._el.querySelectorAll('li');

    this.setActive();
  }

  /**
   * Create thumbnail.
   *
   * @static
   * @param {HTMLElement} slide slide from slider
   * @returns {string} Thumbnail HTML string
   * @memberof Nav
   */
  static createThumb(slide) {
    let thumb;

    if ('slidyThumb' in slide.dataset) {
      thumb = slide.dataset.slidyThumb;
    } else {
      const src = slide.querySelector('img').getAttribute('src');

      thumb = src.replace(/(.*)(\.\w{3,4}$)/, '$1_thumb$2');
    }

    return `<img src="${thumb}">`;
  }

  /**
   * Format number (zerofill or not)
   *
   * @param {Number} number number to format
   * @returns {Number} formatted number
   * @memberof Nav
   */
  format(number) {
    if (this._opts.zerofill === false) {
      return number;
    }

    const length = this._opts.zerofill === true ?
      this._slidy.items.length.toString(10).length :
      this._opts.zerofill;

    return zeroFill(length, number);
  }

  /**
   * Bind event handlers.
   *
   * @returns {undefined}
   * @memberof Nav
   */
  bind() {
    this.onClick = this.click.bind(this);
    this._dispatcher.on('beforeSlide', this.clearActive.bind(this));
    this._dispatcher.on('beforeSlide', this.setActive.bind(this));
    this.bindNav();
  }

  /**
   * Bind nav handlers.
   *
   * @returns {undefined}
   * @memberof Nav
   */
  bindNav() {
    this._el.addEventListener('click', this.onClick);
  }

  /**
   * Clear active nav item.
   *
   * @returns {undefined}
   * @memberof Nav
   */
  clearActive() {
    const currentItem = this._el.querySelector('.is-active');

    if (currentItem) {
      currentItem.classList.remove('is-active');
      const button = currentItem.querySelector('button');

      if (button) {
        button.disabled = false;
      }
    }
  }

  /**
   * Set active nav item.
   *
   * @returns {undefined}
   * @memberof Nav
   */
  setActive() {
    const newItem = this._items[this._slidy.newIndex];

    newItem.classList.add('is-active');

    const button = newItem.querySelector('button');

    if (button) {
      button.disabled = true;
    }
  }

  /**
   * On nav item click
   *
   * @param {Event} e click event
   * @returns {undefined}
   * @memberof Nav
   */
  click(e) {
    const clicked = parents(e.target, `${this._slidy.namespace}-nav__item`);

    if (clicked !== null) {
      const newIndex = indexOf(this._el.children, clicked);

      this._slidy.slideTo(newIndex);
    }
  }

  /**
   * Destroy component.
   *
   * @returns {undefined}
   * @memberof Nav
   */
  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
