# Slidy

[Read this](http://shouldiuseacarousel.com/) before doing anything… 😛

> to do: install, example, doc, etc…

## I/O

Create a parent with children:

```html
<ul class="if-you-want">
  <!-- or <div> or … -->
  <li><img /></li>
  <!-- or <div> or … -->
  <li>
    <img />
    <div>extra content</div>
  </li>
  …
</ul>
```

then a Slidy instance with some options (including your transition animation):

```js
import Slidy from 'epic-slidy'

const transition = (
  currentSlide: HTMLElement | HTMLElement[],
  newSlide: HTMLElement | HTMLElement[],
  {
    animate: boolean,
    direction: 'prev' | 'next',
    currentIndex: number,
    currentGroup: number,
    newIndex: number,
    newGroup: number,
    trigger:
      'auto' |
      'click' |
      'tap' |
      'drag' |
      'swipe' |
      'nav' |
      'pagination' |
      'controls',
  } as TransitionInfos
) => Promise.resolve() // Do what you want here and return a promise…

// New slider with HTMLElement or CSS selector
const slider = new Slidy('.if-you-want', {
  controls: true,
  nav: true,
  transition,
})
// Use some hooks
slider.on('beforeInit', cb)
// Then init
slider.init()
```

and you will get this:

```html
<div class="slidy-outer">
  <ul class="slidy what-you-want">
    <li class="slidy__item"><img /></li>
    <li class="slidy__item">
      <img />
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
</div>
<!-- end .slidy-outer -->
```

## Config / options

| Option        | Values                                            | Default | Description                                                                      |
| ------------- | ------------------------------------------------- | ------- | -------------------------------------------------------------------------------- |
| auto          | `boolean`                                         | false   | Auto-start                                                                       |
| click         | `boolean`                                         | true    | Enable next slide on click                                                       |
| controls      | `boolean` or 'template string'                    | false   | Next / prev buttons (see examples)                                               |
| debounce      | `number`                                          | 100     | Debounce delay on resize                                                         |
| drag          | `boolean`                                         | false   | Enable horizontal mouse drag                                                     |
| group         | `number` or `() => number`                        | 'auto'  | Auto or pixel height                                                             |
| height        | 'auto' or `number`                                | 'auto'  | Auto or pixel height                                                             |
| index         | `number`                                          | 0       | Initial index                                                                    |
| interval      | `number`                                          | 2000    | Time (ms) betweeen 2 transitions                                                 |
| keyboard      | `boolean`                                         | false   | Enable keyboard arrows controls                                                  |
| loop          | `boolean`                                         | true    | loop … or not                                                                    |
| namespace     | `string`                                          | 'slidy' | CSS custom [class]namespace                                                      |
| nav           | `boolean`, 'number', 'thumb' or 'template string' | false   | Display a navigation with numbers / thumbs within custom template (see examples) |
| pagination    | `boolean` or 'separator string'                   | false   | Display a pagination                                                             |
| pause         | `boolean`                                         | true    | Pause on hover                                                                   |
| preserveGroup | `boolean`                                         | true    | On loop, force entire group (group: 2 -> **1** 2 3 4 **5**)                      |
| queue         | `number`                                          | 1       | Queue max items                                                                  |
| resize        | `boolean`                                         | true    | Enable resize event and callback                                                 |
| reverse       | `boolean`                                         | false   | Reverse directions / controls                                                    |
| swipe         | `boolean`                                         | false   | Enable horizontal swipe                                                          |
| tap           | `boolean`                                         | false   | Enable next slide on tap                                                         |
| transition    | `Function`                                        | null    | Animation function which returns a promise                                       |
| zerofill      | `boolean` or `number`                             | false   | 'Zerofill' (1 -> 01) numbers for both nav or pagination                          |

### controls details

- `controls: false` -> no navigation
- `controls: true` -> controls with < / >
- `controls: '<div>${label}</div>'` -> `<div>previous slide</div>` / `<div>next slide</div>`

> If slide elements have a `data-slidy-nav` attribute, this will override "number" or "thumb" content…

### nav details

- `nav: false` -> no navigation
- `nav: true` -> navigation with numbers (1, 2, 3, …)
- `nav: 'number'` -> same as `true`
- `nav: 'thumb'` -> navigation with thumbs ([image-name]\_thumb.ext)
- `nav: '<div>${number}</div>'` -> custom "number" navigation
- `nav: '<div>${thumb}</div>'` -> custom "thumb" navigation

> If slide elements have a `data-slidy-nav` attribute, this will override "number" or "thumb" content…

## Hooks

### Usage

```js
slider.on('hookName', function cb() {})
```

### List

```typescript
type beforeInit = (el: HTMLElement) => void
type afterInit = (el: HTMLElement) => void
type afterResize = (el: HTMLElement) => void
type preventSlide: (action: Action, manager: Manager) => void // You can acces and modify `manager.shouldPrevent` (boolean)
type beforeSlide = (infos: TransitionInfos) => void
type afterSlide = (infos: TransitionInfos) => void
```

---

## How to contribute

If you want to report a bug or if you just want to request for a new feature/improvement, please **follow [those instructions](CONTRIBUTING.md) before**.

Thanks for taking time to contribute to `slidy` :tada: :+1:

---

## License

See [UNLICENSE](UNLICENSE).
