
type ChannelMethod = (callback: () => void, context?: any) => void;
type ChannelBooleanMethod = (callback: () => void, context?: any) => boolean;

export = Channel;

declare class Channel {
    static Subscription: any;
    constructor(name?: string, noInnerEvents?: boolean);
    addListener: ChannelMethod;
    addOnceListener: ChannelMethod;
    removeListener: ChannelMethod;
    removeAllListeners(): void;
    hasListener: ChannelBooleanMethod;
    hasListeners(): boolean;
    dispatch(...args: any[]): void;
    dispatchAsync(...args: any[]): void;
    mute(options?: object): void;
    unmute(): void;
}
