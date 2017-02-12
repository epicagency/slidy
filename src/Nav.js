const forEach = require('lodash/forEach');
const indexOf = require('lodash/indexOf');

import parseTpl from './utils/parse-es6-template';
import { parents } from './utils/$';

export class Nav {
  constructor(slidy) {
    this._slidy = slidy;
    this._outer = slidy.outer;
    this._slides = slidy.items;

    const type = slidy.options.nav;

    if (/\${(number|thumb)}/.test(type)) {
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
    this._dispatcher.on('beforeSlide', this.clearActive.bind(this));
    this._dispatcher.on('beforeSlide', this.setActive.bind(this));

    this.init();
    this.bind();
  }

  init() {
    this._el = document.createElement('ol');
    this._el.classList.add('slidy-nav');

    let html = '';
    forEach(this._slides, (slide, i) => {
      let content;

      if ('slidyNav' in slide.dataset) {
        // Overrided content if data-slidy-nav attribute
        if (this._type === 'template') {
          content = parseTpl(
            this._template,
            {
              number: slide.dataset.slidyNav,
              thumb: slide.dataset.slidyNav,
            }
          );
        } else {
          content = `<button>
            <span>
              ${slide.dataset.slidyNav}
            </span>
          </button>`;
        }
      } else {
        let number;
        let thumb;

        // Check for template, thumb or number…
        switch (this._type) {
          case 'template':
            number = i + 1;
            thumb = this.createThumb(slide);
            content = parseTpl(
              this._template,
              {
                number: number,
                thumb: thumb,
              }
            );
            break;

          case 'thumb':
            thumb = this.createThumb(slide);
            content = `<button>
              <span>
                ${thumb}
              </span>
            </button>`;
            break;

          case 'number':
          default:
            number = i + 1;
            content = `<button>
              <span>
                ${number}
              </span>
            </button>`;
            break;
        }
      }

      html += `<li class="slidy-nav__item">${content}</li>`;
    });

    this._el.innerHTML = html;
    this._outer.append(this._el);
    this._items = this._el.querySelectorAll('li');

    this.setActive();
  }

  createThumb(slide) {
    const src = slide.querySelector('img').getAttribute('src');
    const thumb = src.replace(/(.*)(\.\w{3,4}$)/, '$1_thumb$2');
    return `<img src="${thumb}">`;
  }

  bind() {
    this.onClick = this.click.bind(this);
    this.bindNav();
  }

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

  setActive() {
    const newItem = this._items[this._slidy.newIndex];
    newItem.classList.add('is-active');
    const button = newItem.querySelector('button');
    if (button) {
      button.disabled = true;
    }
  }

  bindNav() {
    this._el.addEventListener('click', this.onClick);
  }

  click(e) {
    const clicked = parents(e.target, 'slidy-nav__item');
    if (clicked !== null) {
      const newIndex = indexOf(this._el.children, clicked);
      this._slidy.slideTo(newIndex);
    }
  }

  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
