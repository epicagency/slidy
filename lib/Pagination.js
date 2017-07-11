'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pagination = exports.Pagination = function () {
  function Pagination(slidy, opts) {
    _classCallCheck(this, Pagination);

    this._slidy = slidy;
    this._opts = opts;
    this._outer = this._slidy.outer;

    this._dispatcher = this._slidy.dispatcher;

    this.init();
    this.bind();
  }

  _createClass(Pagination, [{
    key: 'init',
    value: function init() {
      this._el = document.createElement('div');
      this._el.classList.add(this._slidy.namespace + '-pagination');

      this._current = document.createElement('span');
      this._current.textContent = this._slidy.currentIndex + 1;
      this._current.classList.add(this._slidy.namespace + '-pagination__current');

      this._separator = document.createElement('span');
      this._separator.textContent = this._opts === true ? '/' : this._opts;
      this._separator.classList.add(this._slidy.namespace + '-pagination__separator');

      this._total = document.createElement('span');
      this._total.textContent = this._slidy.items.length;
      this._total.classList.add(this._slidy.namespace + '-pagination__total');

      this._el.append(this._current);
      this._el.append(this._separator);
      this._el.append(this._total);
      this._outer.append(this._el);

      this.update();
    }
  }, {
    key: 'bind',
    value: function bind() {
      this._dispatcher.on('beforeSlide', this.update.bind(this));
    }
  }, {
    key: 'update',
    value: function update() {
      this._current.textContent = this._slidy.newIndex + 1;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._el.parentNode.removeChild(this._el);
    }
  }]);

  return Pagination;
}();