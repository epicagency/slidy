# Slidy

[![Greenkeeper badge](https://badges.greenkeeper.io/epicagency/slidy.svg)](https://greenkeeper.io/)

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

## Config / options

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| auto | Boolean | false | Auto-start |
| click | Boolean | true | Enable next slide on click |
| controls | Boolean | false | Next / prev buttons |
| height | 'auto' or [integer] | 'auto' | Auto or pixel height |
| index | [integer] | 0 | Initial index |
| interval | [integer] | 2000 | Time (ms) betweeen 2 transitions |
| loop | Boolean | true | loop … or not |
| namespace | String | 'slidy' | CSS custom [class]namespace |
| nav | Boolean, 'number', 'thumb' or 'template string' | false | Display a navigation with numbers / thumbs within custom template (see examples) |
| queue | [integer] | 1 | Queue max items |
| pagination | Boolean, 'separator string' | false | Display a pagination |
| pause | Boolean | true | Pause on hover |
| swipe | Boolean | false | Enable horizontal swipe |
| tap | Boolean | false | Enable next slide on tap |
| touch | Boolean | false | Enable BOTH tap/swipe (deprecated) |
| transition | Function | null | Animation function which returns a promise |
| zerofill | Boolean, [integer] | false | 'Zerofill' (1 -> 01) numbers for both nav or pagination |

### nav details

* `nav: false` -> no navigation
* `nav: true` -> navigation with numbers (1, 2, 3, …)
* `nav: 'number'` -> same as `true`
* `nav: 'thumb'` -> navigation with thumbs ([image-name]_thumb.ext)
* `nav: '<div>${number}</div>'` -> custom "number" navigation
* `nav: '<div>${thumb}</div>'` -> custom "thumb" navigation

> If slide elements have a `data-slidy-nav` attribute, this will override "number" or "thumb" content…

-----

## License

MIT © [EPIC team](http://epic.net)
