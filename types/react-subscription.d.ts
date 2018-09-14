
import Subscription = require('./subscription');
import SubscriptionItem = require('./subscription-item');

export = ReactSubscription;

declare class ReactSubscription extends Subscription {
    constructor(component: object, items: SubscriptionItem[]);
}
