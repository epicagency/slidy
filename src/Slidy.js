/**
 * Slidy main file
 */

/* global Modernizr */

require('./vendor/modernizr-touch');

const Emitter = require('tiny-emitter');
const Hammer = require('hammerjs');
const forEach = require('lodash/forEach');
const debounce = require('lodash/debounce');

import { Controls } from './Controls';
import { Nav } from './Nav';
import { Queue } from './Queue';

export class Slidy {

  /**
   * Slidy constructor
   * @param  {HTMLElement|string} el - Slider container (element or selector)
   * @param  {Object} opts - Configuration settings
   */
  constructor(el, opts) {
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

    this._el = el[0];

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
      touch: true, // Boolean: enable tap/swipe
      transition: null,
    }, opts);

    if (this._opts.transition === null) {
      console.error('Slidy: you should define a transition!');
      return;
    }

    this._currentIndex = this._opts.index;
    this._newIndex = this._currentIndex;
    this._oldIndex = this._oldIndex;
    this._items = this._el.children;
    this._length = this._items.length;

    this._dispatcher = new Emitter();
    // Public events
    this._dispatcher.on('beforeInit', this.beforeInit.bind(this));
    this._dispatcher.on('afterInit', this.afterInit.bind(this));
    this._dispatcher.on('beforeSlide', this.beforeSlide.bind(this));
    this._dispatcher.on('afterSlide', this.afterSlide.bind(this));

    this.init();
    this.bind();
  }



  /**
   * Getters/setters
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

  get dispatcher() {
    return this._dispatcher;
  }



  /**
   * Init & binding
   */
  init() {
    this._dispatcher.emit('beforeInit');

    // Add HTML wrapper
    this._outer = document.createElement('div');
    this._el.before(this._outer);
    this._outer.append(this._el);

    // Add CSS classes
    this._outer.classList.add('slidy-outer');
    this._el.classList.add('slidy');
    forEach(this._items, (slide) => {
      slide.classList.add('slidy__item');
    });

    if (this._opts.click) {
      this._el.style.cursor = 'pointer';
    }

    this._queue = new Queue(this, this._opts.transition);

    // Add controls
    if (this._opts.controls) {
      this._controls = new Controls(this);
    }

    // Add nav
    if (this._opts.nav) {
      this._nav = new Nav(this);
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

  bind() {
    this.onEnter = this.enter.bind(this);
    this.onLeave = this.leave.bind(this);
    this.onClick = this.click.bind(this);
    this.onTap = this.tap.bind(this);
    this.onSwipe = this.swipe.bind(this);
    this.onResize = this.resize.bind(this);

    window.addEventListener('resize', debounce(this.onResize, 100));

    if (this._opts.pause && this._opts.auto) {
      this._el.addEventListener('mouseenter', this.onEnter);
    }

    if (this._opts.click && !Modernizr.touchevents) {
      this._el.addEventListener('click', this.onClick);
    }

    if (this._opts.touch && Modernizr.touchevents) {
      this._mc = new Hammer.Manager(this._el);
      let tap = new Hammer.Tap();
      this._mc.add(tap);
      this._mc.on('tap', this.onTap);

      let swipe = new Hammer.Swipe();
      this._mc.add(swipe);
      this._mc.on('swipe', this.onSwipe);
    }
  }



  /**
   * API
   */

  /**
   * Pevious, next or "byIndex" navigation
   */
  slidePrev() {
    let newIndex = this._currentIndex - 1;
    if (newIndex < 0) {
      newIndex = this._length - 1;
    }
    this.slide('prev');
  }

  slideNext() {
    let newIndex = this._currentIndex + 1;
    if (newIndex === this._length) {
      newIndex = 0;
    }
    this.slide('next');
  }

  slideTo(index) {
    this.slide('to', index);
  }

  slide(move, index = null) {
    this._queue.add(move, index);
  }

  /**
   * Height calculation if auto.
   * Called on 'init' and 'resize'
   */
  reset() {
    if (this._opts.height === 'auto') {
      this._el.style.height = this._items[0].offsetHeight + 'px';
    }
  }

  /**
   * Start autoplay
   * Enabled via "auto" and used by "pause" options
   */
  start() {
    this.slideNext();
    this._t = setInterval(this.slideNext.bind(this), this._opts.interval);
  }

  /**
   * Pause autoplay
   * Used by "pause" options
   */
  stop() {
    clearInterval(this._t);
  }



  /**
   * Events
   */

  /**
   * RWD reset
   * Mainly for height…
   */
  resize() {
    this.reset();
  }

  /**
   * Click on slider to go to the next slide
   * Enabled via "click" option,
   */
  click() {
    this.slideNext();
  }

  /**
   * Same as click but for touch devices
   * Enabled via "touch" option
   */
  tap() {
    this.slideNext();
  }

  /**
   * Complement gesture for "tap"
   * Enabled via "touch" option
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
   * Play/pause on hover
   * Enabled via "auto" + "pause" options
   */
  enter() {
    this._el.removeEventListener('mouseenter', this.onEnter);
    this.stop();
    this._el.addEventListener('mouseleave', this.onLeave);
  }

  leave() {
    this._el.removeEventListener('mouseleave', this.onLeave);
    this.start();
    this._el.addEventListener('mouseenter', this.onEnter);
  }



  /**
   * Callbacks
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

  beforeSlide() {
    if (this._opts.beforeSlide) {
      this._opts.beforeSlide.call(this, this.currentIndex, this.newIndex);
    }
  }

  afterSlide() {
    if (this._opts.afterSlide) {
      this._opts.afterSlide.call(this, this.currentIndex, this.oldIndex);
    }
  }

  destroy() {
    // Remove listeners
    this._el.removeEventListener('mouseenter', this.onEnter);
    this._el.removeEventListener('mouseleave', this.onLeave);
    this._el.removeEventListener('click', this.onClick);
    this._mc.destroy();

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
    forEach(this._items, (slide) => {
      slide.classList.remove('slidy__item');
      slide.removeAttribute('style');
      forEach(slide.children, (child) => {
        child.removeAttribute('style');
      });
    });

    this._el.removeAttribute('style');
  }
}
