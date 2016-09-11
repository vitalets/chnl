/**
 * Subscription is a class allowing easily attach/detach batch of listeners to event channels.
 *
 * Example:
 *
 * this._listeners = new Channel.Subscription([
 *   {
 *     channel: chrome.tabs.onUpdated,
 *     listener: this._onTabUpdated.bind(this)
 *   },
 *   {
 *     channel: document.getElementById('button'),
 *     event: 'click',
 *     listener: this._onButtonClick.bind(this)
 *   }
 * ]);
 * ...
 * this._listeners.on(); // now is listening events
 * ...
 * this._listeners.off(); // now is NOT listening
 *
 */

import SubscriptionItem from './subscription-item';

export default class Subscription {
  /**
   * Constructor
   *
   * @param {Array<{channel, event, listener}>} items
   */
  constructor(items) {
    this._items = items.map(params => new SubscriptionItem(params));
  }

  /**
   * Turn on all listeners
   *
   * @returns {Subscription}
   */
  on() {
    this._items.forEach(item => item.on());
    return this;
  }

  /**
   * Turn off all listeners
   *
   * @returns {Subscription}
   */
  off() {
    this._items.forEach(item => item.off());
    return this;
  }
}
