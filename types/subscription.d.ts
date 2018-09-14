
import SubscriptionItem = require('./subscription-item');

export = Subscription;

declare class Subscription {
    constructor(items: SubscriptionItem[]);
    on(): void;
    off(): void;
}
