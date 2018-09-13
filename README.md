# chnl
[![Build Status](https://travis-ci.org/vitalets/chnl.svg?branch=master)](https://travis-ci.org/vitalets/chnl)
[![npm version](https://badge.fury.io/js/chnl.svg)](https://badge.fury.io/js/chnl)
[![license](https://img.shields.io/npm/l/chnl.svg)](https://www.npmjs.com/package/chnl)

Implementation of event channels (pub/sub, dispatcher, emitter) inspired and 
compatible with [Chrome extensions events API](https://developer.chrome.com/extensions/events#type-Event).

## Install
```
npm i chnl --save
```

## Docs
https://vitalets.github.io/chnl

## Usage
**foo.js**
```js
import Channel from 'chnl';

// create channel
export const onData = new Channel();

// subscribe to channel
onData.addListener(data => console.log(data));
```

**bar.js**
```js
import {onData} from './foo';

// dispatch event to channel
onData.dispatch({foo: 'bar'});
```

## License
MIT @ [Vitaliy Potapov](https://github.com/vitalets)
