// TODO disable reordering for this suite!

var begin = 0,
	moduleStart = 0,
	moduleDone = 0,
	testStart = 0,
	testDone = 0,
	log = 0,
	moduleContext,
	moduleDoneContext,
	testContext,
	testDoneContext,
	logContext;

QUnit.begin(function() {
	begin++;
});
QUnit.done(function() {
});
QUnit.moduleStart(function(context) {
	moduleStart++;
	moduleContext = context;
});
QUnit.moduleDone(function(context) {
	moduleDone++;
	moduleDoneContext = context;
});
QUnit.testStart(function(context) {
	testStart++;
	testContext = context;
});
QUnit.testDone(function(context) {
	testDone++;
	testDoneContext = context;
});
QUnit.log(function(context) {
	log++;
	logContext = context;
});

module("logs1");

test("test1", 15, function() {
	equal( begin, 1, "QUnit.begin calls" );
	equal( moduleStart, 1, "QUnit.moduleStart calls" );
	equal( testStart, 1, "QUnit.testStart calls" );
	equal( testDone, 0, "QUnit.testDone calls" );
	equal( moduleDone, 0, "QUnit.moduleDone calls" );
	deepEqual( logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: "QUnit.moduleDone calls",
		actual: 0,
		expected: 0
	}, "log context after equal(actual, expected, message)" );

	equal( "foo", "foo" );
	deepEqual(logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: undefined,
		actual: "foo",
		expected: "foo"
	}, "log context after equal(actual, expected)" );

	ok( true, "ok(true, message)" );
	deepEqual( logContext, {
		module: "logs1",
		name: "test1",
		result: true,
		message: "ok(true, message)"
	}, "log context after ok(true, message)" );

	strictEqual( testDoneContext, undefined, "testDone context" );
	deepEqual( testContext, {
		module: "logs1",
		name: "test1"
	}, "test context" );
	strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );

	equal( log, 14, "QUnit.log calls" );
});
test("test2", 11, function() {
	equal( begin, 1, "QUnit.begin calls" );
	equal( moduleStart, 1, "QUnit.moduleStart calls" );
	equal( testStart, 2, "QUnit.testStart calls" );
	equal( testDone, 1, "QUnit.testDone calls" );
	equal( moduleDone, 0, "QUnit.moduleDone calls" );

	ok( typeof testDoneContext.duration === "number" , "testDone context: duration" );
	delete testDoneContext.duration;
	deepEqual( testDoneContext, {
		module: "logs1",
		name: "test1",
		failed: 0,
		passed: 15,
		total: 15
	}, "testDone context" );
	deepEqual( testContext, {
		module: "logs1",
		name: "test2"
	}, "test context" );
	strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );

	equal( log, 25, "QUnit.log calls" );
});

module("logs2");

test( "test1", 9, function() {
	equal( begin, 1, "QUnit.begin calls" );
	equal( moduleStart, 2, "QUnit.moduleStart calls" );
	equal( testStart, 3, "QUnit.testStart calls" );
	equal( testDone, 2, "QUnit.testDone calls" );
	equal( moduleDone, 1, "QUnit.moduleDone calls" );

	deepEqual( testContext, {
		module: "logs2",
		name: "test1"
	}, "test context" );
	deepEqual( moduleDoneContext, {
		name: "logs1",
		failed: 0,
		passed: 26,
		total: 26
	}, "moduleDone context" );
	deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	equal( log, 34, "QUnit.log calls" );
});
test( "test2", 8, function() {
	equal( begin, 1, "QUnit.begin calls" );
	equal( moduleStart, 2, "QUnit.moduleStart calls" );
	equal( testStart, 4, "QUnit.testStart calls" );
	equal( testDone, 3, "QUnit.testDone calls" );
	equal( moduleDone, 1, "QUnit.moduleDone calls" );

	deepEqual( testContext, {
		module: "logs2",
		name: "test2"
	}, "test context" );
	deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	equal( log, 42, "QUnit.log calls" );
});

var testAutorun = true;

QUnit.done(function() {

	if (!testAutorun) {
		return;
	}

	testAutorun = false;

	module("autorun");

	test("reset", 0, function() {});

	moduleStart = moduleDone = 0;

	test("first", function() {
		equal(moduleStart, 1, "test started");
		equal(moduleDone, 0, "test in progress");
	});

	test("second", function() {
		equal(moduleStart, 2, "test started");
		equal(moduleDone, 1, "test in progress");
	});
});
