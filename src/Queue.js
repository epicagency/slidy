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
    this._queue = [];
  }

  /**
   * Add "move" to queue.
   *
   * @param {string} move  prev|next|to
   * @param {number} index slide index
   * @returns {undefined}
   * @memberof Queue
   */
  add(move, index) {
    if (this._queue.length > 1) {
      this._queue.length = 1;
    }

    this._queue.push({
      move,
      index,
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
    this._queue = [];
  }

  /**
   * Play queue.
   *
   * @returns {undefined}
   * @memberof Queue
   */
  play() {
    if (this._queue.length === 0) {
      return;
    }

    const [{ move }] = this._queue;
    const { items } = this._slidy;
    const { length } = items;
    const { currentIndex } = this._slidy;
    let newIndex;
    let direction;

    // Get the newIndex according to "move type".
    if (move === 'to') {
      newIndex = this._queue[0].index;
    } else {
      if (move === 'prev') {
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = length - 1;
        }
      }
      if (move === 'next') {
        newIndex = currentIndex + 1;
        if (newIndex === length) {
          newIndex = 0;
        }
      }
    }

    // If same than current -> dequeue + next.
    if (newIndex === currentIndex) {
      this._queue.shift();
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
    this._dispatcher.emit('beforeSlide', direction);
    // Update status and active class.
    this._isAnimating = true;
    currentSlide.classList.remove('is-active');
    this._transition.call(this._slidy, currentSlide, newSlide, direction)
      .then(() => {
        // Update indexes, queue, status and active class.
        this._slidy.oldIndex = currentIndex;
        this._slidy.currentIndex = newIndex;
        this._queue.shift();
        this._isAnimating = false;
        newSlide.classList.add('is-active');
        // End slide.
        this._dispatcher.emit('afterSlide', direction);
        // Play next queued transition.
        this.play();
      });
  }
}
