interface BaseAction {
  trigger: Trigger
  index?: number
  animate?: boolean
}

export interface Action extends BaseAction {
  move: Move
}

export interface TransitionInfos extends BaseAction {
  direction: Direction
}

export interface GenericObject {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface GroupFn {
  (): number
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
  queue?: number
  pagination?: boolean | string
  pause?: boolean
  resize?: boolean
  reverse?: boolean
  swipe?: boolean
  tap?: boolean
  transition?: Transition
  zerofill?: boolean | number
}

export type Transition = (
  currentSlides: HTMLElement | HTMLElement[],
  newSlides: HTMLElement | HTMLElement[],
  infos: TransitionInfos
) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any

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
export type GestureDirection = 'left' | 'right'

export type HooksNames =
  | 'beforeInit'
  | 'afterInit'
  | 'afterResize'
  | 'preventSlide'
  | 'beforeSlide'
  | 'afterSlide'

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
