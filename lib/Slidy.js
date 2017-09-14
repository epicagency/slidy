'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slidy = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _detect = require('./utils/detect');

var detect = _interopRequireWildcard(_detect);

var _Controls = require('./Controls');

var _Nav = require('./Nav');

var _Pagination = require('./Pagination');

var _Queue = require('./Queue');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Slidy main file.
 */

var Emitter = require('tiny-emitter');
var Hammer = require('hammerjs');

/**
 * Slidy main class.
 *
 * @export
 * @class Slidy
 */
var Slidy = exports.Slidy = function () {
  /**
   * Creates an instance of Slidy.
   * @param   {HTMLElement|string} el             Slider container (element or selector)
   * @param   {Object}             opts           Configuration settings
   * @param   {*}                  [context=null] Optional context, available through `this.context`
   * @param   {Object}             [data=null]    Additional optional data
   * @returns {undefined}
   */
  function Slidy(el, opts) {
    var _this = this;

    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, Slidy);

    /* eslint-disable no-param-reassign */
    // Check and get element(s).
    if (typeof el === 'string') {
      el = document.querySelectorAll(el);
    }
    /* eslint-enable no-param-reassign */

    if (!el || el.length === 0) {
      console.error('Slidy: no element matching!');

      return;
    }

    if (el.length > 1) {
      console.warn('Slidy: multiple elements matching!');
    }

    this._el = el[0] || el;

    // Check and get options.
    this._opts = Object.assign({
      auto: false, // Boolean: start slider automaticaly
      click: true, // Boolean: enable click on slider
      controls: false, // Boolean: create prev/next buttons
      debounce: 100, // Integer: debounce delay on resize
      height: 'auto', // Mixed: integer (px) or 'auto'
      index: 0, // Integer: initial index
      interval: 2000, // Integer: time between 2 transitions
      loop: true, // Boolean: enable/disable loop
      namespace: 'slidy', // String: custom namespace
      nav: false, // Mixed: create navigation (number, thumb, custom)
      pagination: false, // Mixed: create pagination (1[separator]10)
      pause: true, // Boolean: pause on hover
      resize: true, // Boolean: enable resize event and callback
      swipe: false, // Boolean: enable swipe
      tap: false, // Boolean: enable tap
      touch: false, // Boolean: enable BOTH tap/swipe (deprecated)
      transition: null
    }, opts);

    if (this._opts.transition === null) {
      console.error('Slidy: you should define a transition!');

      return;
    }

    if (this._opts.touch) {
      this._opts.swipe = true;
      this._opts.tap = true;
    }

    this._context = context;
    this._data = data;

    this._debounceDelay = this._opts.debounce;
    this._currentIndex = this._opts.index;
    this._newIndex = this._currentIndex;
    this._oldIndex = null;
    this._items = this._el.children;
    this._length = this._items.length;
    this._hasPause = false;

    this._dispatcher = new Emitter();

    // Public events.
    this._dispatcher.on('beforeInit', function () {
      _this.beforeInit();
    });
    this._dispatcher.on('afterInit', function () {
      _this.afterInit();
    });
    if (this._opts.resize) {
      this._dispatcher.on('afterResize', function () {
        _this.afterResize();
      });
    }
    this._dispatcher.on('beforeSlide', function (direction) {
      _this.beforeSlide(direction);
    });
    this._dispatcher.on('afterSlide', function (direction) {
      _this.afterSlide(direction);
    });

    this.init();
    this.bind();
  }

  /**
   * Getters/setters.
   */


  _createClass(Slidy, [{
    key: 'init',


    /**
     * Init component.
     *
     * @returns {undefined}
     * @memberof Slidy
     */
    value: function init() {
      var _this2 = this;

      this._dispatcher.emit('beforeInit');

      // Set height.
      // To get the most 'correct' auto-height,
      // do it before applying anything…
      if (this._opts.height === 'auto') {
        this.reset();
      } else {
        this._el.style.height = this._opts.height + 'px';
      }

      // Add HTML wrapper.
      this._outer = document.createElement('div');
      this._el.before(this._outer);
      this._outer.append(this._el);

      // Add CSS classes.
      this._outer.classList.add(this.namespace + '-outer');
      this._el.classList.add(this.namespace);
      (0, _lodash.forEach)(this._items, function (slide) {
        slide.classList.add(_this2.namespace + '__item');
      });

      // Set active class on currentIndex.
      this._items[this._currentIndex].classList.add('is-active');

      if (this._opts.click) {
        this._el.style.cursor = 'pointer';
      }

      this._queue = new _Queue.Queue(this, this._opts.transition);

      // Add controls.
      if (this._opts.controls) {
        this._controls = new _Controls.Controls(this, { loop: this._opts.loop });
      }

      // Add nav.
      if (this._opts.nav) {
        this._nav = new _Nav.Nav(this);
      }

      // Add pagination.
      if (this._opts.pagination) {
        this._pagination = new _Pagination.Pagination(this, this._opts.pagination);
      }

      // Start auto mode.
      if (this._opts.auto) {
        setTimeout(this.start.bind(this), this._opts.interval);
      }

      this._dispatcher.emit('afterInit');
    }

    /**
     * Bind event handlers.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'bind',
    value: function bind() {
      this.onEnter = this.enter.bind(this);
      this.onLeave = this.leave.bind(this);
      this.onClick = this.click.bind(this);
      this.onTap = this.tap.bind(this);
      this.onSwipe = this.swipe.bind(this);

      if (this._opts.resize) {
        this.onResize = (0, _lodash.bind)((0, _lodash.debounce)(this.resize, this._debounceDelay), this);

        window.addEventListener('resize', this.onResize);
      }

      if (this._opts.pause && this._opts.auto) {
        this._outer.addEventListener('mouseenter', this.onEnter);
        this._hasPause = true;
      }

      if (this._opts.click && !detect.touchevents) {
        this._el.addEventListener('click', this.onClick);
      }

      if ((this._opts.tap || this._opts.swipe) && detect.touchevents) {
        var options = {
          recognizers: []
        };

        this._mc = new Hammer.Manager(this._el, options);
      }

      if (this._opts.tap && detect.touchevents) {
        var tap = new Hammer.Tap();

        this._mc.add(tap);
        this._mc.on('tap', this.onTap);
      }

      if (this._opts.swipe && detect.touchevents) {
        var swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL });

        this._mc.add(swipe);
        this._mc.on('swipeleft swiperight', this.onSwipe);
      }
    }

    /**
     * API.
     */

    /**
     * Navigate to previous slide.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'slidePrev',
    value: function slidePrev() {
      var newIndex = this._currentIndex - 1;

      if (newIndex < 0) {
        if (!this._opts.loop) {
          return;
        }
        newIndex = this._length - 1;
      }
      this.slide('prev');
    }

    /**
     * Navigate to next slide.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'slideNext',
    value: function slideNext() {
      var newIndex = this._currentIndex + 1;

      if (newIndex === this._length) {
        if (!this._opts.loop) {
          return;
        }
        newIndex = 0;
      }
      this.slide('next');
    }

    /**
     * Navigate to slide by index.
     *
     * @param {number} index slide index
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'slideTo',
    value: function slideTo(index) {
      this.slide('to', index);
    }

    /**
     * Add move to the queue.
     *
     * @param {string} move prev|next|to
     * @param {number} [index=null] slide index
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'slide',
    value: function slide(move) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this._queue) {
        this._queue.add(move, index);
      } else {
        // Prevent 'persistent' auto
        this.stop();
      }
    }

    /**
     * Height calculation if auto.
     * Called on 'init' and 'resize'.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'reset',
    value: function reset() {
      if (this._opts.height === 'auto') {
        // Reset inline height.
        this._el.style.height = '';

        // Check if items have height
        // if not, check first node
        // then remove 0 height, sort DESC, get the highest height.
        var getMinHeight = function getMinHeight(arr) {
          return arr.filter(function (item) {
            return item > 0;
          }).sort(function (a, b) {
            return b - a;
          }).slice(0, 1);
        };

        var heights = [];
        var hasNoHeight = this._items[0].offsetHeight === 0;

        (0, _lodash.forEach)(this._items, function (item) {
          if (hasNoHeight && item.hasChildNodes()) {
            heights.push(item.firstElementChild.offsetHeight);
          } else {
            heights.push(item.offsetHeight);
          }
        });
        this._el.style.height = getMinHeight(heights) + 'px';
      }
    }

    /**
     * Start autoplay.
     * Enabled via "auto" and used by "pause" options.
     *
     * @param {number} delay delay before slideNext
     * @param {boolean} auto autoloop or not
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this._opts.interval;
      var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this._opts.auto;

      setTimeout(function () {
        _this3.slideNext();
        if (!_this3._hasPause && _this3._opts.pause) {
          _this3._outer.addEventListener('mouseenter', _this3.onEnter);
        }
        if (auto) {
          _this3._t = setInterval(_this3.slideNext.bind(_this3), _this3._opts.interval);
        }
      }, delay);
    }

    /**
     * Pause autoplay.
     * Used by "pause" options.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'stop',
    value: function stop() {
      if (this._hasPause) {
        this._outer.removeEventListener('mouseenter', this.onEnter);
      }
      clearInterval(this._t);
    }

    /**
     * Destroy component.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      var _this4 = this;

      this._destroyed = true;

      // Remove interval.
      this.stop();

      // Empty queue.
      if (this._queue) {
        this._queue.empty();
        delete this._queue;
      }

      // Remove listeners.
      if (this._opts.resize) {
        window.removeEventListener('resize', this.onResize);
      }
      this._el.removeEventListener('mouseenter', this.onEnter);
      this._el.removeEventListener('mouseleave', this.onLeave);
      this._el.removeEventListener('click', this.onClick);

      // Remove Hammer.manager.
      if (this._mc) {
        this._mc.destroy();
        delete this._mc;
      }

      // Remove controls.
      if (this._controls) {
        this._controls.destroy();
        delete this._controls;
      }

      // Remove nav.
      if (this._nav) {
        this._nav.destroy();
        delete this._nav;
      }

      // Remove pagination.
      if (this._pagination) {
        this._pagination.destroy();
        delete this._pagination;
      }

      // Remove HTML wrapper.
      this._outer.before(this._el);
      if (this._outer.parentNode) {
        this._outer.parentNode.removeChild(this._outer);
      }

      // Remove CSS classes.
      this._el.classList.remove(this.namespace);
      (0, _lodash.forEach)(this._items, function (slide) {
        slide.classList.remove(_this4.namespace + '__item');
        slide.removeAttribute('style');
        (0, _lodash.forEach)(slide.children, function (child) {
          child.removeAttribute('style');
        });
      });

      this._el.removeAttribute('style');
    }

    /**
     * Events.
     */

    /**
     * RWD reset.
     * Mainly for height…
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'resize',
    value: function resize() {
      if (!this._destroyed) {
        this.reset();
        this._dispatcher.emit('afterResize');
      }
    }

    /**
     * Click on slider to go to the next slide.
     * Enabled via "click" option.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'click',
    value: function click() {
      this.slideNext();
    }

    /**
     * Same as click but for touch devices.
     * Enabled via "touch" option.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'tap',
    value: function tap() {
      this.slideNext();
    }

    /**
     * Complement gesture for "tap".
     * Enabled via "touch" option.
     *
     * @param {TouchEvent} e touch event
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'swipe',
    value: function swipe(e) {
      if (e.direction === Hammer.DIRECTION_LEFT) {
        this.slideNext();
      }
      if (e.direction === Hammer.DIRECTION_RIGHT) {
        this.slidePrev();
      }
    }

    /**
     * Play/pause on hover.
     * Enabled via "auto" + "pause" options.
     *
     * @returns {undefined}
     * @memberof Slidy
     */

  }, {
    key: 'enter',
    value: function enter() {
      this._outer.removeEventListener('mouseenter', this.onEnter);
      this.stop();
      this._outer.addEventListener('mouseleave', this.onLeave);
    }
  }, {
    key: 'leave',
    value: function leave() {
      this._outer.removeEventListener('mouseleave', this.onLeave);
      this.start();
      this._outer.addEventListener('mouseenter', this.onEnter);
    }

    /**
     * Callbacks.
     */

  }, {
    key: 'beforeInit',
    value: function beforeInit() {
      if (this._opts.beforeInit) {
        this._opts.beforeInit.call(this, this._el);
      }
    }
  }, {
    key: 'afterInit',
    value: function afterInit() {
      if (this._opts.afterInit) {
        this._opts.afterInit.call(this, this._el);
      }
    }
  }, {
    key: 'afterResize',
    value: function afterResize() {
      if (this._opts.afterResize) {
        this._opts.afterResize.call(this, this._el);
      }
    }
  }, {
    key: 'beforeSlide',
    value: function beforeSlide(direction) {
      if (this._opts.beforeSlide) {
        this._opts.beforeSlide.call(this, this.currentIndex, this.newIndex, direction);
      }
    }
  }, {
    key: 'afterSlide',
    value: function afterSlide(direction) {
      if (this._opts.afterSlide) {
        this._opts.afterSlide.call(this, this.currentIndex, this.oldIndex, direction);
      }
    }
  }, {
    key: 'outer',
    get: function get() {
      return this._outer;
    }
  }, {
    key: 'el',
    get: function get() {
      return this._el;
    }
  }, {
    key: 'items',
    get: function get() {
      return this._items;
    }
  }, {
    key: 'context',
    get: function get() {
      return this._context;
    }
  }, {
    key: 'data',
    get: function get() {
      return this._data;
    }
  }, {
    key: 'currentIndex',
    get: function get() {
      return this._currentIndex;
    },
    set: function set(i) {
      this._currentIndex = i;
    }
  }, {
    key: 'newIndex',
    get: function get() {
      return this._newIndex;
    },
    set: function set(i) {
      this._newIndex = i;
    }
  }, {
    key: 'oldIndex',
    get: function get() {
      return this._oldIndex;
    },
    set: function set(i) {
      this._oldIndex = i;
    }
  }, {
    key: 'options',
    get: function get() {
      return this._opts;
    }
  }, {
    key: 'dispatcher',
    get: function get() {
      return this._dispatcher;
    }
  }, {
    key: 'namespace',
    get: function get() {
      return this._opts.namespace;
    }
  }]);

  return Slidy;
}();