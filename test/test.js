/* eslint-env mocha */

const assert = require("assert");
const {rejects} = require("rejected-or-not");
const createRequireAsync = require("..");

function mustFail() {
  throw new Error("must fail");
}

describe("requireAsync", () => {
  const requireAsync = createRequireAsync(module);
  
  it("basic", () => {
    const FOO_PATH = require.resolve("./fixture/foo");
    return requireAsync(FOO_PATH)
      .then(foo => {
        assert.equal(foo.foo(), "foo");
        assert(FOO_PATH in require.cache);
        assert(module.children.includes(require.cache[FOO_PATH]));
        assert.equal(require("./fixture/foo"), foo);
      });
  });
  
  it("relative path", () => {
    return requireAsync("./fixture/foo.js")
      .then(foo => {
        assert.equal(foo.foo(), "foo");
      });
  });
  
  it("cached", () => {
    const bar = require("./fixture/bar");
    const BAR_PATH = require.resolve("./fixture/bar");
    return requireAsync(BAR_PATH)
      .then(asyncBar => {
        assert.equal(asyncBar, bar);
      });
  });
  
  it("cached non-child", () => {
    const baz = require("./fixture/baz");
    const BAZ_PATH = require.resolve("./fixture/baz/baz.js");
    assert(!module.children.includes(require.cache[BAZ_PATH]));
    return requireAsync(BAZ_PATH)
      .then(asyncBaz => {
        assert.equal(asyncBaz, baz);
        assert(module.children.includes(require.cache[BAZ_PATH]));
      });
  });
  
  it("BOM", () => {
    return requireAsync(require.resolve("./fixture/utf8-bom"))
      .then(foo => {
        assert.equal(foo.foo(), "foo");
      });
  });
  
  it("error", () => {
    const ERROR_PATH = require.resolve("./fixture/error");
    return requireAsync(ERROR_PATH)
      .then(mustFail)
      .catch(err => {
        assert(err instanceof SyntaxError);
        assert(!(ERROR_PATH in require.cache));
      });
  });
});

describe("anonymous requireAsync", () => {
  const requireAsync = createRequireAsync();
  
  it("basic", () => {
    return requireAsync(require.resolve("./fixture/foo"))
      .then(foo => {
        assert.equal(foo.foo(), "foo");
      });
  });
  
  it("no relative path", () => {
    return rejects(() => requireAsync("./fixture/foo.js"), TypeError);
  });
});
