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
    this.domReady.then(this.init.bind(this));
  }

  get domReady() {
    return new Promise(function(resolve) {
      document.addEventListener('DOMContentLoaded', resolve);
    });
  }

  init() {
    let slider = new Slidy('.slider', {
      transition: this.simpleTransition,
      beforeInit: this.sliderBeforeInit,
      afterInit: this.sliderAfterInit,
      beforeSlide: this.sliderBeforeSlide,
      afterSlide: this.sliderAfterSlide,
      // auto: true,
      // pause: true,
      touch: true,
      controls: true,
      nav: true,
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

  sliderBeforeSlide(currentIndex, newIndex) {
    console.info('sliderBeforeSlider');
    this.items[newIndex].classList.add('is-next');
  }

  sliderAfterSlide(currentIndex, oldIndex) {
    console.info('sliderAfterSlide');
    this.items[oldIndex].classList.remove('is-current');
    this.items[currentIndex].classList.remove('is-next');
    this.items[currentIndex].classList.add('is-current');
  }

  simpleTransition(currentSlide, newSlide) {
    console.log('simpleTransition');
    return new Promise((resolve) => {
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
    return new Promise((resolve) => {
      const duration = 1;
      const width = document.querySelector('.slider').offsetWidth;
      const height = document.querySelector('.slider').offsetHeight;
      const to = (direction === 'next') ? -width : width;
      const from = (direction === 'next') ? width : -width;

      const currentContent = currentSlide.querySelector('.slider__slide__content');
      const newContent = newSlide.querySelector('.slider__slide__content');

      const tl = new TimelineLite({
        paused: true,
        onComplete: resolve,
      });
      tl.add('start');
      tl.set(currentSlide, { x: 0, y: 0 });

      if (direction === 'next') {
        tl.set(newSlide, { x: from, y: 0 });
      } else {
        tl.set(newSlide, { x: 0, y: height });
      }

      tl.set(newContent, { y: 50, autoAlpha: 0 });
      tl.to(currentContent, duration * .4, { y: 50, autoAlpha: 0, ease: Back.easeIn }, 'start');

      if (direction === 'next') {
        tl.set(newSlide, { x: from, y: 0 });
        tl.to(currentSlide, duration * .8, { x: to, ease: Power4.easeInOut }, 'start+=.1');
        tl.to(newSlide, duration * .8, { x: 0, ease: Power4.easeInOut }, 'start+=.1');
      } else {
        tl.set(newSlide, { x: 0, y: height });
        tl.to(currentSlide, duration * .8, { y: -height, ease: Power4.easeInOut }, 'start+=.1');
        tl.to(newSlide, duration * .8, { y: 0, ease: Power4.easeInOut }, 'start+=.1');
      }

      tl.to(newContent, duration * .4, { y: 0, autoAlpha: 1, ease: Back.easeOut }, '-=.3');
      tl.play();
    });
  }
}

new Epic();
