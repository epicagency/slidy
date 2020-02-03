import Slidy from '..'
import { Direction, Action, Move, Transition } from '../defs'

/**
 * Create queue.
 */
export class Queue {
  private _slidy: Slidy
  private _transition: Transition
  private _isAnimating = false
  private _max: number
  private _items: Action[]

  /**
   * Creates an instance of Queue.
   */

  constructor(slidy: Slidy, transition: Transition) {
    this._slidy = slidy
    this._transition = transition
    this._isAnimating = false
    this._max = this._slidy.options.queue
    this._items = []
  }

  /**
   * Add "move" to queue.
   */

  public add(move: Move, index: number, animate: boolean) {
    if (this._items.length > this._max) {
      this._items.length = this._max
    }

    this._items.push({
      animate,
      index,
      move,
    })

    if (!this._isAnimating) {
      this._play()
    }
  }

  /**
   * Empty queue.
   */

  public empty() {
    this._items = []
  }

  /**
   * Play queue.
   */

  private _play() {
    if (this._items.length === 0) {
      return
    }

    const [{ move, animate }] = this._items
    const { items } = this._slidy
    const { length } = items
    const { currentIndex } = this._slidy
    let newIndex: number
    let direction: Direction

    // Get the newIndex according to "move type".
    if (move === 'to') {
      newIndex = this._items[0].index
    } else {
      if (move === 'prev') {
        newIndex = currentIndex - 1
        if (newIndex < 0) {
          if (this._slidy.options.loop) {
            newIndex = length - 1
          } else {
            newIndex = currentIndex
          }
        }
      }
      if (move === 'next') {
        newIndex = currentIndex + 1
        if (newIndex === length) {
          if (this._slidy.options.loop) {
            newIndex = 0
          } else {
            newIndex = currentIndex
          }
        }
      }
    }

    // If same than current -> dequeue + next.
    if (newIndex === currentIndex) {
      this._items.shift()
      this._play()

      return
    }

    // Get direction.
    if (move === 'to') {
      direction = newIndex > currentIndex ? 'next' : 'prev'
    } else {
      direction = move
    }

    // Get slides.
    const currentSlide = items[currentIndex]
    const newSlide = items[newIndex]

    // Set new index.
    this._slidy.newIndex = newIndex

    // Start slide.
    this._slidy.hooks.call('beforeSlide', this._slidy, direction, animate)

    // Update status and active class.
    this._isAnimating = true
    currentSlide.classList.remove('is-active')

    const transition = animate ? this._transition : () => Promise.resolve()

    transition.call(this._slidy, currentSlide, newSlide, direction).then(() => {
      // Update indexes, queue, status and active class.
      this._slidy.oldIndex = currentIndex
      this._slidy.currentIndex = newIndex
      this._items.shift()
      this._isAnimating = false
      newSlide.classList.add('is-active')
      // End slide.
      this._slidy.hooks.call('afterSlide', this._slidy, direction, animate)
      // Play next queued transition.
      this._play()
    })
  }
}
