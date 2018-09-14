
type EventEmitterMethod = (event: string, callback: () => void, context?: any) => void;
type EventEmitterBooleanMethod = (event: string, callback: () => void, context?: any) => boolean;

export = EventEmitter;

declare class EventEmitter {
    constructor();
    addListener: EventEmitterMethod;
    addOnceListener: EventEmitterMethod;
    on: EventEmitterMethod;
    once: EventEmitterMethod;
    removeListener: EventEmitterMethod;
    off: EventEmitterMethod;
    hasListener: EventEmitterBooleanMethod;
    has: EventEmitterBooleanMethod;
    hasListeners(event: string): boolean;
    dispatch(event: string, ...args: any[]): void;
    emit(event: string, ...args: any[]): void;
}
