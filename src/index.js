/**
 * Chnl entry point
 */

import Channel from './channel';
import EventEmitter from './event-emitter';
import Subscription from './subscription';

Channel.EventEmitter = EventEmitter;
Channel.Subscription = Subscription;

export {
  Channel as default,
  EventEmitter,
  Subscription,
};
