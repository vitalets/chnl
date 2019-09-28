
type ChannelMethod = (callback: (...args: any[]) => any, context?: any) => void;
type ChannelBooleanMethod = (callback: (...args: any[]) => any, context?: any) => boolean;
type ProxyChannelMethod<T = void> = (channel: Channel) => T;

export = Channel;

declare class Channel {
    static Subscription: any;
    constructor(name?: string, noInnerEvents?: boolean);
    addListener: ChannelMethod;
    addOnceListener: ChannelMethod;
    addProxyChannel: ProxyChannelMethod;
    removeListener: ChannelMethod;
    removeAllListeners(): void;
    removeProxyChannel: ProxyChannelMethod;
    removeAllProxyChannels(): void;
    hasListener: ChannelBooleanMethod;
    hasListeners(): boolean;
    hasProxyChannel: ProxyChannelMethod<boolean>;
    hasProxyChannels(): boolean;
    dispatch(...args: any[]): void;
    dispatchAsync(...args: any[]): void;
    mute(options?: object): void;
    unmute(): void;
    onListenerAdded: Channel;
    onListenerRemoved: Channel;
    onProxyChannelAdded: Channel;
    onProxyChannelRemoved: Channel;
    onFirstListenerAdded: Channel;
    onLastListenerRemoved: Channel;
    onFirstProxyChannelAdded: Channel;
    onLastProxyChannelRemoved: Channel;
}
