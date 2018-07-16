'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Create controls.
*
* @export
* @class Controls
*/
var Controls = exports.Controls = function () {
  /**
   * Creates an instance of Controls.
   * @param {Slidy}  slidy slidy instance
   * @param {Object} opts  options
   * @memberof Controls
   */
  function Controls(slidy, opts) {
    _classCallCheck(this, Controls);

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


  _createClass(Controls, [{
    key: 'init',
    value: function init() {
      this._el = document.createElement('div');
      this._el.classList.add(this._slidy.namespace + '-controls');

      this._prev = document.createElement('button');
      this._prev.setAttribute('type', 'button');
      this._prev.textContent = '<';
      this._prev.classList.add(this._slidy.namespace + '-controls__item--prev');

      this._next = document.createElement('button');
      this._next.setAttribute('type', 'button');
      this._next.textContent = '>';
      this._next.classList.add(this._slidy.namespace + '-controls__item--next');

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

  }, {
    key: 'bind',
    value: function bind() {
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

  }, {
    key: 'bindControls',
    value: function bindControls() {
      this._prev.addEventListener('click', this.onPrevClick);
      this._next.addEventListener('click', this.onNextClick);
    }

    /**
     * On prev click.
     *
     * @returns {undefined}
     * @memberof Controls
     */

  }, {
    key: 'prevClick',
    value: function prevClick() {
      this._slidy.slidePrev();
    }

    /**
     * On next click.
     *
     * @returns {undefined}
     * @memberof Controls
     */

  }, {
    key: 'nextClick',
    value: function nextClick() {
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

  }, {
    key: 'update',


    /**
     * Update controls.
     *
     * @returns {undefined}
     * @memberof Controls
     */
    value: function update() {
      if (!this._opts.loop) {
        var newIndex = this._slidy.newIndex;
        var length = this._slidy.items.length;


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

  }, {
    key: 'destroy',
    value: function destroy() {
      this._el.parentNode.removeChild(this._el);
    }
  }], [{
    key: 'disable',
    value: function disable(el) {
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

  }, {
    key: 'enable',
    value: function enable(el) {
      el.removeAttribute('disabled');
      el.classList.remove('is-disabled');
    }
  }]);

  return Controls;
}();