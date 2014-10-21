
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
  return function(file){
    if ('js' !== file.type)  return;
    var es5 = compile(file.src, opts);
    file.src = es5.code;
  }
}

