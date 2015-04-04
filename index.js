
/**
 * Module dependencies.
 */

var compile = require('babel-core').transform;

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
  if (!o) o = {};

  // extract the onlyLocals option
  var onlyLocals = o.onlyLocals || false;

  return function babel(file, entry) {
    if ('js' !== file.type) return;
    if (onlyLocals && file.remote()) return; // ignore any remotes

    var es5 = compile(file.src, {
      filename: file.path,
      filenameRelative: file.id,
      sourceRoot: file.root,
      sourceMap: !!file.duo.sourceMap() ? 'inline' : false
    });

    file.src = es5.code;
  }
}
