node-require-async
==================

A require function in node, but an asynchronous one.

This library is built on top of node's builtin `require`, so they share the same module cache.

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

Changelog
---------

* 0.1.0 (May 22, 2018)

    - First release.
