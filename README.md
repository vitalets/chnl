# Chnl
> Chrome compatible JavaScript channels

[![npm version](https://badge.fury.io/js/chnl.svg)](https://badge.fury.io/js/chnl)

Implementation of channels (aka events, pub/sub, dispatcher) inspired and 
compatible with [Chrome extensions events API](https://developer.chrome.com/extensions/events#type-Event).  
Additionally, there are some extra features (e.g. passing `context` with listener) and utility classes
that makes life easier.

## Installation
```
npm i chnl --save
```

## Documentation
https://vitalets.github.io/chnl

## Example
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
