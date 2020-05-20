/**
 * Slidy main file.
 */

import {
  Action,
  GestureDirection,
  HooksNames,
  Options,
  SupportedEvents,
  Trigger,
} from './defs'
import { Controls, Events, Hooks, Nav, Pagination, Manager } from './modules'
import { debounce, touchevents } from './utils'

/**
 * Slidy main class.
 */
export default class Slidy {
  public hooks = new Hooks()

  public el: HTMLElement
  public outer: HTMLDivElement
  public items: HTMLElement[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public context: any

  public currentIndex: number
  public newIndex: number
  public itemsMax: number
  public group: number
  public currentGroup: number
  public newGroup: number
  public groupsMax: number

  private _currentItems: HTMLElement[]

  private _manager: Manager
  private _controls: Controls
  private _nav: Nav
  private _pagination: Pagination
  private _eventManager: Events

  private _opts: Options
  private _debounceDelay: number
  private _hasPause: boolean
  private _hasErrors: boolean
  private _destroyed: boolean
  private _t1: number
  private _t2: number

  constructor(
    element: HTMLElement | string,
    opts: Options,
    _context: any = null, // eslint-disable-line @typescript-eslint/no-explicit-any
    public data: any = null // eslint-disable-line @typescript-eslint/no-explicit-any
  ) {
    let el: NodeListOf<HTMLElement>

    // Check and get element(s).
    if (typeof element === 'string') {
      el = document.querySelectorAll(element as string)
    }

    if (!element || (el && el.length === 0)) {
      this._hasErrors = true
      console.error('Slidy: no element matching!')

      return
    }

    if (el && el.length > 1) {
      console.warn('Slidy: multiple elements matching!')
    }

    this.el = el ? el[0] : (element as HTMLElement)

    // Check and get options.
    this._opts = {
      auto: false, // Boolean: start slider automaticaly
      click: true, // Boolean: enable click on slider
      controls: false, // Boolean: create prev/next buttons
      debounce: 100, // Integer: debounce delay on resize
      drag: false, // Boolean: enable mouse drag
      group: () => 1, // Mixed(number | Function)
      height: 'auto', // Mixed: integer (px) or 'auto'
      index: 0, // Integer: initial index
      interval: 2000, // Integer: time between 2 transitions
      keyboard: true, // Boolean: enable/disable keyboard controls
      loop: true, // Boolean: enable/disable loop
      namespace: 'slidy', // String: custom namespace
      nav: false, // Mixed: create navigation (number, thumb, custom)
      pagination: false, // Mixed: create pagination (1[separator]10)
      pause: true, // Boolean: pause on hover
      preserveGroup: true, // Boolean: enable if group show
      queue: 1, // Integer: queue max items
      resize: true, // Boolean: enable resize event and callback
      reverse: false, // Boolean: reverse directions / controls
      swipe: false, // Boolean: enable swipe
      tap: false, // Boolean: enable tap
      transition: null, // Function: transition which returns a resolved promise
      zerofill: false, // Mixed(Boolean | number): '1' -> '01' for navigation/pagination
      ...opts,
    }

    if (this._opts.transition === null) {
      this._hasErrors = true
      console.error('Slidy: you should define a transition!')

      return
    }

    this.context = _context || this
    this._debounceDelay = this._opts.debounce
    this.currentIndex = this._opts.index
    this.newIndex = this.currentIndex
    this.group = Number(this._opts.group) || this._opts.group()
    this.currentGroup = Math.ceil(this.currentIndex / this.group)
    this.newGroup = this.currentGroup

    // TODO: fix starting at index === 1 && group === 3 && !preserveGroup
    // currentGroup === 1 but
    // 'controls/prev' does not display group#0 (but loops to the end)
    /* istanbul ignore next */
    if (this.newIndex % this.group !== 0 && !this.options.preserveGroup) {
      console.warn('Slidy: index does not match with group!')
    }
  }

  /**
   * Getters/setters.
   */
  get options() {
    return this._opts
  }

  get namespace() {
    return this._opts.namespace
  }

  /**
   * Init component.
   */
  public init() {
    if (this._hasErrors) {
      console.error('Slidy: fix errors!')

      return
    }

    this.items = Array.from(this.el.children) as HTMLElement[]
    this.itemsMax = this.items.length
    this.groupsMax = Math.ceil(this.itemsMax / this.group)
    this._hasPause = false

    // Binding
    this.start = this.start.bind(this)
    this.slideNext = this.slideNext.bind(this)

    this.hooks.add('afterSlide', () => {
      // Accessibility
      this.el.setAttribute('aria-valuenow', `${this.currentIndex + 1}`)
    })

    this.bind()

    // Start initialization
    this.hooks.call('beforeInit', this, this.el)

    this._manager = new Manager(this, this._opts.transition)

    // Set height.
    // To get the most 'correct' auto-height,
    // do it before applying anything…
    if (this._opts.height === 'auto') {
      this.reset()
    } else {
      this.el.style.height = `${this._opts.height}px`
    }

    // Add HTML wrapper.
    this.outer = document.createElement('div')
    this.el.parentNode.insertBefore(this.outer, this.el)
    this.outer.appendChild(this.el)

    // Get current items.
    this._currentItems = this._manager.getCurrentItems(this.currentIndex)

    // Add CSS classes.
    this.outer.classList.add(`${this.namespace}-outer`)
    this.el.classList.add(this.namespace)
    this.items.forEach(slide => {
      slide.classList.add(`${this.namespace}__item`)
    })
    // Set active class on each element of currentItems.
    this._currentItems.forEach(slide => {
      slide.classList.add('is-active')
    })

    // Accessibility
    this.el.setAttribute('role', 'slider')
    this.el.setAttribute('aria-valuemin', `${1}`)
    this.el.setAttribute('aria-valuemax', `${this.items.length}`)
    this.el.setAttribute('aria-valuenow', `${this.currentIndex + 1}`)
    this.el.setAttribute('aria-valuenow', `${this.currentGroup + 1}`)

    if (this._opts.click) {
      this.el.style.cursor = 'pointer'
    }

    // Add controls.
    if (this._opts.controls) {
      this._controls = new Controls(this, this._opts)
    }

    // Add nav.
    if (this._opts.nav) {
      this._nav = new Nav(this, this._opts)
    }

    // Add pagination.
    if (this._opts.pagination) {
      this._pagination = new Pagination(this, this._opts)
    }

    // Start auto mode.
    if (this._opts.auto) {
      this.start()
    }

    this.hooks.call('afterInit', this, this.el)
  }

  /**
   * API (hooks)
   */
  public on(hookName: HooksNames, cb: Function) {
    this.hooks.add(hookName, cb)
  }

  public off(hookName: HooksNames, cb: Function) {
    this.hooks.remove(hookName, cb)
  }

  /**
   * Navigate to previous slide.
   */
  public slidePrev(trigger: Trigger, force = false) {
    if (this._opts.reverse && !force) {
      this.slideNext(trigger, true)

      return
    }

    this.slide({ move: 'prev', trigger })
  }

  /**
   * Navigate to next slide.
   */
  public slideNext(trigger: Trigger, force = false) {
    if (this._opts.reverse && !force) {
      this.slidePrev(trigger, true)

      return
    }

    this.slide({ move: 'next', trigger })
  }

  /**
   * Navigate to slide by index.
   */
  public slideTo(index: number, trigger: Trigger, animate = true) {
    this.slide({ move: 'to', trigger, index, animate })
  }

  /**
   * Add move to the manager.
   */
  public slide(action: Action) {
    if (this._opts.auto) {
      window.clearInterval(this._t1)
      this._t1 = window.setInterval(this.slideNext, this._opts.interval)
    }

    if (this._manager) {
      this._manager.add({
        index: null,
        animate: true,
        ...action,
      })
    } else {
      // Prevent 'persistent' auto
      this.stop()
    }
  }

  /**
   * Start autoplay.
   * Enabled via "auto" and used by "pause" options.
   */
  public start(delay = this._opts.interval, auto = this._opts.auto) {
    this._t2 = window.setTimeout(() => {
      this.slideNext('auto')

      if (!this._hasPause && this._opts.pause) {
        this.outer.addEventListener('mouseenter', this._onEnter)
      }

      if (auto) {
        window.clearInterval(this._t1)
        this._t1 = window.setInterval(this.slideNext, this._opts.interval)
      }
    }, delay)
  }

  /**
   * Pause autoplay.
   * Used by "pause" options.
   */
  public stop() {
    if (this._hasPause) {
      this.outer.removeEventListener('mouseenter', this._onEnter)
    }
    window.clearTimeout(this._t2)
    window.clearInterval(this._t1)
  }

  /**
   * Destroy component.
   */
  public destroy() {
    this._destroyed = true

    // Remove interval.
    this.stop()

    // Empty manager.
    /* istanbul ignore else */
    if (this._manager) {
      this._manager.empty()
      delete this._manager
    }

    // Remove listeners.
    /* istanbul ignore else */
    if (this._opts.resize) {
      window.removeEventListener('resize', this.onResize)
    }
    this.el.removeEventListener('mouseenter', this._onEnter)
    this.el.removeEventListener('mouseleave', this._onLeave)
    this.el.removeEventListener('click', this._onClick)

    // Remove event manager.
    /* istanbul ignore else */
    if (this._eventManager) {
      this._eventManager.destroy()
      delete this._eventManager
    }

    // Remove controls.
    /* istanbul ignore else */
    if (this._controls) {
      this._controls.destroy()
      delete this._controls
    }

    // Remove nav.
    /* istanbul ignore else */
    if (this._nav) {
      this._nav.destroy()
      delete this._nav
    }

    // Remove pagination.
    /* istanbul ignore else */
    if (this._pagination) {
      this._pagination.destroy()
      delete this._pagination
    }

    // Remove HTML wrapper.
    this.outer.before(this.el)
    /* istanbul ignore else */
    if (this.outer.parentNode) {
      this.outer.parentNode.removeChild(this.outer)
    }

    // Remove CSS classes.
    this.el.classList.remove(this.namespace)
    this.items.forEach(slide => {
      slide.classList.remove(`${this.namespace}__item`)
      slide.removeAttribute('style')
      Array.from(slide.children).forEach(child => {
        child.removeAttribute('style')
      })
    })

    this.el.removeAttribute('style')

    // Removeccessibility
    this.el.removeAttribute('role')
    this.el.removeAttribute('aria-valuemin')
    this.el.removeAttribute('aria-valuemax')
    this.el.removeAttribute('aria-valuenow')
    this.el.removeAttribute('aria-valuenow')
  }

  /**
   * Bind event handlers.
   */
  private bind() {
    this._onEnter = this._onEnter.bind(this)
    this._onLeave = this._onLeave.bind(this)
    this._onClick = this._onClick.bind(this)
    this._onTap = this._onTap.bind(this)
    this._onMove = this._onMove.bind(this)
    // // this.onDrag = this.onDrag.bind(this)

    if (this._opts.resize) {
      this.onResize = debounce(this.onResize, this._debounceDelay).bind(this)

      window.addEventListener('resize', this.onResize)
    }

    if (this._opts.pause && this._opts.auto) {
      this.outer.addEventListener('mouseenter', this._onEnter)
      this._hasPause = true
    }

    // Events binding
    this._eventManager = new Events(this.el)

    if (touchevents()) {
      this._opts.tap && this._eventManager.on('tap', this._onTap)
      this._opts.swipe && this._eventManager.on('swipe', this._onMove)
    } else {
      this._opts.click && this._eventManager.on('click', this._onClick)
      this._opts.drag && this._eventManager.on('drag', this._onMove)
    }
  }

  /**
   * Height calculation if auto.
   */
  private reset() {
    if (this._opts.height === 'auto') {
      // Reset inline height.
      this.el.style.height = ''

      // Check if items have height
      // if not, check first node
      // then remove 0 height, sort DESC, get the highest height.
      const getMinHeight = (arr: number[]) =>
        arr
          .filter(item => item > 0)
          .sort((a, b) => b - a)
          .slice(0, 1)

      const heights: number[] = []
      const hasNoHeight = this.items[0].offsetHeight === 0

      this.items.forEach(item => {
        if (hasNoHeight && item.firstElementChild) {
          heights.push((item.firstElementChild as HTMLElement).offsetHeight)
        } else {
          heights.push(item.offsetHeight)
        }
      })
      this.el.style.height = `${getMinHeight(heights)}px`
    }
  }

  /**
   * RWD reset.
   * Mainly for height… but also for "responsive" groups
   */
  private onResize() {
    if (!this._destroyed) {
      this.reset()

      if (!Number(this._opts.group)) {
        this.group = this._opts.group()
      }

      this.hooks.call('afterResize', this, this.el)
    }
  }

  /**
   * Click on slider to go to the next slide.
   * Enabled via "click" option.
   */
  private _onClick() {
    this.slideNext('click')
  }

  /**
   * Same as click but for touch devices.
   * Enabled via "tap" option.
   */
  private _onTap() {
    this.slideNext('tap')
  }

  /**
   * Complement gesture for horizontal mouse drag or swipe.
   * Enabled via "drag" option.
   */
  private _onMove(direction: GestureDirection, type: SupportedEvents) {
    if (direction === 'right') {
      this.slidePrev(type as Trigger)
    }
    if (direction === 'left') {
      this.slideNext(type as Trigger)
    }
  }

  /**
   * Play/pause on hover.
   * Enabled via "auto" + "pause" options.
   */
  private _onEnter() {
    this.outer.removeEventListener('mouseenter', this._onEnter)
    this.stop()
    this.outer.addEventListener('mouseleave', this._onLeave)
  }

  private _onLeave() {
    this.outer.removeEventListener('mouseleave', this._onLeave)
    this.start()
    this.outer.addEventListener('mouseenter', this._onEnter)
  }
}
