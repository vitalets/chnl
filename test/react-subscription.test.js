import test from 'ava';
import sinon from 'sinon';
import Channel from '../';

class TestComponent {
  constructor() {
    this.subscription = new Channel.ReactSubscription(this, [
      {channel: new Channel(), listener: sinon.spy()}
    ]);
    this.didMountSpy = sinon.spy();
    this.willUnmountSpy = sinon.spy();
  }

  componentDidMount() {
    this.didMountSpy();
  }

  componentWillUmount() {
    this.willUnmountSpy();
  }
}

test('should call subscription "on" method in "componentDidMount" callback', t => {
  const component = new TestComponent();
  const subscription = component.subscription;
  subscription.on = sinon.spy();
  t.is(subscription.on.callCount, 0);
  component.componentDidMount();
  t.is(subscription.on.callCount, 1);
});

test('should call base componentDidMount method', t => {
  const component = new TestComponent();
  t.is(component.didMountSpy.callCount, 0);
  component.componentDidMount();
  t.is(component.didMountSpy.callCount, 1);
});

test('should call subscription "off" method in "componentWillUnmount" callback', t => {
  const component = new TestComponent();
  const subscription = component.subscription;
  subscription.off = sinon.spy();
  t.is(subscription.off.callCount, 0);
  component.componentWillUnmount();
  t.is(subscription.off.callCount, 1);
});

test('should call base componentWillUnmount method', t => {
  const component = new TestComponent();
  t.is(component.willUnmountSpy.callCount, 0);
  component.componentWillUmount();
  t.is(component.willUnmountSpy.callCount, 1);
});
