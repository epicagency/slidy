'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var forEach = require('lodash/forEach');
var indexOf = require('lodash/indexOf');

var Nav = exports.Nav = function () {
  function Nav(slidy) {
    _classCallCheck(this, Nav);

    this._slidy = slidy;
    this._outer = this._slidy.outer;
    this._slides = this._slidy.items;

    this._dispatcher = this._slidy.dispatcher;
    this._dispatcher.on('beforeSlide', this.clearActive.bind(this));
    this._dispatcher.on('beforeSlide', this.setActive.bind(this));

    this.init();
    this.bind();
  }

  _createClass(Nav, [{
    key: 'init',
    value: function init() {
      this._el = document.createElement('ol');
      this._el.classList.add('slidy-nav');

      var html = '';
      forEach(this._slides, function (slide, i) {
        // Override 1, 2, 3,… if data-slidy-nav attribute
        var content = 'slidyNav' in slide.dataset ? slide.dataset.slidyNav : i + 1;
        html += '<li class="slidy-nav__item"><button>' + content + '</button></li>';
      });

      this._el.innerHTML = html;
      this._outer.append(this._el);
      this._items = this._el.querySelectorAll('li');

      this.setActive();
    }
  }, {
    key: 'bind',
    value: function bind() {
      this.onClick = this.click.bind(this);
      this.bindNav();
    }
  }, {
    key: 'clearActive',
    value: function clearActive() {
      var currentItem = this._el.querySelector('.is-active');
      if (currentItem) {
        currentItem.classList.remove('is-active');
        currentItem.querySelector('button').removeAttribute('disabled');
      }
    }
  }, {
    key: 'setActive',
    value: function setActive() {
      var newItem = this._items[this._slidy.newIndex];
      newItem.classList.add('is-active');
      newItem.querySelector('button').setAttribute('disabled', true);
    }
  }, {
    key: 'bindNav',
    value: function bindNav() {
      this._el.addEventListener('click', this.onClick);
    }
  }, {
    key: 'click',
    value: function click(e) {
      var clicked = e.target;
      if (clicked.nodeName === 'BUTTON') {
        var newIndex = indexOf(this._el.children, clicked.parentNode);
        this._slidy.slideTo(newIndex);
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this._el.parentNode.removeChild(this._el);
    }
  }]);

  return Nav;
}();