const test = require('ava');
const sinon = require('sinon');
const Channel = require('../');

test('should call listeners', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const spy2 = sinon.spy();
  channel.addListener(spy);
  channel.addListener(spy2);
  channel.dispatch(1, 2);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [1, 2]);
  t.is(spy2.callCount, 1);
  t.deepEqual(spy2.getCall(0).args, [1, 2]);
});

test('should async call listener', t => {
  const clock = sinon.useFakeTimers();
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  channel.dispatchAsync(1, 2);
  t.is(spy.callCount, 0);
  clock.tick(0);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [1, 2]);
  clock.restore();
});

test('should accumulate async calls', t => {
  const clock = sinon.useFakeTimers();
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  channel.mute({accumulate: true});
  channel.dispatchAsync(1, 2);
  t.is(spy.callCount, 0);
  clock.tick(0);
  t.is(spy.callCount, 0);
  channel.unmute();
  t.is(spy.callCount, 0);
  clock.tick(0);
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, [1, 2]);
  clock.restore();
});

test('should not call listener after remove', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  channel.removeListener(spy);
  channel.dispatch(123);
  t.is(spy.callCount, 0);
});

test('should call listener with valid context', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const context = {a: 1};
  channel.addListener(spy, context);
  channel.dispatch(123);
  t.is(spy.getCall(0).thisValue, context);
});

test('should remove listener with the same context', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const context = {};
  channel.addListener(spy, context);
  channel.removeListener(spy, context);
  channel.dispatch(123);
  t.is(spy.callCount, 0);
});

test('should not remove listener with another context', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const context = {};
  channel.addListener(spy, context);
  channel.removeListener(spy);
  channel.removeListener(spy, {x: 1});
  channel.dispatch(123);
  t.is(spy.callCount, 1);
});

test('should remove all listeners', t => {
  const channel = new Channel();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  channel.addListener(spy1);
  channel.addListener(spy2);
  channel.removeAllListeners();
  t.false(channel.hasListener(spy1));
  t.false(channel.hasListener(spy2));
});

test('should not call listener after mute and call after unmute', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  channel.mute();
  channel.dispatch(123);
  t.is(spy.callCount, 0);
  channel.unmute();
  channel.dispatch(123);
  t.is(spy.callCount, 1);
});

test('should check listener existence', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  t.true(channel.hasListener(spy));
  t.true(channel.hasListeners());
  channel.removeListener(spy);
  t.false(channel.hasListener(spy));
  t.false(channel.hasListeners());
});

test('should accumulate events during mute and call them after unmute', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  channel.mute({accumulate: true});
  channel.dispatch(123);
  channel.dispatch(123);
  channel.dispatch(123);
  t.is(spy.callCount, 0);
  channel.unmute();
  t.is(spy.callCount, 3);
});

test('should call once listener only once', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  const context = {a: 1};
  channel.addOnceListener(spy, context);
  channel.dispatch(1);
  channel.dispatch(2);
  channel.dispatch(3);
  t.is(spy.callCount, 1);
  t.is(spy.getCall(0).thisValue, context);
});

test('should correctly add and remove listeners in dispatching loop', t => {
  const channel = new Channel();
  const spy1 = sinon.spy();
  const spy2 = sinon.spy(() => {
    channel.addListener(spy4);
    channel.removeListener(spy2);
  });
  const spy3 = sinon.spy();
  const spy4 = sinon.spy();
  channel.addListener(spy1);
  channel.addListener(spy2);
  channel.addListener(spy3);
  channel.dispatch();
  t.is(spy1.callCount, 1);
  t.is(spy2.callCount, 1);
  t.is(spy3.callCount, 1);
  t.is(spy4.callCount, 0);
  t.truthy(channel.hasListener(spy1));
  t.falsy(channel.hasListener(spy2));
  t.truthy(channel.hasListener(spy3));
  t.truthy(channel.hasListener(spy4));
});

test('should add channel as listener', t => {
  const clock = sinon.useFakeTimers();
  const channel = new Channel();
  const proxyChannel = new Channel();
  const spy = sinon.spy();
  proxyChannel.addListener(spy);
  channel.addListener(proxyChannel);
  t.is(spy.callCount, 0);
  channel.dispatch('foo');
  t.is(spy.callCount, 1);
  t.deepEqual(spy.getCall(0).args, ['foo']);
  channel.dispatchAsync('bar');
  t.is(spy.callCount, 1);
  clock.tick(0);
  t.is(spy.callCount, 2);
  t.deepEqual(spy.getCall(1).args, ['bar']);
  clock.restore();
});

test('should throw when duplicating channel listeners', t => {
  const channel = new Channel('channel');
  const listener = () => {};
  channel.addListener(listener);

  t.throws(() => channel.addListener(listener));
});

test('should not throw when duplicating channel listeners with different context', t => {
  const channel = new Channel('channel');
  const listener = () => {};
  const context1 = {};
  const context2 = {};
  channel.addListener(listener, context1);

  t.notThrows(() => channel.addListener(listener, context2));
});
