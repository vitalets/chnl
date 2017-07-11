# chnl
[![Build Status](https://travis-ci.org/vitalets/chnl.svg?branch=master)](https://travis-ci.org/vitalets/chnl)
[![npm version](https://badge.fury.io/js/chnl.svg)](https://badge.fury.io/js/chnl)
[![license](https://img.shields.io/npm/l/chnl.svg)](https://www.npmjs.com/package/chnl)

> Chrome compatible JavaScript event channels

Implementation of event channels (pub/sub, dispatcher, emitter) inspired and 
compatible with [Chrome extensions events API](https://developer.chrome.com/extensions/events#type-Event).

## Install
```
npm i chnl --save
```

## Docs
https://vitalets.github.io/chnl

## Usage
**module A**
```js
import Channel from 'chnl';

// create channel
export const myChannel = new Channel();

// dispatch event with data
setTimeout(() => {
  myChannel.dispatch({foo: 'bar'});
}, 1000);
```

**module B**
```js
import {myChannel} from './moduleA';

// subscribe on channel and log event data
myChannel.addListener(data => console.log('myChannel event come with data', data));
```

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
