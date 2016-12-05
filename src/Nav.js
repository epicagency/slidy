const forEach = require('lodash/forEach');
const indexOf = require('lodash/indexOf');


export class Nav {
  constructor(slidy) {
    this._slidy = slidy;
    this._outer = this._slidy.outer;
    this._slides = this._slidy.items;

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
      // Override 1, 2, 3,… if data-slidy-nav attribute
      const content = ('slidyNav' in slide.dataset) ?
        slide.dataset.slidyNav :
        i + 1;
      html += `<li class="slidy-nav__item"><button>${content}</button></li>`;
    });

    this._el.innerHTML = html;
    this._outer.append(this._el);
    this._items = this._el.querySelectorAll('li');

    this.setActive();
  }

  bind() {
    this.onClick = this.click.bind(this);
    this.bindNav();
  }

  clearActive() {
    const currentItem = this._el.querySelector('.is-active');
    if (currentItem) {
      currentItem.classList.remove('is-active');
      currentItem.querySelector('button').removeAttribute('disabled');
    }
  }

  setActive() {
    const newItem = this._items[this._slidy.newIndex];
    newItem.classList.add('is-active');
    newItem.querySelector('button').setAttribute('disabled', true);
  }

  bindNav() {
    this._el.addEventListener('click', this.onClick);
  }

  click(e) {
    const clicked = e.target;
    if (clicked.nodeName === 'BUTTON') {
      const newIndex = indexOf(this._el.children, clicked.parentNode);
      this._slidy.slideTo(newIndex);
    }
  }

  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
