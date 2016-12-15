'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = exports.Queue = function () {
  function Queue(slidy, transition) {
    _classCallCheck(this, Queue);

    console.log('Queue:init');
    this._slidy = slidy;
    this._transition = transition;
    this._dispatcher = this._slidy.dispatcher;
    this._isAnimating = false;
    this._queue = [];
  }

  _createClass(Queue, [{
    key: 'add',
    value: function add(move, index) {
      if (this._queue.length > 1) {
        this._queue.length = 1;
      }

      this._queue.push({
        move: move,
        index: index
      });

      if (!this._isAnimating) {
        this.play();
      }
    }
  }, {
    key: 'play',
    value: function play() {
      var _this = this;

      if (this._queue.length === 0) {
        return;
      }

      var move = this._queue[0].move;
      var items = this._slidy.items;
      var len = items.length;
      var currentIndex = this._slidy.currentIndex;
      var newIndex = void 0;
      var direction = void 0;

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
        direction = newIndex > currentIndex ? 'next' : 'prev';
      } else {
        direction = move;
      }

      var currentSlide = items[currentIndex];
      var newSlide = items[newIndex];

      this._slidy.newIndex = newIndex;
      this._dispatcher.emit('beforeSlide', direction);

      this._isAnimating = true;

      this._transition.call(this._slidy, currentSlide, newSlide, direction).then(function () {
        _this._slidy.oldIndex = currentIndex;
        _this._slidy.currentIndex = newIndex;
        _this._queue.shift();
        _this._isAnimating = false;
        _this._dispatcher.emit('afterSlide', direction);
        _this.play();
      });
    }
  }]);

  return Queue;
}();