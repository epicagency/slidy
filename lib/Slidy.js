'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slidy = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Controls = require('./Controls');

var _Nav = require('./Nav');

var _Queue = require('./Queue');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Slidy main file
 */

/* global Modernizr */

require('./vendor/modernizr-touch');

var Emitter = require('tiny-emitter');
var Hammer = require('hammerjs');
var _bind = require('lodash/bind');
var debounce = require('lodash/debounce');
var forEach = require('lodash/forEach');

var Slidy = exports.Slidy = function () {

  /**
   * Slidy constructor
   * @param  {HTMLElement|string} el - Slider container (element or selector)
   * @param  {Object} opts - Configuration settings
   */
  function Slidy(el, opts) {
    var _this = this;

    _classCallCheck(this, Slidy);

    // Check and get element(s)
    if (typeof el === 'string') {
      el = document.querySelectorAll(el);
    }

    if (!el || el.length === 0) {
      console.error('Slidy: no element matching!');
      return;
    }

    if (el.length > 1) {
      console.warn('Slidy: multiple elements matching!');
    }

    this._el = el[0] || el;

    // Check and get options
    this._opts = Object.assign({
      auto: false, // Boolean: start slider automaticaly
      click: true, // Boolean: enable click on slider
      controls: false, // Boolean: create prev/next buttons
      height: 'auto', // Mixed: integer (px) or 'auto'
      index: 0, // Integer: initial index
      interval: 2000, // Integer: time between 2 transitions
      nav: false, // Boolean: create navigation
      pause: true, // Boolean: pause on hover
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

    this._currentIndex = this._opts.index;
    this._newIndex = this._currentIndex;
    this._oldIndex = this._oldIndex;
    this._items = this._el.children;
    this._length = this._items.length;

    this._dispatcher = new Emitter();
    // Public events
    this._dispatcher.on('beforeInit', function () {
      _this.beforeInit();
    });
    this._dispatcher.on('afterInit', function () {
      _this.afterInit();
    });
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
   * Getters/setters
   */


  _createClass(Slidy, [{
    key: 'init',


    /**
     * Init & binding
     */
    value: function init() {
      this._dispatcher.emit('beforeInit');

      // Add HTML wrapper
      this._outer = document.createElement('div');
      this._el.before(this._outer);
      this._outer.append(this._el);

      // Add CSS classes
      this._outer.classList.add('slidy-outer');
      this._el.classList.add('slidy');
      forEach(this._items, function (slide) {
        slide.classList.add('slidy__item');
      });

      if (this._opts.click) {
        this._el.style.cursor = 'pointer';
      }

      this._queue = new _Queue.Queue(this, this._opts.transition);

      // Add controls
      if (this._opts.controls) {
        this._controls = new _Controls.Controls(this);
      }

      // Add nav
      if (this._opts.nav) {
        this._nav = new _Nav.Nav(this);
      }

      if (this._opts.height !== 'auto') {
        this._el.style.height = this._opts.height + 'px';
      } else {
        this.reset();
      }

      if (this._opts.auto) {
        setTimeout(this.start.bind(this), this._opts.interval);
      }

      this._dispatcher.emit('afterInit');
    }
  }, {
    key: 'bind',
    value: function bind() {
      this.onEnter = this.enter.bind(this);
      this.onLeave = this.leave.bind(this);
      this.onClick = this.click.bind(this);
      this.onTap = this.tap.bind(this);
      this.onSwipe = this.swipe.bind(this);
      this.onResize = _bind(debounce(this.resize, 100), this);

      window.addEventListener('resize', this.onResize);

      if (this._opts.pause && this._opts.auto) {
        this._el.addEventListener('mouseenter', this.onEnter);
      }

      if (this._opts.click && !Modernizr.touchevents) {
        this._el.addEventListener('click', this.onClick);
      }

      if ((this._opts.tap || this._opts.swipe) && Modernizr.touchevents) {
        var options = {
          recognizers: []
        };
        this._mc = new Hammer.Manager(this._el, options);
      }

      if (this._opts.tap && Modernizr.touchevents) {
        var tap = new Hammer.Tap();
        this._mc.add(tap);
        this._mc.on('tap', this.onTap);
      }

      if (this._opts.swipe && Modernizr.touchevents) {
        var swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL });
        this._mc.add(swipe);
        this._mc.on('swipeleft swiperight', this.onSwipe);
      }
    }

    /**
     * API
     */

    /**
     * Previous, next or "byIndex" navigation
     */

  }, {
    key: 'slidePrev',
    value: function slidePrev() {
      var newIndex = this._currentIndex - 1;
      if (newIndex < 0) {
        newIndex = this._length - 1;
      }
      this.slide('prev');
    }
  }, {
    key: 'slideNext',
    value: function slideNext() {
      var newIndex = this._currentIndex + 1;
      if (newIndex === this._length) {
        newIndex = 0;
      }
      this.slide('next');
    }
  }, {
    key: 'slideTo',
    value: function slideTo(index) {
      this.slide('to', index);
    }
  }, {
    key: 'slide',
    value: function slide(move) {
      var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this._queue.add(move, index);
    }

    /**
     * Height calculation if auto.
     * Called on 'init' and 'resize'
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _this2 = this;

      if (this._opts.height === 'auto') {
        (function () {
          // Check if items have height
          // if not, check first node
          // then remove 0 height, sort ASC, get the lowest height
          var getMinHeight = function getMinHeight(arr) {
            return arr.filter(function (item) {
              return item > 0;
            }).sort(function (a, b) {
              return a - b;
            }).slice(0, 1);
          };

          var heights = [];
          var hasNoHeight = _this2._items[0].offsetHeight === 0;
          forEach(_this2._items, function (item) {
            if (hasNoHeight && item.hasChildNodes()) {
              heights.push(item.firstElementChild.offsetHeight);
            } else {
              heights.push(item.offsetHeight);
            }
          });
          _this2._el.style.height = getMinHeight(heights) + 'px';
        })();
      }
    }

    /**
     * Start autoplay
     * Enabled via "auto" and used by "pause" options
     */

  }, {
    key: 'start',
    value: function start() {
      this.slideNext();
      this._t = setInterval(this.slideNext.bind(this), this._opts.interval);
    }

    /**
     * Pause autoplay
     * Used by "pause" options
     */

  }, {
    key: 'stop',
    value: function stop() {
      clearInterval(this._t);
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      // Remove interval
      this.stop();

      // Empty queue
      this._queue.empty();

      // Remove listeners
      window.removeEventListener('resize', this.onResize);
      this._el.removeEventListener('mouseenter', this.onEnter);
      this._el.removeEventListener('mouseleave', this.onLeave);
      this._el.removeEventListener('click', this.onClick);

      // Remove Hammer.manager
      if (this._mc) {
        this._mc.destroy();
      }

      // Remove controls
      if (this._controls) {
        this._controls.destroy();
      }

      // Remove nav
      if (this._nav) {
        this._nav.destroy();
      }

      // Remove HTML wrapper
      this._outer.before(this._el);
      this._outer.parentNode.removeChild(this._outer);

      // Remove CSS classes
      this._el.classList.remove('slidy');
      forEach(this._items, function (slide) {
        slide.classList.remove('slidy__item');
        slide.removeAttribute('style');
        forEach(slide.children, function (child) {
          child.removeAttribute('style');
        });
      });

      this._el.removeAttribute('style');
    }

    /**
     * Events
     */

    /**
     * RWD reset
     * Mainly for height…
     */

  }, {
    key: 'resize',
    value: function resize() {
      this.reset();
    }

    /**
     * Click on slider to go to the next slide
     * Enabled via "click" option,
     */

  }, {
    key: 'click',
    value: function click() {
      this.slideNext();
    }

    /**
     * Same as click but for touch devices
     * Enabled via "touch" option
     */

  }, {
    key: 'tap',
    value: function tap() {
      this.slideNext();
    }

    /**
     * Complement gesture for "tap"
     * Enabled via "touch" option
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
     * Play/pause on hover
     * Enabled via "auto" + "pause" options
     */

  }, {
    key: 'enter',
    value: function enter() {
      this._el.removeEventListener('mouseenter', this.onEnter);
      this.stop();
      this._el.addEventListener('mouseleave', this.onLeave);
    }
  }, {
    key: 'leave',
    value: function leave() {
      this._el.removeEventListener('mouseleave', this.onLeave);
      this.start();
      this._el.addEventListener('mouseenter', this.onEnter);
    }

    /**
     * Callbacks
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
  }]);

  return Slidy;
}();