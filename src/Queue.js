/**
 * Create queue.
 *
 * @export
 * @class Queue
 */
export class Queue {
  /**
   * Creates an instance of Queue.
   * @param {Slidy} slidy slidy instance
   * @param {function} transition function that returns a promise
   * @memberof Queue
   */
  constructor(slidy, transition) {
    this._slidy = slidy;
    this._transition = transition;
    this._dispatcher = this._slidy.dispatcher;
    this._isAnimating = false;
    this._max = this._slidy._opts.queue;
    this._items = [];
  }

  /**
   * Add "move" to queue.
   *
   * @param {string} move  prev|next|to
   * @param {number} index slide index
   * @param {boolean} animate should use transition
   * @returns {undefined}
   * @memberof Queue
   */
  add(move, index, animate) {
    if (this._items.length > this._max) {
      this._items.length = this._max;
    }

    this._items.push({
      move,
      index,
      animate,
    });

    if (!this._isAnimating) {
      this.play();
    }
  }

  /**
   * Empty queue.
   *
   * @returns {undefined}
   * @memberof Queue
   */
  empty() {
    this._items = [];
  }

  /**
   * Play queue.
   *
   * @returns {undefined}
   * @memberof Queue
   */
  play() {
    if (this._items.length === 0) {
      return;
    }

    const [{ move, animate }] = this._items;
    const { items } = this._slidy;
    const { length } = items;
    const { currentIndex } = this._slidy;
    let newIndex;
    let direction;

    // Get the newIndex according to "move type".
    if (move === 'to') {
      newIndex = this._items[0].index;
    } else {
      if (move === 'prev') {
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          if (this._slidy._opts.loop) {
            newIndex = length - 1;
          } else {
            newIndex = currentIndex;
          }
        }
      }
      if (move === 'next') {
        newIndex = currentIndex + 1;
        if (newIndex === length) {
          if (this._slidy._opts.loop) {
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
