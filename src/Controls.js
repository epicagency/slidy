export class Controls {
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
    this._el.classList.add(`${this._slidy.namespace}-controls`);

    this._prev = document.createElement('button');
    this._prev.textContent = '<';
    this._prev.classList.add(`${this._slidy.namespace}-controls__item--prev`);

    this._next = document.createElement('button');
    this._next.textContent = '>';
    this._next.classList.add(`${this._slidy.namespace}-controls__item--next`);

    this._el.append(this._prev);
    this._el.append(this._next);
    this._outer.append(this._el);

    this.update();
  }

  bind() {
    this.onPrevClick = this.prevClick.bind(this);
    this.onNextClick = this.nextClick.bind(this);

    this._dispatcher.on('beforeSlide', this.update.bind(this));

    this.bindControls();
  }

  bindControls() {
    this._prev.addEventListener('click', this.onPrevClick);
    this._next.addEventListener('click', this.onNextClick);
  }

  prevClick() {
    this._slidy.slidePrev();
  }

  nextClick() {
    this._slidy.slideNext();
  }

  static disable(el) {
    el.setAttribute('disabled', '');
    el.classList.add('is-disabled');
  }

  static enable(el) {
    el.removeAttribute('disabled');
    el.classList.remove('is-disabled');
  }

  update() {
    if (!this._opts.loop) {
      const { newIndex } = this._slidy;
      const { length } = this._slidy.items;

      Controls.enable(this._prev);
      Controls.enable(this._next);

      if (newIndex === 0) {
        Controls.disable(this._prev);
      }

      if (newIndex === length - 1) {
        Controls.disable(this._next);
      }
    }
  }

  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
