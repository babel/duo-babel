
/**
 * Fake remote fixture that helps test that only local components are compiled
 * with babel.
 *
 * The idea here is that the code will throw an exception when compiled and
 * "use strict"; is added to the source code.
 */

module.exports = function sum(a, b, c, d, d) {
  return a + b + c;
};
