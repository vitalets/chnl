import test from 'ava';
import EventEmitter from '../src/event-emitter';
import sinon from 'sinon';

test.beforeEach(t => {
  t.context = new EventEmitter();
});

test('should call listeners on different events', t => {
  const spy1 = sinon.spy();
  const spy2 = sinon.spy();
  const spy3 = sinon.spy();
  t.context.on('event1', spy1);
  t.context.on('event2', spy2);
  t.context.on('event2', spy3);

  t.context.dispatch('event0', 'a');
  t.is(spy1.callCount, 0);
  t.is(spy2.callCount, 0);
  t.is(spy3.callCount, 0);

  t.context.dispatch('event1', 'b');
  t.is(spy1.callCount, 1);
  t.deepEqual(spy1.getCall(0).args, ['b']);
  t.is(spy2.callCount, 0);
  t.is(spy3.callCount, 0);

  t.context.dispatch('event2', 'c');
  t.is(spy1.callCount, 1);
  t.deepEqual(spy1.getCall(0).args, ['b']);
  t.is(spy2.callCount, 1);
  t.deepEqual(spy2.getCall(0).args, ['c']);
  t.is(spy3.callCount, 1);
  t.deepEqual(spy3.getCall(0).args, ['c']);
});

test('should should check and remove listeners', t => {
  const spy1 = sinon.spy();
  t.context.on('event1', spy1);
  t.true(t.context.has('event1', spy1));
  t.false(t.context.has('event0', spy1));
  t.context.off('event1', spy1);
  t.false(t.context.has('event1', spy1));
  t.context.dispatch('event1', 'b');
  t.is(spy1.callCount, 0);
});
