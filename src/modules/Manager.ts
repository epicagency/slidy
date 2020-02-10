/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-depth */
import Slidy from '..'
import { Direction, Action, Transition } from '../defs'

/**
 * Create manager.
 */
export class Manager {
  private _transition: Transition
  private _isAnimating = false
  private _max: number
  private _actions: Action[]

  /**
   * Creates an instance of Manager.
   */

  constructor(private _slidy: Slidy, transition: Transition) {
    this._transition = transition
    this._isAnimating = false
    this._max = this._slidy.options.manager
    this._actions = []
  }

  /**
   * Add "move" to Manager.
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
   * Empty manager.
   */

  public empty() {
    this._actions = []
  }

  /**
   * Play manager.
   */

  private _play() {
    if (this._actions.length === 0) {
      return
    }

    const [{ move, trigger, page, animate }] = this._actions
    const { items } = this._slidy
    const { length } = items
    const {
      currentIndex,
      currentGroup,
      groupsMax,
      group,
      options,
    } = this._slidy
    const { loop, preserveGroup } = options

    let newIndex: number
    let newGroup: number
    let direction: Direction

    if (move === 'to') {
      newGroup = page
      // eslint-disable-next-line no-mixed-operators
      newIndex = newGroup * group
    } else {
      if (move === 'prev') {
        newGroup = currentGroup - 1
        newIndex = currentIndex - group
      }

      if (move === 'next') {
        newGroup = currentGroup + 1
        newIndex = currentIndex + group
      }
    }

    if (newGroup < 0) {
      newGroup = loop ? groupsMax - 1 : currentGroup
    }

    if (newGroup >= groupsMax) {
      newGroup = loop ? 0 : currentGroup
    }

    if (newIndex < 0) {
      if (loop) {
        newIndex = preserveGroup
          ? length - Math.abs(newIndex)
          : length - (length % group)
      } else {
        newIndex = currentIndex
      }
    }

    if (newIndex >= length) {
      if (loop) {
        newIndex = preserveGroup ? newIndex - length : 0
      } else {
        newIndex = currentIndex
      }
    }

    // Get direction.
    if (move === 'to') {
      direction = newGroup > currentGroup ? 'next' : 'prev'
    } else {
      direction = move
    }

    // If same than current -> dequeue + next.
    if (newGroup === currentGroup) {
      this._actions.shift()
      this._play()

      return
    }

    // Update slide indexes and get current/next slides.
    let currentSlides = items.slice(currentIndex, currentIndex + group)
    let newSlides = items.slice(newIndex, newIndex + group)

    if (currentIndex + group >= length && loop && preserveGroup) {
      currentSlides = currentSlides.concat(
        items.slice(0, group - (length - currentIndex))
      )
    }

    if (newIndex + group >= length && loop && preserveGroup) {
      newSlides = newSlides.concat(items.slice(0, group - (length - newIndex)))
    }

    // Set new index.
    this._slidy.newIndex = newIndex
    this._slidy.newGroup = newGroup

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
        group > 1 ? currentSlides : currentSlides[0],
        newSlides,
        { direction, trigger }
      )
      .then(() => {
        // Update indexes, manager, status and active class.
        this._slidy.oldIndex = currentIndex
        this._slidy.currentIndex = newIndex
        this._slidy.currentGroup = newGroup
        this._actions.shift()
        this._isAnimating = false

        // console.log(currentIndex, newIndex)

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
