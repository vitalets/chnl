/**
 * ReactSubscription is an utility class that extends Subscription class and allows to subscribe/unsubscribe
 * listeners in ReactComponent callbacks - componentDidMount/componentWillUnmount
 * Example:
 * Before:
     class Button extends React.Component {
      constructor() {
        super();
        this.subscription = new Channel.Subscription([
          {channel: onNewData, listener: this.handleNewData.bind(this)}
        ]);
      }
      componentDidMount() {
        this.subscription.on();
      }
      componentWillUnmount() {
        this.subscription.off();
      }
    }

     After:

     class Button extends React.Component {
      constructor() {
        super();
        new Channel.ReactSubscription(this, [
          {channel: onNewData, listener: this.handleNewData.bind(this)}
        ]);
      }
    }
 */

import Subscription from './subscription';

export default class ReactSubscription extends Subscription {
  /**
   * Constructor
   *
   * @param {ReactComponent} component
   * @param {Array<{channel, event, listener}>} items
   */
  constructor(component, items) {
    super(items);
    this._overrideComponentCallback(component, 'componentDidMount', 'on');
    this._overrideComponentCallback(component, 'componentWillUnmount', 'off');
  }

  /**
   * @param {ReactComponent} component
   * @param {String} callbackName
   * @param {String} methodName
   * @private
   */
  _overrideComponentCallback(component, callbackName, methodName) {
    const baseCallback = component[callbackName];
    component[callbackName] = (...args) => {
      this[methodName]();
      if (typeof baseCallback === 'function') {
        return baseCallback.apply(component, args);
      }
    };
  }
}
