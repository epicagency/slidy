export class Queue {
  constructor(slidy, transition) {
    console.log('Queue:init');
    this._slidy = slidy;
    this._transition = transition;
    this._dispatcher = this._slidy.dispatcher;
    this._isAnimating = false;
    this._queue = [];
  }

  add(move, index) {
    if (this._queue.length > 1) {
      this._queue.length = 1;
    }

    this._queue.push({
      move: move,
      index: index,
    });

    if (!this._isAnimating) {
      this.play();
    }
  }

  play() {
    if (this._queue.length === 0) {
      return;
    }

    const move = this._queue[0].move;
    const items = this._slidy.items;
    const len = items.length;
    const currentIndex = this._slidy.currentIndex;
    let newIndex;
    let direction;

    // Get the newIndex according to "move type"
    if (move === 'to') {
      newIndex = this._queue[0].index;
    } else {
      if (move === 'prev') {
        newIndex = currentIndex - 1;
        if (newIndex < 0) {
          newIndex = len - 1;
        }
      }
      if (move === 'next') {
        newIndex = currentIndex + 1;
        if (newIndex === len) {
          newIndex = 0;
        }
      }
    }

    // If same than current -> dequeue + next
    if (newIndex === currentIndex) {
      this._queue.shift();
      this.play();
      return;
    }

    // Get direction
    if (move === 'to') {
      direction = (newIndex > currentIndex) ? 'next' : 'prev';
    } else {
      direction = move;
    }

    const currentSlide = items[currentIndex];
    const newSlide = items[newIndex];

    this._slidy.newIndex = newIndex;
    this._dispatcher.emit('beforeSlide', direction);

    this._isAnimating = true;

    this._transition.call(this._slidy, currentSlide, newSlide, direction)
      .then(() => {
        this._slidy.oldIndex = currentIndex;
        this._slidy.currentIndex = newIndex;
        this._queue.shift();
        this._isAnimating = false;
        this._dispatcher.emit('afterSlide', direction);
        this.play();
      });
  }
}
