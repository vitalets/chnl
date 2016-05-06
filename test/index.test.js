import test from 'ava';
import Channel from '../index';
import sinon from 'sinon';

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

test('should check listener existance', t => {
  const channel = new Channel();
  const spy = sinon.spy();
  channel.addListener(spy);
  t.true(channel.hasListener(spy));
  t.true(channel.hasListeners());
  channel.removeListener(spy);
  t.false(channel.hasListener(spy));
  t.false(channel.hasListeners());
});
