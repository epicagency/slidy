export interface IMove {
  move: Move;
  index: number;
  animate: boolean;
}
export interface IObject {
  [key: string]: any;
}

export interface IOptionsCallbacks {
  beforeInit: (el: HTMLElement) => void;
  afterInit: (el: HTMLElement) => void;
  afterResize: (el: HTMLElement) => void;
  beforeSlide: (
    currentIndex: number,
    newIndex: number,
    direction: Direction,
    animate: boolean
  ) => void;
  afterSlide: (
    currentIndex: number,
    newIndex: number,
    direction: Direction,
    animate: boolean
  ) => void;
}

export interface IOptions extends IOptionsCallbacks {
  auto?: boolean;
  click?: boolean;
  controls?: boolean | string;
  debounce?: number;
  height?: 'auto' | number;
  index?: number;
  interval?: number;
  loop?: boolean;
  namespace?: string;
  nav?: boolean | string;
  queue?: number;
  pagination?: boolean | string;
  pause?: boolean;
  resize?: boolean;
  reverse?: boolean;
  swipe?: boolean;
  tap?: boolean;
  transition?: Transition;
  zerofill?: boolean | number;
}
export interface IControlsOptions {
  controls?: boolean | string;
  loop?: boolean;
}

export type Direction = 'prev' | 'next';
export type Move = Direction | 'to';
export type Transition = (
  currentSlide: HTMLElement,
  newSlide: HTMLElement,
  direction: Direction
) => Promise<any>;
