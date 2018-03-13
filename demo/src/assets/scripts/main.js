/* eslint-disable no-magic-numbers, class-methods-use-this */
/*
 * This is the main entry point for the JS.
 *
 * Folder are separated in this way:
 * - shared: utilities / helpers / generic parts used throught the app.
 * - vendor: thirdy part libraries
 * - view: main folder for site specific scripts
 * - view/shared: shared visual stuff
 * - view/XXXX: single page / section
 */

/* global TimelineLite, Power4, Back */

require('gsap');

import { Slidy } from '../../../../lib/Slidy';

/*
 * Epic Class
 */
class Epic {
  constructor() {
    Epic.domReady().then(this.init.bind(this));
  }

  static domReady() {
    return new Promise(resolve => {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  init() {
    const slider = new Slidy('.slider', {
      transition: this.advancedTransition2,
      beforeInit: this.sliderBeforeInit,
      afterInit: this.sliderAfterInit,
      afterResize: this.sliderAfterResize,
      beforeSlide: this.sliderBeforeSlide,
      afterSlide: this.sliderAfterSlide,
      auto: false,
      // !DEV
      // pause: true,
      click: false,
      loop: false,
      namespace: 'my-slidy',
      pagination: '-',
      queue: 5,
      tap: true,
      swipe: true,
      controls: true,
      // eslint-disable-next-line no-template-curly-in-string
      // nav: '<div class="foo"><button>${thumb}</button></div>',
      nav: true,
      zerofill: 4,
    });

    document.getElementById('destroy').addEventListener('click', () => {
      slider.destroy();
    });
  }

  sliderBeforeInit(slider) {
    console.info('sliderBeforeInit', slider);
  }

  sliderAfterInit(slider) {
    console.info('sliderAfterInit', slider);
  }

  sliderAfterResize(slider) {
    console.info('sliderAfterResize', slider);
  }

  sliderBeforeSlide(currentIndex, newIndex, direction) {
    console.info('sliderBeforeSlider', direction);
    this.items[newIndex].classList.add('is-next');
  }

  sliderAfterSlide(currentIndex, oldIndex, direction) {
    console.info('sliderAfterSlide', direction);
    this.items[oldIndex].classList.remove('is-current');
    this.items[currentIndex].classList.remove('is-next');
    this.items[currentIndex].classList.add('is-current');
  }

  simpleTransition(currentSlide, newSlide) {
    console.log('simpleTransition');

    return new Promise(resolve => {
      const duration = 2;
      const tl = new TimelineLite({
        paused: true,
        onComplete: resolve,
      });

      tl.to(newSlide, duration, { opacity: 1 });
      tl.set(currentSlide, { opacity: 0 });
      tl.play();
    });
  }

  advancedTransition(currentSlide, newSlide, direction) {
    return new Promise(resolve => {
      const duration = 1;
      const width = document.querySelector('.slider').offsetWidth;
      const height = document.querySelector('.slider').offsetHeight;
      const to = direction === 'next' ? -width : width;
      const from = direction === 'next' ? width : -width;

      const currentContent = currentSlide.querySelector('.slider__slide__content');
      const newContent = newSlide.querySelector('.slider__slide__content');

      const tl = new TimelineLite({
        paused: true,
        onComplete: resolve,
      });

      tl.add('start');
      tl.set(currentSlide, {
        x: 0,
        y: 0,
      });

      if (direction === 'next') {
        tl.set(newSlide, {
          x: from,
          y: 0,
        });
      } else {
        tl.set(newSlide, {
          x: 0,
          y: height,
        });
      }

      tl.set(newContent, {
        y: 50,
        autoAlpha: 0,
      });
      tl.to(currentContent, duration * 0.4, {
        y: 50,
        autoAlpha: 0,
        ease: Back.easeIn,
      }, 'start');

      if (direction === 'next') {
        tl.to(currentSlide, duration * 0.8, {
          x: to,
          ease: Power4.easeInOut,
        }, 'start+=.1');
        tl.to(newSlide, duration * 0.8, {
          x: 0,
          ease: Power4.easeInOut,
        }, 'start+=.1');
      } else {
        tl.to(currentSlide, duration * 0.8, {
          y: -height,
          ease: Power4.easeInOut,
        }, 'start+=.1');
        tl.to(newSlide, duration * 0.8, {
          y: 0,
          ease: Power4.easeInOut,
        }, 'start+=.1');
      }

      tl.to(newContent, duration * 0.4, {
        y: 0,
        autoAlpha: 1,
        ease: Back.easeOut,
      }, '-=.3');
      tl.play();
    });
  }

  advancedTransition2(currentSlide, newSlide, direction) {
    return new Promise(resolve => {
      const duration = 1;
      const width = document.querySelector('.slider').offsetWidth;
      const to = direction === 'next' ? -width : width;
      const from = direction === 'next' ? width : -width;

      const currentContent = currentSlide.querySelector('.slider__slide__content');
      const newContent = newSlide.querySelector('.slider__slide__content');

      const tl = new TimelineLite({
        paused: true,
        onComplete: resolve,
      });

      tl.add('start');
      tl.set(currentSlide, { x: 0 });
      tl.set(newSlide, { x: from });
      tl.set(newContent, {
        y: 50,
        autoAlpha: 0,
      });
      tl.to(currentContent, duration * 0.4, {
        y: 50,
        autoAlpha: 0,
        ease: Back.easeIn,
      }, 'start');
      tl.to(currentSlide, duration * 0.8, {
        x: to,
        ease: Power4.easeInOut,
      }, 'start+=.1');
      tl.to(newSlide, duration * 0.8, {
        x: 0,
        ease: Power4.easeInOut,
      }, 'start+=.1');
      tl.to(newContent, duration * 0.4, {
        y: 0,
        autoAlpha: 1,
        ease: Back.easeOut,
      }, '-=.3');
      tl.play();
    });
  }
}

new Epic(); // eslint-disable-line no-new
