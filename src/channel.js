const innerEvents = [
  'onListenerAdded',
  'onListenerRemoved',
  'onFirstListenerAdded',
  'onLastListenerRemoved',
];

/**
 * Channel of particular events. Allows attach/detach listeners and dispatch event data.
 *
 * @param {String} [name]
 * @param {Boolean} [noInnerEvents]
 *
 * @example
 * import Channel from 'chnl';
 *
 * // create channel
 * const onMyEvent = new Channel();
 * // listen
 * onMyEvent.addListener(data => console.log(data));
 * // dispatch data
 * onMyEvent.dispatch(data);
 */
export default class Channel {
  constructor(name, noInnerEvents) {
    this._listeners = [];
    this._proxyChannels = [];
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
   * Add listener for event.
   * @param {Function} callback
   * @param {Object} [context]
   */
  addListener(callback, context) {
    this._pushListener(callback, context, false);
  }

  /**
   * Add once listener for event.
   * @param {Function} callback
   * @param {Object} [context]
   */
  addOnceListener(callback, context) {
    this._pushListener(callback, context, true);
  }

  /**
   * Register the channel to which events should be proxied.
   * @param {Channel} channel
   */
  proxyTo(channel) {
    this._ensureChannel(channel);
    this.addListener((...args) => channel.dispatch(...args));
  }

  /**
   * Remove listener from event.
   * @param {Function} callback
   * @param {Object} [context]
   */
  removeListener(callback, context) {
    this._ensureFunction(callback);
    const index = this._indexOfListener(callback, context);
    if (index >= 0) {
      this._spliceListener(index);
    }
  }

  /**
   * Remove all listeners from channel.
   */
  removeAllListeners() {
    while (this.hasListeners()) {
      this._spliceListener(0);
    }
  }

  /**
   * Is listener exist.
   * @param {Function} callback
   * @param {Object} [context]
   * @returns {Boolean}
   */
  hasListener(callback, context) {
    this._ensureFunction(callback);
    return this._indexOfListener(callback, context) >= 0;
  }

  /**
   * Are there any listeners.
   * @returns {Boolean}
   */
  hasListeners() {
    return this._listeners.length > 0;
  }

  /**
   * Call all listeners with specified params.
   */
  dispatch(...args) {
    this._invokeListeners({args, async: false});
  }

  /**
   * Call all listeners with specified params asynchronously.
   */
  dispatchAsync(...args) {
    this._invokeListeners({args, async: true});
  }

  /**
   * Mute channel.
   * @param {Object} [options]
   * @param {Boolean} [options.accumulate] accumulate events and call listeners after .unmute()
   */
  mute(options = {}) {
    this._mute = true;
    if (options.accumulate) {
      this._accumulate = true;
    } else {
      this._accumulate = false;
      this._accumulatedEvents = [];
    }
  }

  /**
   * Unmute channel.
   */
  unmute() {
    this._mute = false;
    if (this._accumulate) {
      this._dispatchAccumulated();
      this._accumulate = false;
    }
  }

  /**
   * @param {Object} options
   * @param {Array} options.args
   * @param {Boolean} [options.async]
   * @private
   */
  _invokeListeners(options = {args: [], async: false}) {
    if (!this._mute) {
      const listnersToInvoke = this._listeners.slice();
      listnersToInvoke.forEach(listener => {
        this._invokeListener(listener, options);
        if (listener.once) {
          this.removeListener(listener.callback, listener.context)
        }
      });
    } else if (this._accumulate) {
      this._accumulatedEvents.push(options);
    }
  }

  /**
   * @param {Object} listener
   * @param {Object} options
   * @param {Array} options.args
   * @param {Boolean} options.async
   * @private
   */
  _invokeListener(listener, options) {
    if (options.async) {
      setTimeout(() => listener.callback.apply(listener.context, options.args), 0);
    } else {
      listener.callback.apply(listener.context, options.args);
    }
  }

  /**
   * Ensure function.
   * @param {Function} callback
   * @private
   */
  _ensureFunction(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Channel ' + this._name + ': listener is not a function');
    }
  }

  /**
   * Ensure Channel.
   * @param {Channel} channel
   * @private
   */
  _ensureChannel(channel) {
    if (!(channel instanceof Channel)) {
      throw new Error('Channel ' + this._name + ': proxyChannel doesn\'t instance of Channel');
    }
  }

  /**
   * Dispatch inner events when listener is added.
   * @private
   */
  _dispatchInnerAddEvents() {
    if (!this._noInnerEvents) {
      this.onListenerAdded.dispatch.apply(this.onListenerAdded, arguments);
      if (this._listeners.length === 1) {
        this.onFirstListenerAdded.dispatch.apply(this.onFirstListenerAdded, arguments);
      }
    }
  }

  /**
   * Dispatch inner events when listener is removed.
   * @private
   */
  _dispatchInnerRemoveEvents() {
    if (!this._noInnerEvents) {
      this.onListenerRemoved.dispatch.apply(this.onListenerRemoved, arguments);
      if (this._listeners.length === 0) {
        this.onLastListenerRemoved.dispatch.apply(this.onLastListenerRemoved, arguments);
      }
    }
  }

  /**
   * Find listener index.
   * @param {Function} callback
   * @param {Object} [context]
   * @private
   */
  _indexOfListener(callback, context) {
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
   * Dispatch accumulated events.
   * @private
   */
  _dispatchAccumulated() {
    this._accumulatedEvents.forEach(options => this._invokeListeners(options));
    this._accumulatedEvents = [];
  }

  /**
   * Pushes listener.
   * @param {Function} callback
   * @param {Object} context
   * @param {Boolean} once
   * @private
   */
  _pushListener(callback, context, once) {
    this._ensureFunction(callback);
    this._listeners.push({callback, context, once});
    this._dispatchInnerAddEvents.apply(this, arguments);
  }

  /**
   * Splice listener under index.
   * @param {Number} index
   * @private
   */
  _spliceListener(index) {
    const listener = this._listeners[index];
    this._listeners.splice(index, 1);
    const args = [listener.callback];
    if (listener.context) {
      args.push(listener.context);
    }
    this._dispatchInnerRemoveEvents.apply(this, args);
  }
}
