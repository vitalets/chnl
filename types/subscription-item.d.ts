
import Channel = require('./channel');

export = SubscriptionItem;

interface SubscriptionItemParams {
    channel: Channel;
    listener: Channel | ((...args: any[]) => any);
    event?: string;
}

declare class SubscriptionItem {
    constructor(params: SubscriptionItemParams);
    on(): void;
    off(): void;
}
