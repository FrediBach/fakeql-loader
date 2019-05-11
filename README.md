# fakeql-loader

A Webpack loader for [FakeQL](https://fakeql.com)

## Install

```sh
$ npm install fakeql-loader --save-dev
```

## Usage

### Usage with preconfigured loader

**webpack.config.js**

```js
// webpack.config.js
module.exports = {
  entry: './index.js',
  output: {
    /* ... */
  },
  module: {
    loaders: [
      {
        // make all files ending in .fakeql use the `fakeql-loader`
        test: /\.fakeql$/,
        loader: 'fakeql-loader',
      },
    ],
  },
};
```

```js
// index.js
const blogAPIhash = require('./extended-blog-sample-data.fakeql');
// or, in ES6
// import blogAPIhash from './extended-blog-sample-data.fakeql'

console.log(blogAPIendpoint); // 'b3b930ee57add5b17d2c9dd503029072'
```

Where your extended JSON is saved in a file with the name `extended-blog-sample-data.fakeql`.

### Usage with require statement loader prefix

```js
const blogAPIhash = require('fakeql-loader!./extended-blog-sample-data.fakeql');

console.log(appConfig); // 'b3b930ee57add5b17d2c9dd503029072'
```

Both ways you get the hash of the API back (or false if anything fails), so you than can use it for example like this (with Apollo):

```js
const client = new ApolloClient({
  uri: `https://fakeql.com/graphql/${blogAPIhash}`
});
```

## Behaviour

The FakeQL Webpack loader will automatically create a new deployment of your sample data whenever the sample file changes.