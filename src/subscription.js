/**
 * Subscription is utility class allowing dynamically attach/detach batch of listeners to event channels.
 *
 * Example:
   this._subscription = new Channel.Subscription([
   {
    channel: chrome.tabs.onUpdated,
    listener: this._onTabUpdated.bind(this)
   },
   {
    channel: document.getElementById('button'),
    event: 'click',
    listener: this._onButtonClick.bind(this)
   }
   ]);

   this._subscription.on(); // now listeners are attached

   this._subscription.off(); // now listeners are detached
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
