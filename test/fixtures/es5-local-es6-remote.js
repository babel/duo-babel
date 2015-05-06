
var sum = require('sum/es6@0.0.0');

module.exports = sum(1, 2, 3);


// this will throw an exception in strict mode, which tells us it's been transpiled
function noop(a, a) {}
