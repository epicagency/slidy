import Slidy from '..'
import { Direction, Action, Transition, TransitionInfos } from '../defs'

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
    this._max = this._slidy.options.queue
    this._actions = []
  }

  /**
   * Add "action" to Manager.
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
   * Get current items.
   * Used for transitions and CSS active styling
   */
  public getCurrentItems(currentIndex: number): HTMLElement[] {
    const { group, items } = this._slidy
    const { loop, preserveGroup } = this._slidy.options

    let currentItems = items.slice(currentIndex, currentIndex + group)

    if (currentIndex + group >= items.length && loop && preserveGroup) {
      currentItems = currentItems.concat(
        items.slice(0, group - (items.length - currentIndex))
      )
    }

    return currentItems
  }

  /**
   * Get new items.
   * Used for transitions and CSS active styling
   */
  public getNewItems(newIndex: number): HTMLElement[] {
    const { group, items } = this._slidy
    const { loop, preserveGroup } = this._slidy.options

    let newItems = items.slice(newIndex, newIndex + group)

    if (newIndex + group >= items.length && loop && preserveGroup) {
      newItems = newItems.concat(
        items.slice(0, group - (items.length - newIndex))
      )
    }

    return newItems
  }

  /**
   * Play manager.
   */
  private _play() {
    if (this._actions.length === 0) {
      return
    }

    const [{ move, trigger, index, animate }] = this._actions
    const infos: TransitionInfos = { trigger, index, animate }
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

    // Get the newIndex according to "move type"
    if (move === 'to') {
      newGroup = index
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

    // Manage group with loop option.
    // If no loop, current is ok…
    if (newGroup < 0) {
      newGroup = loop ? groupsMax - 1 : currentGroup
    }

    if (newGroup >= groupsMax) {
      newGroup = loop ? 0 : currentGroup
    }

    // Manage index with loop option.
    // If no loop, current is ok…
    if (newIndex < 0) {
      if (loop) {
        // Depending on `preserveGroup`…
        newIndex = preserveGroup
          ? length - Math.abs(newIndex) // Get some item at the end
          : length - (length % group) // Get the last group
      } else {
        newIndex = currentIndex
      }
    }

    if (newIndex >= length) {
      if (loop) {
        // Depending on `preserveGroup`…
        newIndex = preserveGroup
          ? newIndex - length // Get some item in the begining
          : 0 // Get the first group
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

    infos.direction = direction

    // If same than current -> dequeue + next.
    if (newGroup === currentGroup) {
      this._actions.shift()
      this._play()

      return
    }

    // Update slide indexes and get current/next slides.
    const currentSlides = this.getCurrentItems(currentIndex)
    const newSlides = this.getNewItems(newIndex)

    // Set new index.
    this._slidy.newIndex = newIndex
    this._slidy.newGroup = newGroup

    // Start slide.
    this._slidy.hooks.call('beforeSlide', this._slidy, infos)

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
        this._slidy.currentIndex = newIndex
        this._slidy.currentGroup = newGroup
        this._actions.shift()
        this._isAnimating = false

        newSlides.forEach(s => {
          s.classList.add('is-active')
        })

        // End slide.
        this._slidy.hooks.call('afterSlide', this._slidy, infos)

        // Play next queued transition.
        this._play()
      })
  }
}
