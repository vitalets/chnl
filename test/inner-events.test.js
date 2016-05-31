import test from 'ava';
import Channel from '../src/index';
import sinon from 'sinon';

test('should call listeners of onListenerAdded', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  const context = {};
  channel.onListenerAdded.addListener(spy);
  channel.addListener(spy2);
  channel.addListener(spy2, context);
  t.is(spy.callCount, 2);
  t.deepEqual(spy.getCall(0).args, [spy2]);
  t.deepEqual(spy.getCall(1).args, [spy2, context]);
});

test('should call listeners of onListenerRemoved', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  const notListener = sinon.spy();
  channel.onListenerRemoved.addListener(spy);
  channel.addListener(spy2);
  channel.removeListener(spy2);
  channel.removeListener(notListener);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [spy2]);
});

test('should call listeners of onFirstListenerAdded', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();
  channel.onFirstListenerAdded.addListener(spy);
  channel.addListener(spy2);
  channel.addListener(spy3);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [spy2]);
});

test('should call listeners of onLastListenerRemoved', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();
  channel.onLastListenerRemoved.addListener(spy);
  channel.addListener(spy2);
  channel.addListener(spy3);
  channel.removeListener(spy2);
  channel.removeListener(spy3);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [spy3]);
});
