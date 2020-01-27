export interface Action {
  move: Move
  index: number
  animate: boolean
}
export interface GenericObject {
  [key: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface OptionsCallbacks {
  beforeInit: (el: HTMLElement) => void
  afterInit: (el: HTMLElement) => void
  afterResize: (el: HTMLElement) => void
  beforeSlide: (
    currentIndex: number,
    newIndex: number,
    direction: Direction,
    animate: boolean
  ) => void
  afterSlide: (
    currentIndex: number,
    newIndex: number,
    direction: Direction,
    animate: boolean
  ) => void
}

export interface Options extends OptionsCallbacks {
  auto?: boolean
  click?: boolean
  controls?: boolean | string
  debounce?: number
  height?: 'auto' | number
  index?: number
  interval?: number
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
export interface ControlsOptions {
  controls?: boolean | string
  loop?: boolean
}

export type Transition = (
  currentSlide: HTMLElement,
  newSlide: HTMLElement,
  direction: Direction
) => Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any

export type Direction = 'prev' | 'next'
export type Move = Direction | 'to'
