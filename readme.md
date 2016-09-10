# Simple javascript channels
Implementation of channels (aka events, pub/sub, dispatcher) inspired and compatible with [Chrome extensions events API](https://developer.chrome.com/extensions/events#type-Event).

## Installation
```
npm i chnl --save
```

## Usage
```js
/**
 * module A
 */

// import es5 code
import Channel from 'chnl';

// import es6 code
import Channel from 'chnl/src';

// create channel
exports.onChanged = new Channel();
...

// dispatch event when needed
exports.onChanged.dispatch(data);

/**
 * module B
 */
 
// import module A 
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

## Channel API
* addListener
* removeListener
* hasListener
* hasListeners
* dispatch
* mute
* unmute

## EventEmitter
Library includes simple EventEmitter based on channels.  
Not all methods of original nodejs [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 
are supported but most popular:

* addListener / on
* removeListener / off
* hasListener / has
* dispatch / emit

Example:
```js

import {EventEmitter} from 'chnl';

// use as standalone object

const emitter = new EventEmitter();
emitter.on('event', data => console.log(data));
emitter.emit('event', 'hello world!'); // output 'hello world!'

// or as parent for inheritance

class MyClass extends EventEmitter {
  someMethod() {
    this.emit('event', 'hello world!')
  }
}

const myClass = new MyClass();
myClass.on('event', data => console.log(data));
myClass.someMethod(); // output 'hello world!'
