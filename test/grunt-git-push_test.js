'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.git_push = {
  setUp: function (done) {
    console.log();
    done();
  },
  checkTaskExists: function(test) {
    console.log('RUN checkTaskExists');
    test.expect(1);
    var actual = require('../tasks/grunt-git-push');
    var expected = 'function';
    test.equal(typeof actual, expected, 'Should export a function');
    test.done();
  },
};
