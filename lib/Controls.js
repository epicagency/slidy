'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controls = exports.Controls = function () {
  function Controls(slidy) {
    _classCallCheck(this, Controls);

    this._slidy = slidy;
    this._outer = this._slidy.outer;

    this._dispatcher = this._slidy.dispatcher;

    this.init();
    this.bind();
  }

  _createClass(Controls, [{
    key: 'init',
    value: function init() {
      this._el = document.createElement('div');
      this._el.classList.add(this._slidy.namespace + '-controls');

      this._prev = document.createElement('button');
      this._prev.textContent = '<';
      this._prev.classList.add(this._slidy.namespace + '-controls__item--prev');

      this._next = document.createElement('button');
      this._next.textContent = '>';
      this._next.classList.add(this._slidy.namespace + '-controls__item--next');

      this._el.append(this._prev);
      this._el.append(this._next);
      this._outer.append(this._el);
    }
  }, {
    key: 'bind',
    value: function bind() {
      this.onPrevClick = this.prevClick.bind(this);
      this.onNextClick = this.nextClick.bind(this);

      this.bindControls();
    }
  }, {
    key: 'bindControls',
    value: function bindControls() {
      this._prev.addEventListener('click', this.onPrevClick);
      this._next.addEventListener('click', this.onNextClick);
    }
  }, {
    key: 'prevClick',
    value: function prevClick() {
      this._slidy.slidePrev();
    }
  }, {
    key: 'nextClick',
    value: function nextClick() {
      this._slidy.slideNext();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._el.parentNode.removeChild(this._el);
    }
  }]);

  return Controls;
}();