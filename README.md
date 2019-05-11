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
        // make all files ending in .fakeql.json use the `fakeql-loader`
        test: /\.fakeql.json$/,
        loader: 'fakeql-loader',
      },
    ],
  },
};
```

```js
// index.js
const blogAPIhash = require('./blog-sample-data.fakeql.json');
// or, in ES6
// import blogAPIhash from './blog-sample-data.fakeql.json'

console.log(blogAPIendpoint); // 'b3b930ee57add5b17d2c9dd503029072'
```

### Usage with require statement loader prefix

```js
const blogAPIhash = require('fakeql-loader!./blog-sample-data.fakeql.json');

console.log(appConfig); // 'b3b930ee57add5b17d2c9dd503029072'
```

Both ways you get the hash of the API back, so you than can use it for example like this (with Apollo):

```js
const client = new ApolloClient({
  uri: `https://fakeql.com/graphql/${blogAPIhash}`
});
```

## Behaviour

The FakeQL Webpack loader will automatically create a new deployment of your sample data whenever the sample file changes.