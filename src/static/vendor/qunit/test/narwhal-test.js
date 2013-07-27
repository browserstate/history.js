// Run with: $ narwhal test/narwhal-test.js
var QUnit = require("../qunit/qunit");

QUnit.log(function(details) {
	if (!details.result) {
		var output = "FAILED: " + (details.message ? details.message + ", " : "");
		if (details.actual) {
			output += "expected: " + details.expected + ", actual: " + details.actual;
		}
		if (details.source) {
			output += ", " + details.source;
		}
		print(output);
	}
});

QUnit.test("fail twice with stacktrace", function(assert) {
	/*jshint expr:true */
	assert.equal(true, false);
	assert.equal(true, false, "gotta fail");
	x.y.z; // Throws ReferenceError
});
