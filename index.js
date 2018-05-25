const fs = require("fs");
const Module = require("module");
const path = require("path");
const util = require("util");

const readFile = util.promisify(fs.readFile);

function stripBOM(text) {
  if (text.startsWith("\ufeff")) {
    return text.slice(1);
  }
  return text;
}

function createRequireAsync(parent) {
  // https://github.com/nodejs/node/blob/4f0ab76b6c29da74b29125a3ec83bb06e77c2aad/lib/internal/modules/cjs/loader.js#L502
  return filename => {
    if (parent && parent.filename) {
      filename = path.resolve(path.dirname(parent.filename), filename);
    } else if (path.isAbsolute(filename)) {
      filename = path.resolve(filename);
    } else {
      return Promise.reject(new TypeError(`'filename' must be an absolute path: ${filename}`));
    }
    // note that currently, it accepts a filename instead of a request id.
    const cachedModule = Module._cache[filename];
    if (cachedModule) {
      // update children
      const children = parent && parent.children;
      if (children && !children.includes(cachedModule)) {
        children.push(cachedModule);
      }
      return Promise.resolve(cachedModule.exports);
    }
    const mod = new Module(filename, parent);
    Module._cache[filename] = mod;
    mod.filename = filename;
    mod.paths = Module._nodeModulePaths(path.dirname(filename));
    return readFile(filename, "utf8")
      .then(content => {
        mod._compile(stripBOM(content), filename);
        return mod.exports;
      })
      .catch(err => {
        delete Module._cache[filename];
        throw err;
      });
  };
}

module.exports = createRequireAsync;
