export class Controls {
  constructor(slidy) {
    this._slidy = slidy;
    this._outer = this._slidy.outer;

    this._dispatcher = this._slidy.dispatcher;

    this.init();
    this.bind();
  }

  init() {
    this._el = document.createElement('div');
    this._el.classList.add('slidy-controls');

    this._prev = document.createElement('button');
    this._prev.textContent = '<';
    this._prev.classList.add('slidy-controls__item--prev');

    this._next = document.createElement('button');
    this._next.textContent = '>';
    this._next.classList.add('slidy-controls__item--next');

    this._el.append(this._prev);
    this._el.append(this._next);
    this._outer.append(this._el);
  }

  bind() {
    this.onPrevClick = this.prevClick.bind(this);
    this.onNextClick = this.nextClick.bind(this);

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

  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
