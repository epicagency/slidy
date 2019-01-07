'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pagination = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _zeroFill = require('zero-fill');

var _zeroFill2 = _interopRequireDefault(_zeroFill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create a pagination.
 *
 * @export
 * @class Pagination
 */
var Pagination = exports.Pagination = function () {
  /**
   * Creates an instance of Pagination.
   * @param {Slidy}          slidy slidy instance
   * @param {boolean|string} opts  navigation seperator
   * @memberof Pagination
   */
  function Pagination(slidy) {
    _classCallCheck(this, Pagination);

    this._slidy = slidy;
    this._opts = slidy.options;
    this._outer = slidy.outer;

    this._dispatcher = slidy.dispatcher;

    this.init();
    this.bind();
  }

  /**
   * Init component.
   *
   * @returns {undefined}
   * @memberof Pagination
   */


  _createClass(Pagination, [{
    key: 'init',
    value: function init() {
      this._el = document.createElement('div');
      this._el.classList.add(this._slidy.namespace + '-pagination');

      this._current = document.createElement('span');
      this._current.textContent = this.format(this._slidy.currentIndex + 1);
      this._current.classList.add(this._slidy.namespace + '-pagination__current');

      this._separator = document.createElement('span');
      this._separator.textContent = this._opts.pagination === true ? '/' : this._opts.pagination;
      this._separator.classList.add(this._slidy.namespace + '-pagination__separator');

      this._total = document.createElement('span');
      this._total.textContent = this.format(this._slidy.items.length);
      this._total.classList.add(this._slidy.namespace + '-pagination__total');

      this._el.appendChild(this._current);
      this._el.appendChild(this._separator);
      this._el.appendChild(this._total);
      this._outer.appendChild(this._el);

      this.update();
    }

    /**
     * Bind event handlers.
     *
     * @returns {undefined}
     * @memberof Pagination
     */

  }, {
    key: 'bind',
    value: function bind() {
      this._dispatcher.on('beforeSlide', this.update.bind(this));
    }

    /**
     * Update current index.
     *
     * @returns {undefined}
     * @memberof Pagination
     */

  }, {
    key: 'update',
    value: function update() {
      this._current.textContent = this.format(this._slidy.newIndex + 1);
    }

    /**
     * Destroy component.
     *
     * @returns {undefined}
     * @memberof Pagination
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._el.parentNode.removeChild(this._el);
    }

    /**
     * Format number (zerofill or not)
     *
     * @param {Number} number number to format
     * @returns {Number} formatted number
     * @memberof Pagination
     */

  }, {
    key: 'format',
    value: function format(number) {
      if (this._opts.zerofill === false) {
        return number;
      }

      var length = this._opts.zerofill === true ? this._slidy.items.length.toString(10).length : this._opts.zerofill;

      return (0, _zeroFill2.default)(length, number);
    }
  }]);

  return Pagination;
}();