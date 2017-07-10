# chnl
[![Build Status](https://travis-ci.org/vitalets/chnl.svg?branch=master)](https://travis-ci.org/vitalets/chnl)
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
const myChannel = exports.myChannel = new Channel();

// dispatch event
setTimeout(() => myChannel.dispatch(data), 1000);
```

**module B**
```js
import moduleA from './moduleA';

// subscribe on channel and listen events
moduleA.myChannel.addListener(data => console.log('myChannel event come with data', data));
```

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
