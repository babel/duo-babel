
/**
 * Fake remote fixture that helps test that only local components are compiled
 * with babel.
 *
 * The idea here is that the code will throw an exception when compiled and
 * "use strict"; is added to the source code.
 */

function add(a, a, c) {
  return a + b + c;
}
