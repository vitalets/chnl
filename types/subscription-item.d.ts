
import Channel = require('./channel');

export interface SubscriptionItemParams {
    channel: Channel;
    listener: (...args: any[]) => any;
    event?: string;
}

export class SubscriptionItem {
    constructor(params: SubscriptionItemParams);
    on(): void;
    off(): void;
}
