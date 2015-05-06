
var es5 = require('sum/es5@0.0.0');
var es6 = require('sum/es6@0.0.0');

module.exports = es5(1, 2, 3) === es6(1, 2, 3);
