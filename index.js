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
   * @param {String} name
   * @param {Boolean} [noInnerEvents]
   */
  constructor (name, noInnerEvents) {
    this._listeners = [];
    this._mute = false;
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
    this._ensureFunction(callback);
    this._listeners.push({callback, context});
    this._dispatchInnerAddEvents.apply(this, arguments);
  }

  /**
   * Remove litener from event
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
  dispatch () {
    if (!this._mute) {
      this._listeners.forEach(listener => {
        listener.callback.apply(listener.context, arguments);
      });
    }
  }

  /**
   * Mute channel
   */
  mute () {
    this._mute = true;
  }

  /**
   * Unmute channel
   */
  unmute () {
    this._mute = false;
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
}
