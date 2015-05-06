
/**
 * Module Dependencies
 */

var assert = require('assert');
var convert = require('convert-source-map');
var Duo = require('duo');
var path = require('path');
var babel = require('..');
var vm = require('vm');

/**
 * Tests
 */

describe('duo-babel', function() {
  it('should compile .js', function(done) {
    build('simple').run(function(err, src) {
      if (err) return done(err);
      assert(src.code.indexOf('var TRANSFORMED') !== -1);
      done();
    });
  });

  it('should only compile local js files', function(done) {
    build('es6-local-es5-remote', { only: [ 'locals' ] }).run(function (err, src) {
      if (err) return done(err);
      var ret = evaluate(src.code);
      assert.equal(ret, 6);
      done();
    });
  });

  it('should only compile remote js files', function(done) {
    build('es5-local-es6-remote', { only: [ 'remotes' ] }).run(function (err, src) {
      if (err) return done(err);
      var ret = evaluate(src.code);
      assert.equal(ret, 6);
      done();
    });
  });

  it('should not compile local js files', function(done) {
    build('es5-local-es6-remote', { ignore: [ 'locals' ] }).run(function (err, src) {
      if (err) return done(err);
      var ret = evaluate(src.code);
      assert.equal(ret, 6);
      done();
    });
  });

  it('should not compile remote js files', function(done) {
    build('es6-local-es5-remote', { ignore: [ 'remotes' ] }).run(function (err, src) {
      if (err) return done(err);
      var ret = evaluate(src.code);
      assert.equal(ret, 6);
      done();
    });
  });

  it('should only compile the specified remote', function (done) {
    build('specific-remotes', { only: [ 'components/sum-es6*/**.js' ] }).run(function (err, src) {
      if (err) return done(err);
      var ret = evaluate(src.code);
      assert(ret);
      done();
    });
  });

  it('should only compile the specified remote', function (done) {
    build('specific-remotes', { ignore: [ 'components/sum-es5*/**.js' ] }).run(function (err, src) {
      if (err) return done(err);
      var ret = evaluate(src.code);
      assert(ret);
      done();
    });
  });

  it('should include an inline source-map when duo is including inline source-maps', function(done) {
    build('simple').sourceMap('inline').run(function(err, src) {
      if (err) return done(err);
      assert(convert.commentRegex.test(src.code));
      done();
    })
  });

  it('should include an inline source-map when duo is including external source-maps', function(done) {
    build('simple').sourceMap(true).run(function(err, src) {
      if (err) return done(err);
      assert(convert.commentRegex.test(src.code));
      done();
    })
  });

  it('should not include an inline source-map', function(done) {
    build('simple').run(function(err, src) {
      if (err) return done(err);
      assert(!convert.commentRegex.test(src.code));
      done();
    })
  });

  it('should pass additional options directly to babel', function(done) {
    build('options', { whitelist: [ 'es6.spread' ] })
      .run(function (err, src) {
        if (err) return done(err);
        assert(src.code.indexOf('const') > -1);
        assert(src.code.indexOf('...') === -1);
        done();
      });
  });
});

/**
 * Returns a duo builder for the given fixture
 *
 * @param {String} fixture    The name of fixture (w/o fixtures/ or .js)
 * @param {Object} [options]  Options for the babel plugin
 * @returns {Duo}
 */

function build(fixture, options) {
  return Duo(__dirname)
    .cache(false)
    .entry('fixtures/' + fixture + '.js')
    .use(babel(options));
}

/**
 * Evaluates code compiled by duo
 *
 * @param {String}
 * @returns {Object}
 */

function evaluate(src, ctx) {
  ctx = ctx || { console: console };
  return vm.runInNewContext(src, ctx)(1);
}
