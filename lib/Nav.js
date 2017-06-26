'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Nav = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _parseEs6Template = require('./utils/parse-es6-template');

var _parseEs6Template2 = _interopRequireDefault(_parseEs6Template);

var _$ = require('./utils/$');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var forEach = require('lodash/forEach');
var indexOf = require('lodash/indexOf');

var Nav = exports.Nav = function () {
  function Nav(slidy) {
    _classCallCheck(this, Nav);

    this._slidy = slidy;
    this._outer = slidy.outer;
    this._slides = slidy.items;

    var type = slidy.options.nav;

    if (/\${(number|thumb)}/.test(type)) {
      this._type = 'template';
      this._template = type;
    } else if (type === 'thumb') {
      this._type = 'thumb';
    } else if (type === 'number' || type === true) {
      this._type = 'number';
    } else {
      console.error('Slidy: wrong value for "nav" option');
      return;
    }

    this._dispatcher = this._slidy.dispatcher;
    this._dispatcher.on('beforeSlide', this.clearActive.bind(this));
    this._dispatcher.on('beforeSlide', this.setActive.bind(this));

    this.init();
    this.bind();
  }

  _createClass(Nav, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this._el = document.createElement('ol');
      this._el.classList.add(this._slidy.namespace + '-nav');

      var html = '';
      forEach(this._slides, function (slide, i) {
        var content = void 0;

        if ('slidyNav' in slide.dataset) {
          // Overrided content if data-slidy-nav attribute
          // data-slidy-nav value will replace ${number} and ${thumb}
          if (_this._type === 'template') {
            content = (0, _parseEs6Template2.default)(_this._template, {
              number: slide.dataset.slidyNav,
              thumb: slide.dataset.slidyNav
            });
          } else {
            content = '<button>\n            <span>\n              ' + slide.dataset.slidyNav + '\n            </span>\n          </button>';
          }
        } else {
          var number = void 0;
          var thumb = void 0;

          // Check for template, thumb or number…
          var dataTpl = {};
          switch (_this._type) {
            case 'template':

              // We can have both number and thumb into the template string
              // or nothing…
              if (/\${number}/.test(_this._template)) {
                dataTpl.number = i + 1;
              }

              if (/\${thumb}/.test(_this._template)) {
                dataTpl.thumb = _this.createThumb(slide);
              }

              content = (0, _parseEs6Template2.default)(_this._template, dataTpl);
              break;

            case 'thumb':
              thumb = _this.createThumb(slide);
              content = '<button>\n              <span>\n                ' + thumb + '\n              </span>\n            </button>';
              break;

            case 'number':
            default:
              number = i + 1;
              content = '<button>\n              <span>\n                ' + number + '\n              </span>\n            </button>';
              break;
          }
        }

        html += '<li class="' + _this._slidy.namespace + '-nav__item">' + content + '</li>';
      });

      this._el.innerHTML = html;
      this._outer.append(this._el);
      this._items = this._el.querySelectorAll('li');

      this.setActive();
    }
  }, {
    key: 'createThumb',
    value: function createThumb(slide) {
      var src = slide.querySelector('img').getAttribute('src');
      var thumb = src.replace(/(.*)(\.\w{3,4}$)/, '$1_thumb$2');
      return '<img src="' + thumb + '">';
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
        var button = currentItem.querySelector('button');
        if (button) {
          button.disabled = false;
        }
      }
    }
  }, {
    key: 'setActive',
    value: function setActive() {
      var newItem = this._items[this._slidy.newIndex];
      newItem.classList.add('is-active');
      var button = newItem.querySelector('button');
      if (button) {
        button.disabled = true;
      }
    }
  }, {
    key: 'bindNav',
    value: function bindNav() {
      this._el.addEventListener('click', this.onClick);
    }
  }, {
    key: 'click',
    value: function click(e) {
      var clicked = (0, _$.parents)(e.target, this._slidy.namespace + '-nav__item');
      if (clicked !== null) {
        var newIndex = indexOf(this._el.children, clicked);
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