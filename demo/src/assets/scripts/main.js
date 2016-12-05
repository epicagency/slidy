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
      transition: this.sliderTransition,
      beforeInit: this.sliderBeforeInit,
      afterInit: this.sliderAfterInit,
      // auto: true,
      // pause: true,
      touch: true,
      controls: true,
      nav: true,
    });

    document.getElementById('destroy').addEventListener('click', () => {
      slider.destroy();
    });

    // More testing/demo
    // new Slidy('.foo');
    // new Slidy('.sliders');
    // new Slidy(document.querySelector('.foo'));
    // new Slidy(document.querySelector('.slider'));
    // new Slidy(document.querySelector('.sliders'));
    // new Slidy(document.querySelectorAll('.foo'));
    // new Slidy(document.querySelectorAll('.slider'));
    // new Slidy(document.querySelectorAll('.sliders'));

  }

  sliderBeforeInit(slider) {
    console.info('sliderBeforeInit', slider);
  }

  sliderAfterInit(slider) {
    console.info('sliderAfterInit', slider);
  }

  sliderTransition(currentSlide, newSlide, direction) {
    return new Promise((resolve) => {
      let duration = 1;
      let width = document.querySelector('.slider').offsetWidth;
      let height = document.querySelector('.slider').offsetHeight;
      let to = (direction === 'next') ? -width : width;
      let from = (direction === 'next') ? width : -width;

      let currentContent = currentSlide.querySelector('.slider__slide__content');
      let newContent = newSlide.querySelector('.slider__slide__content');

      let tl = new TimelineLite({
        paused: true,
        onComplete: resolve,
      });
      tl.add('start');
      if (direction === 'next') {
        tl.set(currentSlide, { x: 0, y: 0 });
        tl.set(newSlide, { x: from, y: 0 });
        tl.set(newContent, { y: 50, autoAlpha: 0 });
        tl.to(currentContent, duration * .4, { y: 50, autoAlpha: 0, ease: Back.easeIn }, 'start');
        // tl.add('slide');
        tl.to(currentSlide, duration * .8, { x: to, ease: Power4.easeInOut }, 'start+=.1');
        tl.to(newSlide, duration * .8, { x: 0, ease: Power4.easeInOut }, 'start+=.1');
        tl.to(newContent, duration * .4, { y: 0, autoAlpha: 1, ease: Back.easeOut }, '-=.3');
      } else {
        tl.set(currentSlide, { x: 0, y: 0 });
        tl.set(newSlide, { x: 0, y: height });
        tl.set(newContent, { y: 50, autoAlpha: 0 });
        tl.to(currentContent, duration * .4, { y: 50, autoAlpha: 0, ease: Back.easeIn }, 'start');
        // tl.add('slide');
        tl.to(currentSlide, duration * .8, { y: -height, ease: Power4.easeInOut }, 'start+=.1');
        tl.to(newSlide, duration * .8, { y: 0, ease: Power4.easeInOut }, 'start+=.1');
        tl.to(newContent, duration * .4, { y: 0, autoAlpha: 1, ease: Back.easeOut }, '-=.3');
      }
      tl.play();
    });
  }
}

new Epic();
