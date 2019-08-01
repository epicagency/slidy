import Emitter from 'tiny-emitter';
import zeroFill from 'zero-fill';
import Slidy from '..';
import { IOptions } from '../defs';

/**
 * Create a pagination.
 *
 * @export
 * @class Pagination
 */
export class Pagination {
  private _slidy: Slidy;
  private _opts: IOptions;
  private _outer: HTMLDivElement;
  private _dispatcher: Emitter;
  private _el: HTMLDivElement;
  private _current: HTMLSpanElement;
  private _separator: HTMLSpanElement;
  private _total: HTMLSpanElement;

  /**
   * Creates an instance of Pagination.
   */
  constructor(slidy: Slidy) {
    this._slidy = slidy;
    this._opts = slidy.options;
    this._outer = slidy.outer;

    this._dispatcher = slidy.dispatcher;

    if (!this._opts.pagination) {
      return;
    }

    this.init();
    this.bind();
  }

  /**
   * Destroy component.
   */
  public destroy() {
    this._el.parentNode.removeChild(this._el);
  }

  /**
   * Init component.
   */
  private init() {
    this._el = document.createElement('div');
    this._el.classList.add(`${this._slidy.namespace}-pagination`);

    this._current = document.createElement('span');
    this._current.textContent = this.format(this._slidy.currentIndex + 1);
    this._current.classList.add(`${this._slidy.namespace}-pagination__current`);

    this._separator = document.createElement('span');
    this._separator.textContent = this._opts.pagination === true ? '/' : this._opts.pagination as string;
    this._separator.classList.add(`${this._slidy.namespace}-pagination__separator`);

    this._total = document.createElement('span');
    this._total.textContent = this.format(this._slidy.items.length);
    this._total.classList.add(`${this._slidy.namespace}-pagination__total`);

    this._el.appendChild(this._current);
    this._el.appendChild(this._separator);
    this._el.appendChild(this._total);
    this._outer.appendChild(this._el);

    this.update();
  }

  /**
   * Bind event handlers.
   */
  private bind() {
    this._dispatcher.on('beforeSlide', this.update.bind(this));
  }

  /**
   * Update current index.
   */
  private update() {
    this._current.textContent = this.format(this._slidy.newIndex + 1);
  }

  /**
   * Format number (zerofill or not)
   */
  // tslint:disable-next-line:variable-name
  private format(number: number) {
    if (this._opts.zerofill === false) {
      return number;
    }

    const length = this._opts.zerofill === true ?
      this._slidy.items.length.toString(10).length :
      this._opts.zerofill;

    return zeroFill(length, number);
  }
}
