
/**
 * Module dependencies.
 */

var compile = require('babel-core').transform;
var extend = require('extend');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * babel plugin
 *
 * @param {Object} o
 * @return {Function}
 */

function plugin(o){
  var opts = extend({}, plugin.defaults, o);

  // extract the onlyLocals option
  var onlyLocals = opts.onlyLocals;
  delete opts.onlyLocals;

  return function babel(file){
    if ('js' !== file.type) return;
    if (onlyLocals && file.remote()) return; // ignore any remotes

    // add more options that can only be found during runtime
    var options = extend({}, opts, {
      filename: file.path,
      filenameRelative: file.id,
      sourceRoot: file.root
    });

    var es5 = compile(file.src, options);
    file.src = es5.code;
  }
}

/**
 * default configuration options
 */

plugin.defaults = {
  // skips downloaded remotes (for compatibility reasons)
  onlyLocals: false,

  // so duo can include them in it's own source-map
  sourceMap: 'inline'
};
