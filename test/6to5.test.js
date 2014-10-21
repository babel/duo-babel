
/**
 * Module Dependencies
 */

var read = require('fs').readFileSync;
var join = require('path').join;
var assert = require('assert');
var to5 = require('..');
var Duo = require('duo');

/**
 * Tests
 */

describe('duo-6to5', function() {
  it('should compile .js', function(done) {
    Duo(__dirname)
      .entry('fixture.js')
      .use(to5())
      .run(function(err, src) {
        if (err) return done(err);
        assert(src.indexOf('var _TRANSFORMED') !== -1);
        done();
      });
  });
});

