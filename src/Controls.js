import parseTpl from './utils/parse-es6-template';

/**
* Create controls.
*
* @export
* @class Controls
*/
export class Controls {
  /**
   * Creates an instance of Controls.
   * @param {Slidy}  slidy slidy instance
   * @param {Object} opts  options
   * @memberof Controls
   */
  constructor(slidy, opts) {
    this._slidy = slidy;
    this._opts = opts;
    this._outer = this._slidy.outer;

    this._dispatcher = this._slidy.dispatcher;

    this.init();
    this.bind();
  }

  /**
   * Init component.
   *
   * @returns {undefined}
   * @memberof Controls
   */
  init() {
    console.info(this._opts);
    this._el = document.createElement('div');
    this._el.classList.add(`${this._slidy.namespace}-controls`);

    this._prev = document.createElement('button');
    this._prev.setAttribute('type', 'button');
    this._prev.classList.add(`${this._slidy.namespace}-controls__item--prev`);

    this._next = document.createElement('button');
    this._next.setAttribute('type', 'button');
    this._next.classList.add(`${this._slidy.namespace}-controls__item--next`);

    if (this._opts.controls === true) {
      this._prev.textContent = '<';
      this._next.textContent = '>';
    } else {
      this._prev.innerHTML = parseTpl(this._opts.controls, { label: 'previous slide' });
      this._next.innerHTML = parseTpl(this._opts.controls, { label: 'next slide' });
    }

    this._el.append(this._prev);
    this._el.append(this._next);
    this._outer.append(this._el);

    this.update();
  }

  /**
   * Bind event handlers.
   *
   * @returns {undefined}
   * @memberof Controls
   */
  bind() {
    this.onPrevClick = this.prevClick.bind(this);
    this.onNextClick = this.nextClick.bind(this);

    this._dispatcher.on('beforeSlide', this.update.bind(this));

    this.bindControls();
  }

  /**
   * Bind controls handlers
   *
   * @returns {undefined}
   * @memberof Controls
   */
  bindControls() {
    this._prev.addEventListener('click', this.onPrevClick);
    this._next.addEventListener('click', this.onNextClick);
  }

  /**
   * On prev click.
   *
   * @returns {undefined}
   * @memberof Controls
   */
  prevClick() {
    this._slidy.slidePrev();
  }

  /**
   * On next click.
   *
   * @returns {undefined}
   * @memberof Controls
   */
  nextClick() {
    this._slidy.slideNext();
  }

  /**
   * Disable control.
   *
   * @static
   * @param {HTMLElement} el control to disable
   * @returns {undefined}
   * @memberof Controls
   */
  static disable(el) {
    el.setAttribute('disabled', '');
    el.classList.add('is-disabled');
  }

  /**
   * Enable control.
   *
   * @static
   * @param {HTMLElement} el control to enable
   * @returns {undefined}
   * @memberof Controls
   */
  static enable(el) {
    el.removeAttribute('disabled');
    el.classList.remove('is-disabled');
  }

  /**
   * Update controls.
   *
   * @returns {undefined}
   * @memberof Controls
   */
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

  /**
   * Destroy component.
   *
   * @returns {undefined}
   * @memberof Controls
   */
  destroy() {
    this._el.parentNode.removeChild(this._el);
  }
}
