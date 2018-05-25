node-require-async
==================

[![Build Status](https://travis-ci.org/eight04/node-require-async.svg?branch=master)](https://travis-ci.org/eight04/node-require-async)
[![Coverage Status](https://coveralls.io/repos/github/eight04/node-require-async/badge.svg?branch=master)](https://coveralls.io/github/eight04/node-require-async?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=node-require-async)](https://packagephobia.now.sh/result?p=node-require-async)

A require function in node, but an asynchronous one.

This library is built on top of node's builtin `Module`, so it shares the module cache with `require` (*It is not a wrapper function around builtin `require`*).

Installation
------------

```
npm install node-require-async
```

Example
-------
*entry.js*
```js
const requireAsync = require("node-require-async")(module);

requireAsync(require.resolve("./foo"))
  .then(foo => {
    foo.foo();
  });
```

*foo.js*
```js
module.exports = {foo: () => console.log("foo")};
```

```sh
$ node entry.js
foo
```

API reference
-------------

This module exports a single function.

### requireAsyncFactory(parentModule?): requireAsync function

You usually pass `module` as the `parentModule` parameter. `requireAsync` would help you setup `parentModule.children` when a module is loaded.

### requireAsync(filename): moduleExports

Note that this function accepts a filename not a moduleId, which means that you have to resolve the moduleId into filename before passing it to `requireAsync`:

```js
const filename = require.resolve("./foo"); // "/path/to/foo.js"
requireAsync(filename).then(...)
```

Since builtin `require.resolve` is blocking, you may need other libraries to resolve filename asynchronously.

If `parentModule` exists, `filename` would be resolved as:

```js
path.resolve(path.dirname(parentModule.filename), filename)
```

Changelog
---------

* 0.1.2 (May 25, 2018)

  - Add: support relative path when `parentModule` is set.

* 0.1.1 (May 22, 2018)

  - Fix: use files array.

* 0.1.0 (May 22, 2018)

  - First release.
