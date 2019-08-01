import Emitter from 'tiny-emitter';
import Slidy from '..';
import { Direction, IMove, Move, Transition } from '../defs';

/**
 * Create queue.
 */
export class Queue {
  private _slidy: Slidy;
  private _transition: Transition;
  private _dispatcher: Emitter;
  private _isAnimating = false;
  private _max: number;
  private _items: IMove[];

  /**
   * Creates an instance of Queue.
   */
  constructor(slidy: Slidy, transition: Transition) {
    this._slidy = slidy;
    this._transition = transition;
    this._dispatcher = this._slidy.dispatcher;
    this._isAnimating = false;
    this._max = this._slidy.options.queue;
    this._items = [];
  }

  /**
   * Add "move" to queue.
   */
  public add(move: Move, index: number, animate: boolean) {
    if (this._items.length > this._max) {
      this._items.length = this._max;
    }

    this._items.push({
      animate,
      index,
      move,
    });

    if (!this._isAnimating) {
      this.play();
    }
  }

  /**
   * Empty queue.
   */
  public empty() {
    this._items = [];
  }

  /**
   * Play queue.
   */
  private play() {
    if (this._items.length === 0) {
      return;
    }

    const [{ move, animate }] = this._items;
    const { items } = this._slidy;
    const { length } = items;
    const { currentIndex } = this._slidy;
    let newIndex: number;
    let direction: Direction;

    // Get the newIndex according to "move type".
    if (move === 'to') {
      newIndex = this._items[0].index;
    } else {
      if (move === 'prev') {
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          if (this._slidy.options.loop) {
            newIndex = length - 1;
          } else {
            newIndex = currentIndex;
          }
        }
      }
      if (move === 'next') {
        newIndex = currentIndex + 1;
        if (newIndex === length) {
          if (this._slidy.options.loop) {
            newIndex = 0;
          } else {
            newIndex = currentIndex;
          }
        }
      }
    }

    // If same than current -> dequeue + next.
    if (newIndex === currentIndex) {
      this._items.shift();
      this.play();

      return;
    }

    // Get direction.
    if (move === 'to') {
      direction = newIndex > currentIndex ? 'next' : 'prev';
    } else {
      direction = move;
    }

    // Get slides.
    const currentSlide = items[currentIndex];
    const newSlide = items[newIndex];

    // Set new index.
    this._slidy.newIndex = newIndex;

    // Start slide.
    this._dispatcher.emit('beforeSlide', direction, animate);
    // Update status and active class.
    this._isAnimating = true;
    currentSlide.classList.remove('is-active');

    const transition = animate ? this._transition : () => Promise.resolve();

    transition.call(this._slidy, currentSlide, newSlide, direction)
      .then(() => {
        // Update indexes, queue, status and active class.
        this._slidy.oldIndex = currentIndex;
        this._slidy.currentIndex = newIndex;
        this._items.shift();
        this._isAnimating = false;
        newSlide.classList.add('is-active');
        // End slide.
        this._dispatcher.emit('afterSlide', direction, animate);
        // Play next queued transition.
        this.play();
      });
  }
}
