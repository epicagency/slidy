/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-depth */
import Slidy from '..'
import { Direction, Action, Transition } from '../defs'

/**
 * Create queue.
 */
export class Queue {
  private _transition: Transition
  private _isAnimating = false
  private _max: number
  private _actions: Action[]

  /**
   * Creates an instance of Queue.
   */

  constructor(private _slidy: Slidy, transition: Transition) {
    this._transition = transition
    this._isAnimating = false
    this._max = this._slidy.options.queue
    this._actions = []
  }

  /**
   * Add "move" to queue.
   */

  public add(action: Action) {
    // Prevent slide ?
    if (this._slidy.hooks.call('preventSlide', this._slidy, action)) {
      return
    }

    if (this._actions.length > this._max) {
      this._actions.length = this._max
    }

    this._actions.push(action)

    if (!this._isAnimating) {
      this._play()
    }
  }

  /**
   * Empty queue.
   */

  public empty() {
    this._actions = []
  }

  /**
   * Play queue.
   */

  private _play() {
    if (this._actions.length === 0) {
      return
    }

    const [{ move, trigger, index, animate }] = this._actions
    const { items } = this._slidy
    const { length } = items
    const { currentIndex } = this._slidy
    let newIndex: number
    let direction: Direction

    // Get the newIndex according to "move type".
    if (move === 'to') {
      newIndex = index
    } else {
      if (move === 'prev') {
        newIndex = currentIndex - this._slidy.group
        if (newIndex < 0) {
          if (this._slidy.options.loop) {
            newIndex = length + (currentIndex - this._slidy.group)
          } else {
            newIndex = currentIndex
          }
        }
      }
      if (move === 'next') {
        newIndex = currentIndex + this._slidy.group
        if (newIndex >= length) {
          if (this._slidy.options.loop) {
            newIndex = currentIndex + this._slidy.group - length
          } else {
            newIndex = currentIndex
          }
        }
      }
    }

    console.log(currentIndex, newIndex)

    // If same than current -> dequeue + next.
    if (newIndex === currentIndex) {
      this._actions.shift()
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
    // TODO refactor (KISS) + comments
    const hasGroup = this._slidy.group > 1
    const currentSlides =
      currentIndex + this._slidy.group >= length
        ? this._slidy.options.loop === true
          ? items
              .slice(currentIndex, currentIndex + this._slidy.group)
              .concat(
                items.slice(0, this._slidy.group - (length - currentIndex))
              )
          : items.slice(currentIndex, currentIndex + this._slidy.group)
        : items.slice(currentIndex, currentIndex + this._slidy.group)

    const newSlides =
      newIndex + this._slidy.group >= length
        ? this._slidy.options.loop === true
          ? items
              .slice(newIndex, newIndex + this._slidy.group)
              .concat(items.slice(0, this._slidy.group - (length - newIndex)))
          : items.slice(newIndex, newIndex + this._slidy.group)
        : items.slice(newIndex, newIndex + this._slidy.group)

    // Set new index.
    this._slidy.newIndex = newIndex

    // Start slide.
    this._slidy.hooks.call('beforeSlide', this._slidy, { direction, animate })

    // Update status and active class.
    this._isAnimating = true

    currentSlides.forEach(s => {
      s.classList.remove('is-active')
    })

    const transition = animate ? this._transition : () => Promise.resolve()

    transition
      .call(
        this._slidy,
        hasGroup ? currentSlides : currentSlides[0],
        newSlides,
        { direction, trigger }
      )
      .then(() => {
        // Update indexes, queue, status and active class.
        this._slidy.oldIndex = currentIndex
        this._slidy.currentIndex = newIndex
        this._actions.shift()
        this._isAnimating = false

        console.log(currentIndex, newIndex)

        newSlides.forEach(s => {
          s.classList.add('is-active')
        })

        // End slide.
        this._slidy.hooks.call('afterSlide', this._slidy, {
          direction,
          animate,
        })
        // Play next queued transition.
        this._play()
      })
  }
}
