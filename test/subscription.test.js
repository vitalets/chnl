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
