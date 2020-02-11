/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GenericObject {
  [key: string]: any
}

export interface Options {
  auto?: boolean
  click?: boolean
  controls?: boolean | string
  debounce?: number
  drag?: boolean
  group?(): number
  height?: 'auto' | number
  index?: number
  interval?: number
  keyboard?: boolean
  loop?: boolean
  namespace?: string
  nav?: boolean | string
  pagination?: boolean | string
  pause?: boolean
  preserveGroup?: boolean
  queue?: number
  resize?: boolean
  reverse?: boolean
  swipe?: boolean
  tap?: boolean
  transition?: Transition
  zerofill?: boolean | number
}

interface BaseAction {
  trigger: Trigger
  page?: number
  animate?: boolean
}

/**
 * Initiated by Slidy `slide` method, used by manager.
 */
export interface Action extends BaseAction {
  move: Move
}

/**
 * Used by transition callback.
 */
export interface TransitionInfos extends BaseAction {
  direction: Direction
}

export type Direction = 'prev' | 'next'
export type Move = Direction | 'to'
export type Trigger =
  | 'auto'
  | 'click'
  | 'tap'
  | 'drag'
  | 'swipe'
  | 'nav'
  | 'pagination'
  | 'controls'
export type GestureDirection = 'left' | 'right'
export type SupportedEvents = 'click' | 'tap' | 'drag' | 'swipe'
export type SupportedTypes =
  | 'click'
  | 'mousedown'
  | 'mouseup'
  | 'mousemove'
  | 'touchstart'
  | 'touchend'
  | 'touchmove'
  | 'pointerdown'
  | 'pointerup'
  | 'pointermove'

export type Transition = (
  currentSlides: HTMLElement | HTMLElement[],
  newSlides: HTMLElement | HTMLElement[],
  infos: TransitionInfos
) => Promise<any>

export type HooksNames =
  | 'beforeInit'
  | 'afterInit'
  | 'afterResize'
  | 'preventSlide'
  | 'beforeSlide'
  | 'afterSlide'

// TODO: definifions for callbacks with hooks…
export interface HooksCallbacks {
  beforeInit: (el: HTMLElement) => void
  afterInit: (el: HTMLElement) => void
  afterResize: (el: HTMLElement) => void
  preventSlide: (
    currentIndex: number,
    newIndex: number,
    infos: TransitionInfos
  ) => boolean
  beforeSlide: (
    currentIndex: number,
    newIndex: number,
    infos: TransitionInfos
  ) => void
  afterSlide: (
    currentIndex: number,
    newIndex: number,
    infos: TransitionInfos
  ) => void
}
