import test from 'ava';
import Channel from '../src';
import sinon from 'sinon';

test('should emit onListenerAdded when .addListener() called', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  const context = {};
  channel.onListenerAdded.addListener(spy);
  channel.addListener(spy2);
  channel.addListener(spy2, context);
  t.is(spy.callCount, 2);
  t.deepEqual(spy.getCall(0).args, [spy2, undefined, false]);
  t.deepEqual(spy.getCall(1).args, [spy2, context, false]);
});

test('should emit onListenerRemoved when .removeListener() called', t => {
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

test('should emit onFirstListenerAdded when .addListener() called first time', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();
  channel.onFirstListenerAdded.addListener(spy);
  channel.addListener(spy2);
  channel.addListener(spy3);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [spy2, undefined, false]);
});

test('should emit onLastListenerRemoved when .removeListener() called on the last listener', t => {
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

test('should emit onListenerRemoved when .removeAllListeners() called', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  channel.onListenerRemoved.addListener(spy);
  channel.addListener(spy1);
  channel.addListener(spy2);
  channel.removeAllListeners();
  t.is(spy.callCount, 2);
  t.deepEqual(spy.getCall(0).args, [spy1]);
  t.deepEqual(spy.getCall(1).args, [spy2]);
});

test('should emit onLastListenerRemoved when .removeAllListeners() called', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  channel.onLastListenerRemoved.addListener(spy);
  channel.addListener(spy1);
  channel.addListener(spy2);
  channel.removeAllListeners();
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [spy2]);
});
