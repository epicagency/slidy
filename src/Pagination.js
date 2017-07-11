export class Pagination {
  constructor(slidy, opts) {
    this._slidy = slidy;
    this._opts = opts;
    this._outer = this._slidy.outer;

    this._dispatcher = this._slidy.dispatcher;

    this.init();
    this.bind();
  }

  init() {
    this._el = document.createElement('div');
    this._el.classList.add(`${this._slidy.namespace}-pagination`);

    this._current = document.createElement('span');
    this._current.textContent = this._slidy.currentIndex + 1;
    this._current.classList.add(`${this._slidy.namespace}-pagination__current`);

    this._separator = document.createElement('span');
    this._separator.textContent = this._opts === true ? '/' : this._opts;
    this._separator.classList.add(`${this._slidy.namespace}-pagination__separator`);

    this._total = document.createElement('span');
    this._total.textContent = this._slidy.items.length;
    this._total.classList.add(`${this._slidy.namespace}-pagination__total`);

    this._el.append(this._current);
    this._el.append(this._separator);
    this._el.append(this._total);
    this._outer.append(this._el);

    this.update();
  }

  bind() {
    this._dispatcher.on('beforeSlide', this.update.bind(this));
  }

  update() {
    this._current.textContent = this._slidy.newIndex + 1;
  }

  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
