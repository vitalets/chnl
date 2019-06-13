// see: https://github.com/avajs/ava/blob/v2.1.0/docs/recipes/babel.md#compile-sources
require('@babel/register')({
  ignore: ['node_modules/*', 'test/*'],
  presets: [
    ['@babel/preset-env'] // without {"modules": false} !
  ]
});
