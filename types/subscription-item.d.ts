
import Channel = require('./channel');
import {Listener} from './general';

export = SubscriptionItem;

interface SubscriptionItemParams {
    channel: Channel;
    listener: Listener;
    event?: string;
}

declare class SubscriptionItem {
    constructor(params: SubscriptionItemParams);
    on(): void;
    off(): void;
}
