/**
 * Chnl entry point
 */

import Channel from './channel';
import EventEmitter from './event-emitter';

Channel.EventEmitter = EventEmitter;

export {
  Channel as default,
  EventEmitter,
};
