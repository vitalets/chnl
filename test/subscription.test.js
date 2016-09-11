import test from 'ava';
import Channel, {Subscription, EventEmitter} from '../src';
import sinon from 'sinon';

test('should manage listeners of channel', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const subscription = new Subscription([
    {
      channel: channel,
      listener: spy,
    }
  ]);
  channel.dispatch('a');
  t.is(spy.callCount, 0);

  subscription.on();
  channel.dispatch('a');
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, ['a']);

  subscription.off();
  channel.dispatch('a');
  t.is(spy.callCount, 1);
});

test('should manage listeners of event-emitter', t => {
  const emitter = new EventEmitter();
  const spy = sinon.spy();
  const subscription = new Subscription([
    {
      channel: emitter,
      event: 'event',
      listener: spy,
    }
  ]);
  emitter.dispatch('event', 'a');
  t.is(spy.callCount, 0);

  subscription.on();
  emitter.dispatch('event', 'a');
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, ['a']);

  emitter.dispatch('another event', 'b');
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, ['a']);

  subscription.off();
  emitter.dispatch('event', 'b');
  t.is(spy.callCount, 1);
});

test('should throw in case of incorrect channel', t => {
  t.throws(() => {
    new Subscription([
      {
        channel: 'abc',
      }
    ]);
  }, 'Channel should be object');
});

test('should throw in case of incorrect listener', t => {
  t.throws(() => {
    new Subscription([
      {
        channel: new Channel(),
        listener: 'abc',
      }
    ]);
  }, 'Listener should be function');
});

test('should throw in case of incorrect event', t => {
  t.throws(() => {
    new Subscription([
      {
        channel: new Channel(),
        listener: 'abc',
        event: {},
      }
    ]);
  }, 'Event should be string');
});
