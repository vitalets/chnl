'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Channel
 */

var innerEvents = ['onListenerAdded', 'onListenerRemoved', 'onFirstListenerAdded', 'onLastListenerRemoved'];

var Channel = function () {
  /**
   * Constructor
   * @param {String} [name]
   * @param {Boolean} [noInnerEvents]
   */

  function Channel(name, noInnerEvents) {
    var _this = this;

    _classCallCheck(this, Channel);

    this._listeners = [];
    this._mute = false;
    this._accumulate = false;
    this._accumulatedEvents = [];
    this._name = name || '';
    this._noInnerEvents = Boolean(noInnerEvents);
    if (!noInnerEvents) {
      innerEvents.forEach(function (eventName) {
        return _this[eventName] = new Channel(eventName, true);
      });
    }
  }

  /**
   * Add listener for event
   * @param {Function} callback
   * @param {Object} [context]
   */


  _createClass(Channel, [{
    key: 'addListener',
    value: function addListener(callback, context) {
      this._pushListener(callback, context, false);
    }

    /**
     * Add once listener for event
     * @param {Function} callback
     * @param {Object} [context]
     */

  }, {
    key: 'addOnceListener',
    value: function addOnceListener(callback, context) {
      this._pushListener(callback, context, true);
    }

    /**
     * Remove listener from event
     * @param {Function} callback
     * @param {Object} [context]
     */

  }, {
    key: 'removeListener',
    value: function removeListener(callback, context) {
      this._ensureFunction(callback);
      var index = this._indexOfListener(callback, context);
      if (index >= 0) {
        this._listeners.splice(index, 1);
        this._dispatchInnerRemoveEvents.apply(this, arguments);
      }
    }

    /**
     * Is listener exist
     * @param {Function} callback
     * @param {Object} [context]
     * @returns {Boolean}
     */

  }, {
    key: 'hasListener',
    value: function hasListener(callback, context) {
      this._ensureFunction(callback);
      return this._indexOfListener(callback, context) >= 0;
    }

    /**
     * Are there any listeners
     * @returns {Boolean}
     */

  }, {
    key: 'hasListeners',
    value: function hasListeners() {
      return this._listeners.length > 0;
    }

    /**
     * Call all listeners with specified params
     */

  }, {
    key: 'dispatch',
    value: function dispatch() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (!this._mute) {
        this._listeners = this._listeners.filter(function (listener) {
          listener.callback.apply(listener.context, args);
          return !listener.once;
        });
      } else if (this._accumulate) {
        this._accumulatedEvents.push(args);
      }
    }

    /**
     * Mute channel
     * @param {Object} [options]
     * @param {Boolean} [options.accumulate] accumulate events and call listeners after .unmute()
     */

  }, {
    key: 'mute',
    value: function mute() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._mute = true;
      if (options.accumulate) {
        this._accumulate = true;
      } else {
        this._accumulate = false;
        this._accumulatedEvents = [];
      }
    }

    /**
     * Unmute channel
     */

  }, {
    key: 'unmute',
    value: function unmute() {
      this._mute = false;
      if (this._accumulate) {
        this._dispatchAccumulated();
        this._accumulate = false;
      }
    }

    /**
     * Ensure function
     * @param {Function} callback
     */

  }, {
    key: '_ensureFunction',
    value: function _ensureFunction(callback) {
      if (typeof callback !== 'function') {
        throw new Error('Channel ' + this._name + ': listener is not a function');
      }
    }

    /**
     * Dispatch inner events when listener is added
     * @private
     */

  }, {
    key: '_dispatchInnerAddEvents',
    value: function _dispatchInnerAddEvents() {
      if (!this._noInnerEvents) {
        this.onListenerAdded.dispatch.apply(this.onListenerAdded, arguments);
        if (this._listeners.length === 1) {
          this.onFirstListenerAdded.dispatch.apply(this.onFirstListenerAdded, arguments);
        }
      }
    }

    /**
     * Dispatch inner events when listener is removed
     * @private
     */

  }, {
    key: '_dispatchInnerRemoveEvents',
    value: function _dispatchInnerRemoveEvents() {
      if (!this._noInnerEvents) {
        this.onListenerRemoved.dispatch.apply(this.onListenerRemoved, arguments);
        if (this._listeners.length === 0) {
          this.onLastListenerRemoved.dispatch.apply(this.onLastListenerRemoved, arguments);
        }
      }
    }

    /**
     * Find listener index
     * @param {Function} callback
     * @param {Object} [context]
     * @private
     */

  }, {
    key: '_indexOfListener',
    value: function _indexOfListener(callback, context) {
      for (var i = 0; i < this._listeners.length; i++) {
        var listener = this._listeners[i];
        var equalCallbacks = listener.callback === callback;
        var emptyContexts = context === undefined && listener.context === undefined;
        var equalContexts = context === listener.context;
        if (equalCallbacks && (emptyContexts || equalContexts)) {
          return i;
        }
      }
    }

    /**
     * Dispatch accumulated events
     * @private
     */

  }, {
    key: '_dispatchAccumulated',
    value: function _dispatchAccumulated() {
      var _this2 = this;

      this._accumulatedEvents.forEach(function (args) {
        return _this2.dispatch.apply(_this2, args);
      });
      this._accumulatedEvents = [];
    }

    /**
     * Pushes listener
     * @param {Function} callback
     * @param {Object} context
     * @param {Boolean} once
     */

  }, {
    key: '_pushListener',
    value: function _pushListener(callback, context, once) {
      this._ensureFunction(callback);
      this._listeners.push({ callback: callback, context: context, once: once });
      this._dispatchInnerAddEvents.apply(this, arguments);
    }
  }]);

  return Channel;
}();

exports.default = Channel;
module.exports = exports['default'];