/**
 * Slidy main file.
 */


const Emitter = require('tiny-emitter');
const Hammer = require('hammerjs');

import bind from 'lodash/bind';
import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';
import * as detect from './utils/detect';
import { Controls } from './Controls';
import { Nav } from './Nav';
import { Pagination } from './Pagination';
import { Queue } from './Queue';

/**
 * Slidy main class.
 *
 * @export
 * @class Slidy
 */
export class Slidy {
  /**
   * Creates an instance of Slidy.
   * @param   {HTMLElement|string} el             Slider container (element or selector)
   * @param   {Object}             opts           Configuration settings
   * @param   {*}                  [context=null] Optional context, available through `this.context`
   * @param   {Object}             [data=null]    Additional optional data
   * @returns {undefined}
   */
  constructor(el, opts, context = null, data = null) {
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
      queue: 1, // Integer: queue max items
      resize: true, // Boolean: enable resize event and callback
      reverse: false, // Boolean: reverse directions / controls
      swipe: false, // Boolean: enable swipe
      tap: false, // Boolean: enable tap
      touch: false, // Boolean: enable BOTH tap/swipe (deprecated)
      transition: null, // Function: transition which returns a resolved promise
      zerofill: false, // Mixed(Boolean | number): '1' -> '01' for navigation/pagination
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
    this._items = Array.prototype.map.call(this._el.children, item => item); // #TODO use Array.from ?
    this._length = this._items.length;
    this._hasPause = false;

    this._dispatcher = new Emitter();

    // Binding
    this.start = this.start.bind(this);
    this.slideNext = this.slideNext.bind(this);

    // Public events.
    this._dispatcher.on('beforeInit', () => {
      this.beforeInit();
    });
    this._dispatcher.on('afterInit', () => {
      this.afterInit();
    });
    if (this._opts.resize) {
      this._dispatcher.on('afterResize', () => {
        this.afterResize();
      });
    }
    this._dispatcher.on('beforeSlide', (direction, animate) => {
      this.beforeSlide(direction, animate);
    });
    this._dispatcher.on('afterSlide', (direction, animate) => {
      this.afterSlide(direction, animate);
    });

    this.init();
    this.bind();
  }

  /**
   * Getters/setters.
   */
  get outer() {
    return this._outer;
  }

  get el() {
    return this._el;
  }

  get items() {
    return this._items;
  }

  get context() {
    return this._context;
  }

  get data() {
    return this._data;
  }

  get currentIndex() {
    return this._currentIndex;
  }

  set currentIndex(i) {
    this._currentIndex = i;
  }

  get newIndex() {
    return this._newIndex;
  }

  set newIndex(i) {
    this._newIndex = i;
  }

  get oldIndex() {
    return this._oldIndex;
  }

  set oldIndex(i) {
    this._oldIndex = i;
  }

  get options() {
    return this._opts;
  }

  get dispatcher() {
    return this._dispatcher;
  }

  get namespace() {
    return this._opts.namespace;
  }

  /**
   * Init component.
   *
   * @returns {undefined}
   * @memberof Slidy
   */
  init() {
    this._dispatcher.emit('beforeInit');

    // Set height.
    // To get the most 'correct' auto-height,
    // do it before applying anything…
    if (this._opts.height === 'auto') {
      this.reset();
    } else {
      this._el.style.height = `${this._opts.height}px`;
    }

    // Add HTML wrapper.
    this._outer = document.createElement('div');
    this._el.parentNode.insertBefore(this._outer, this._el);
    this._outer.appendChild(this._el);

    // Add CSS classes.
    this._outer.classList.add(`${this.namespace}-outer`);
    this._el.classList.add(this.namespace);
    forEach(this._items, slide => {
      slide.classList.add(`${this.namespace}__item`);
    });

    // Set active class on currentIndex.
    this._items[this._currentIndex].classList.add('is-active');

    // Accessibility
    this._el.setAttribute('role', 'slider');
    this._el.setAttribute('aria-valuemin', 1);
    this._el.setAttribute('aria-valuemax', this._items.length);
    this._el.setAttribute('aria-valuenow', this._currentIndex + 1);

    if (this._opts.click) {
      this._el.style.cursor = 'pointer';
    }

    this._queue = new Queue(this, this._opts.transition);

    // Add controls.
    if (this._opts.controls) {
      this._controls = new Controls(this, {
        loop: this._opts.loop,
        controls: this._opts.controls,
      });
    }

    // Add nav.
    if (this._opts.nav) {
      this._nav = new Nav(this);
    }

    // Add pagination.
    if (this._opts.pagination) {
      this._pagination = new Pagination(this);
    }

    // Start auto mode.
    if (this._opts.auto) {
      this.start();
    }

    this._dispatcher.emit('afterInit');
  }

  /**
   * Bind event handlers.
   *
   * @returns {undefined}
   * @memberof Slidy
   */
  bind() {
    this.onEnter = this.enter.bind(this);
    this.onLeave = this.leave.bind(this);
    this.onClick = this.click.bind(this);
    this.onTap = this.tap.bind(this);
    this.onSwipe = this.swipe.bind(this);

    if (this._opts.resize) {
      this.onResize = bind(debounce(this.resize, this._debounceDelay), this);

      window.addEventListener('resize', this.onResize);
    }

    if (this._opts.pause && this._opts.auto) {
      this._outer.addEventListener('mouseenter', this.onEnter);
      this._hasPause = true;
    }

    if (this._opts.click && !detect.touchevents()) {
      this._el.addEventListener('click', this.onClick);
    }

    if ((this._opts.tap || this._opts.swipe) && detect.touchevents()) {
      const options = {
        recognizers: [],
      };

      this._mc = new Hammer.Manager(this._el, options);
    }

    if (this._opts.tap && detect.touchevents()) {
      const tap = new Hammer.Tap();

      this._mc.add(tap);
      this._mc.on('tap', this.onTap);
    }

    if (this._opts.swipe && detect.touchevents()) {
      const swipe = new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL });

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
   * @param {boolean} force force reverse
   * @returns {undefined}
   * @memberof Slidy
   */
  slidePrev(force = false) {
    if (this._opts.reverse && !force) {
      this.slideNext(true);

      return;
    }

    let newIndex = this._currentIndex - 1;

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
   * @param {boolean} force force reverse
   * @returns {undefined}
   * @memberof Slidy
   */
  slideNext(force = false) {
    if (this._opts.reverse && !force) {
      this.slidePrev(true);

      return;
    }

    let newIndex = this._currentIndex + 1;

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
   * @param {boolean} [animate = true] should use transition ?
   * @returns {undefined}
   * @memberof Slidy
   */
  slideTo(index, animate = true) {
    this.slide('to', index, animate);
  }

  /**
   * Add move to the queue.
   *
   * @param {string} move prev|next|to
   * @param {number} [index=null] slide index
   * @param {boolean} [animate = true] should use tranistion ?
   * @returns {undefined}
   * @memberof Slidy
   */
  slide(move, index = null, animate = true) {
    if (this._opts.auto) {
      clearInterval(this._t1);
      this._t1 = setInterval(this.slideNext, this._opts.interval);
    }

    if (this._queue) {
      this._queue.add(move, index, animate);
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
  reset() {
    if (this._opts.height === 'auto') {
      // Reset inline height.
      this._el.style.height = '';

      // Check if items have height
      // if not, check first node
      // then remove 0 height, sort DESC, get the highest height.
      const getMinHeight = function getMinHeight(arr) {
        return arr
          .filter(item => item > 0)
          .sort((a, b) => b - a)
          .slice(0, 1);
      };

      const heights = [];
      const hasNoHeight = this._items[0].offsetHeight === 0;

      forEach(this._items, item => {
        if (hasNoHeight && item.hasChildNodes()) {
          heights.push(item.firstElementChild.offsetHeight);
        } else {
          heights.push(item.offsetHeight);
        }
      });
      this._el.style.height = `${getMinHeight(heights)}px`;
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
  start(delay = this._opts.interval, auto = this._opts.auto) {
    this._t2 = setTimeout(() => {
      this.slideNext();
      if (!this._hasPause && this._opts.pause) {
        this._outer.addEventListener('mouseenter', this.onEnter);
      }
      if (auto) {
        clearInterval(this._t1);
        this._t1 = setInterval(this.slideNext, this._opts.interval);
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
  stop() {
    if (this._hasPause) {
      this._outer.removeEventListener('mouseenter', this.onEnter);
    }
    clearTimeout(this._t2);
    clearInterval(this._t1);
  }

  /**
   * Destroy component.
   *
   * @returns {undefined}
   * @memberof Slidy
   */
  destroy() {
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
    forEach(this._items, slide => {
      slide.classList.remove(`${this.namespace}__item`);
      slide.removeAttribute('style');
      forEach(slide.children, child => {
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
  resize() {
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
  click() {
    this.slideNext();
  }

  /**
   * Same as click but for touch devices.
   * Enabled via "touch" option.
   *
   * @returns {undefined}
   * @memberof Slidy
   */
  tap() {
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
  swipe(e) {
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
  enter() {
    this._outer.removeEventListener('mouseenter', this.onEnter);
    this.stop();
    this._outer.addEventListener('mouseleave', this.onLeave);
  }

  leave() {
    this._outer.removeEventListener('mouseleave', this.onLeave);
    this.start();
    this._outer.addEventListener('mouseenter', this.onEnter);
  }



  /**
   * Callbacks.
   */

  beforeInit() {
    if (this._opts.beforeInit) {
      this._opts.beforeInit.call(this, this._el);
    }
  }

  afterInit() {
    if (this._opts.afterInit) {
      this._opts.afterInit.call(this, this._el);
    }
  }

  afterResize() {
    if (this._opts.afterResize) {
      this._opts.afterResize.call(this, this._el);
    }
  }

  beforeSlide(direction, animate) {
    if (this._opts.beforeSlide) {
      this._opts.beforeSlide.call(
        this,
        this.currentIndex,
        this.newIndex,
        direction,
        animate
      );
    }
  }

  afterSlide(direction, animate) {
    // Accessibility
    this._el.setAttribute('aria-valuenow', this.currentIndex + 1);

    if (this._opts.afterSlide) {
      this._opts.afterSlide.call(
        this,
        this.currentIndex,
        this.oldIndex,
        direction,
        animate
      );
    }
  }
}
