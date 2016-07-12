/**
 * Channel
 */

const innerEvents = [
  'onListenerAdded',
  'onListenerRemoved',
  'onFirstListenerAdded',
  'onLastListenerRemoved'
];

export default class Channel {
  /**
   * Constructor
   * @param {String} [name]
   * @param {Boolean} [noInnerEvents]
   */
  constructor (name, noInnerEvents) {
    this._listeners = [];
    this._mute = false;
    this._accumulate = false;
    this._accumulatedEvents = [];
    this._name = name || '';
    this._noInnerEvents = Boolean(noInnerEvents);
    if (!noInnerEvents) {
      innerEvents.forEach(eventName => this[eventName] = new Channel(eventName, true));
    }
  }

  /**
   * Add listener for event
   * @param {Function} callback
   * @param {Object} [context]
   */
  addListener (callback, context) {
    this._pushListener(callback, context, false);
  }

  /**
   * Add once listener for event
   * @param {Function} callback
   * @param {Object} [context]
   */
  addOnceListener (callback, context) {
    this._pushListener(callback, context, true);
  }

  /**
   * Remove listener from event
   * @param {Function} callback
   * @param {Object} [context]
   */
  removeListener (callback, context) {
    this._ensureFunction(callback);
    const index = this._indexOfListener(callback, context);
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
  hasListener (callback, context) {
    this._ensureFunction(callback);
    return this._indexOfListener(callback, context) >= 0;
  }

  /**
   * Are there any listeners
   * @returns {Boolean}
   */
  hasListeners () {
    return this._listeners.length > 0;
  }

  /**
   * Call all listeners with specified params
   */
  dispatch (...args) {
    if (!this._mute) {
      // ToDo: block adding/removing listeners to channel (throw an error) during dispatch operation
      const listnersToInvoke = this._listeners.slice();
      listnersToInvoke.forEach(listener => {
        listener.callback.apply(listener.context, args);
        if (listener.once) {
          this.removeListener(listener.callback, listener.context)
        }
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
  mute (options = {}) {
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
  unmute () {
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
  _ensureFunction (callback) {
    if (typeof callback !== 'function') {
      throw new Error('Channel ' + this._name + ': listener is not a function');
    }
  }

  /**
   * Dispatch inner events when listener is added
   * @private
   */
  _dispatchInnerAddEvents () {
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
  _dispatchInnerRemoveEvents () {
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
  _indexOfListener (callback, context) {
    for (let i = 0; i < this._listeners.length; i++) {
      const listener = this._listeners[i];
      const equalCallbacks = listener.callback === callback;
      const emptyContexts = context === undefined && listener.context === undefined;
      const equalContexts = context === listener.context;
      if (equalCallbacks && (emptyContexts || equalContexts)) {
        return i;
      }
    }
  }

  /**
   * Dispatch accumulated events
   * @private
   */
  _dispatchAccumulated () {
    this._accumulatedEvents.forEach(args => this.dispatch.apply(this, args));
    this._accumulatedEvents = [];
  }

  /**
   * Pushes listener
   * @param {Function} callback
   * @param {Object} context
   * @param {Boolean} once
   */
  _pushListener (callback, context, once) {
    this._ensureFunction(callback);
    this._listeners.push({callback, context, once});
    this._dispatchInnerAddEvents.apply(this, arguments);
  }
}
