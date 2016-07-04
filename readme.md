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

## API
* addListener
* removeListener
* hasListener
* hasListeners
* dispatch
* mute
* unmute
