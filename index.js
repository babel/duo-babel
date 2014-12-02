
/**
 * Module dependencies.
 */

var compile = require('6to5').transform;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * 6to5 plugin
 *
 * @param {Object} opts
 * @return {Function}
 */

function plugin(opts){
  opts = opts || {};

  var onlyLocals = !!opts.onlyLocals;
  delete opts.onlyLocals;

  return function duo6to5(file){
    if ('js' !== file.type) return;
    if (onlyLocals && file.id.indexOf('@') > -1) return; // ignore any remotes
    var es5 = compile(file.src, opts);
    file.src = es5.code;
  }
}
