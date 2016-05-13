# Simple and powerful javascript channels
Implementation of channels (events, pub/sub pattern) in plain javascript.  
API is inspired by [Chrome extensions events](https://developer.chrome.com/extensions/events#type-Event).

## Installation
```
npm i chnl --save
```

## Usage
```js
/**
 * module A
 */

// import chnl
import Channel from 'chnl';

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
