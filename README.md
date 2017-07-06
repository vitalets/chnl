# chnl
[![npm version](https://badge.fury.io/js/chnl.svg)](https://badge.fury.io/js/chnl)
[![license](https://img.shields.io/npm/l/chnl.svg)](https://www.npmjs.com/package/chnl)

> Chrome compatible JavaScript event channels

Implementation of event channels (aka pub/sub, dispatcher, emitter) inspired and 
compatible with [Chrome extensions events API](https://developer.chrome.com/extensions/events#type-Event).

## Installation
```
npm i chnl --save
```

## Documentation
https://vitalets.github.io/chnl

## Usage
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

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
