# Slidy

[Read this](http://shouldiuseacarousel.com/) before doing anything… 😛

> to do: install, example, doc, etc…

## I/O

Create a parent with children:

```html
<ul class="if-you-want"> <!-- or <div> or … -->
  <li><img></li> <!-- or <div> or … -->
  <li>
    <img>
    <div>extra content</div>
  </li>
  …
</ul>
```

then a Slidy instance with some options (including your transition animation):

```js
import { Slidy } from 'epic-slidy';

// new instance with HTMLElement or CSS selector
new Slidy('.if-you-want', {
  controls: true,
  nav: true,
  transition: myAmazingAnimation,
});

const myAmazingAnimation = function myAmazingAnimation(currentSlide, newSlide, direction) {
  /**
   * @param {HTMLElement} currentSlide - current slide (.slidy__item)
   * @param {HTMLElement} newSlide - new slide (.slidy__item)
   * @param {string} direction -  next or prev
   *
   * Do what you want here and return a promise…
   */
}

```

and you will get this:

```html
<div class="slidy-outer">
  <ul class="slidy what-you-want">
    <li class="slidy__item"><img></li>
    <li class="slidy__item">
      <img>
      <div>extra content</div>
    </li>
    …
  </ul>
  <!-- if option controls -->
  <div class="slidy-controls">
    <button class="slidy-controls__item--prev">&lt;</button>
    <button class="slidy-controls__item--next">&gt;</button>
  </div>
  <!-- if option nav -->
  <ol class="slidy-nav">
    <li class="slidy-nav__item is-active">
      <button disabled="true">1</button>
    </li>
    <li class="slidy-nav__item">
      <button>2</button>
    </li>
    …
  </ol>
</div><!-- end .slidy-outer -->
```

-----

## License

MIT © [EPIC team](http://epic.net)
