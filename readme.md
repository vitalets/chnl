# Chrome compatible javascript channels

[![npm version](https://badge.fury.io/js/chnl.svg)](https://badge.fury.io/js/chnl)

Implementation of channels (aka events, pub/sub, dispatcher) inspired and 
compatible with [Chrome extensions events API](https://developer.chrome.com/extensions/events#type-Event).  
Additionally, there are some extra features (e.g. passing `context` with listener) and utility classes
that makes life easier.

## Installation
```
npm i chnl --save
```

## Classes overview
* [Channel](#channel) - chrome-like event channel
* [EventEmitter](#eventemitter) - nodejs-like event emitter based on channels
* [Subscription](#subscription) - class allowing to dynamically attach/detach batch of listeners

## Channel
Channel is class that can attach/detach listeners and dispatch data to them.
This allows to make more independent modules that just produce events in outer world.   
API:  

* addListener
* removeListener
* hasListener
* hasListeners
* dispatch
* dispatchAsync
* mute
* unmute

Example:

**module A**
```js
import Channel from 'chnl';

// create channel
exports.onChanged = new Channel();

// dispatch event (and don't care if there module B and what it will do with event)
exports.onChanged.dispatch(data);

// dispatch event asynchronously via setTimeout(..., 0);
exports.onChanged.dispatchAsync(data);
```

**module B**
```js
import moduleA from './moduleA';

// subscribe on channel
moduleA.onChanged.addListener(data => {
  console.log('moduleA.onChanged', data);
});

// subscribe once
moduleA.onChanged.addOnceListener(data => {
  console.log('moduleA.onChanged once', data);
});

// mute channel (optionally you can accumulate events to dispatch them after unmute) 
moduleA.onChanged.mute({accumulate: true});

// unmute channel 
moduleA.onChanged.unmute();
```

## EventEmitter
EventEmitter is basically a group of channels with common api.  
The main difference from single channel is that each method takes additional `event` argument.  
Not all methods of original nodejs [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 
are supported but most needed:

* addListener / on
* removeListener / off
* hasListener / has
* dispatch / emit

Example:
```js
import Channel from 'chnl';

// use as standalone object
const emitter = new Channel.EventEmitter();
emitter.on('event', data => console.log(data));
emitter.emit('event', 'hello world!'); // output 'hello world!'

// use as parent for some class
class MyClass extends Channel.EventEmitter {
  someMethod() {
    this.emit('event', 'hello world!')
  }
}

const myClass = new MyClass();
myClass.on('event', data => console.log(data));
myClass.someMethod(); // output 'hello world!'
```

## Subscription
Subscription is utility class allowing dynamically attach/detach batch of listeners to event channels.  
You pass array of `{channel: ..., event: ..., listener: ...}` to constructor and then manage it via two methods:

* on
* off

Example:
```js
import Channel from 'chnl';

this._subscription = new Channel.Subscription([
    {
     channel: chrome.tabs.onUpdated,
     listener: this._onTabUpdated.bind(this)
    },
    {
     channel: document.getElementById('button'),
     event: 'click',
     listener: this._onButtonClick.bind(this)
    }
]);

this._subscription.on(); // now listeners are attached

this._subscription.off(); // now listeners are detached
```
