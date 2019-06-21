'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Create queue.
 *
 * @export
 * @class Queue
 */
var Queue = exports.Queue = function () {
  /**
   * Creates an instance of Queue.
   * @param {Slidy} slidy slidy instance
   * @param {function} transition function that returns a promise
   * @memberof Queue
   */
  function Queue(slidy, transition) {
    _classCallCheck(this, Queue);

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


  _createClass(Queue, [{
    key: 'add',
    value: function add(move, index, animate) {
      if (this._items.length > this._max) {
        this._items.length = this._max;
      }

      this._items.push({
        move: move,
        index: index,
        animate: animate
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

  }, {
    key: 'empty',
    value: function empty() {
      this._items = [];
    }

    /**
     * Play queue.
     *
     * @returns {undefined}
     * @memberof Queue
     */

  }, {
    key: 'play',
    value: function play() {
      var _this = this;

      if (this._items.length === 0) {
        return;
      }

      var _items = _slicedToArray(this._items, 1),
          _items$ = _items[0],
          move = _items$.move,
          animate = _items$.animate;

      var items = this._slidy.items;
      var length = items.length;
      var currentIndex = this._slidy.currentIndex;

      var newIndex = void 0;
      var direction = void 0;

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
      var currentSlide = items[currentIndex];
      var newSlide = items[newIndex];

      // Set new index.
      this._slidy.newIndex = newIndex;

      // Start slide.
      this._dispatcher.emit('beforeSlide', direction, animate);
      // Update status and active class.
      this._isAnimating = true;
      currentSlide.classList.remove('is-active');

      var transition = animate ? this._transition : function () {
        return Promise.resolve();
      };

      transition.call(this._slidy, currentSlide, newSlide, direction).then(function () {
        // Update indexes, queue, status and active class.
        _this._slidy.oldIndex = currentIndex;
        _this._slidy.currentIndex = newIndex;
        _this._items.shift();
        _this._isAnimating = false;
        newSlide.classList.add('is-active');
        // End slide.
        _this._dispatcher.emit('afterSlide', direction, animate);
        // Play next queued transition.
        _this.play();
      });
    }
  }]);

  return Queue;
}();