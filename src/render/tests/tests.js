(function(){

var
	History = window.History,
	document = window.document,
	test = window.test,
    deepEqual = window.deepEqual;

// Check
if ( !History.enabled ) {
	throw new Error('History.js is disabled');
}

// Prepare
History.options.debug = false;

// Variables
var
	States = {
		// Home
		0: {
			'url': document.location.href.replace(/#.*$/,''),
			'title': ''
		},
		// One
		1: {
			'data': {
				'state': 1,
				'rand': Math.random()
			},
			'title': 'State 1',
			'url': '?state=1'
		},
		// Two
		2: {
			'data': {
				'state': 2,
				'rand': Math.random()
			},
			'title': 'State 2',
			'url': '?state=2&asd=%20asd%2520asd'
		},
		// Three
		3: {
			'url': '?state=3'
		},
		// Four
		4: {
			'data': {
				'state': 4,
				'trick': true,
				'rand': Math.random()
			},
			'title': 'State 4',
			'url': '?state=3'
		},
		// Log
		5: {
			'url': '?state=1#log'
		},
		// Six
		6: {
			'data': {
				'state': 6,
				'rand': Math.random()
			},
			'url': 'six.html'
		},
		// Seven
		7: {
			'url': 'seven'
		},
		// Eight
		8: {
			'url': '/eight'
		}
	},
	stateOrder = [0,1,2,3,4,3,1,0,1,3,4,3,1,0,6,7,8,1,8,7,6,0],
	currentTest = 0;

// Original Title
var title = document.title;

var banner;

var checkStatus = function(){
	banner = banner || document.getElementById('qunit-banner');
	var status = banner.className !== 'qunit-fail';
	return status;
};

// Check State
var checkState = function(){
	if ( !checkStatus() ) {
		throw new Error('A test has failed');
	}

	var
		stateIndex = stateOrder[currentTest],
		expectedState = History.normalizeState(States[stateIndex]),
		actualState = History.getState(false);

	++currentTest;

	document.title = title+': '+actualState.url;

	var
		testName = 'Test '+currentTest,
		stateName = 'State '+stateIndex;

	test(testName,function(){
		History.log('Completed: '+testName +' / '+ stateName);
        deepEqual(actualState,expectedState,stateName);
	});

	// Image Load to Stress Test Safari and Opera
	(new Image()).src = "image.php";
};

// Check the Initial State
checkState();

// State Change
History.Adapter.bind(window,'statechange',checkState);

// Log
var addLog = function(){
	var args = arguments;
	History.queue(function(){
		History.log.apply(History,args);
	});
};

// Dom Load
History.Adapter.onDomLoad(function(){
	setTimeout(function(){

	// ----------------------------------------------------------------------
	// Test State Functionality: Adding

	// Test 2 / State 1 (0 -> 1)
	// Tests HTML4 -> HTML5 Graceful Upgrade
	addLog('Test 2',History.queues.length,History.busy.flag);
	History.setHash(History.getHashByState(States[1]));

	// Test 3 / State 2 (1 -> 2)
	addLog('Test 3',History.queues.length,History.busy.flag);
	History.pushState(States[2].data, States[2].title, States[2].url);

	// Test 3-2 / State 2 (2 -> 2) / No Change
	addLog('Test 3-2',History.queues.length,History.busy.flag);
	History.pushState(States[2].data, States[2].title, States[2].url);

	// Test 3-3 / State 2 (2 -> 2) / No Change
	addLog('Test 3-3',History.queues.length,History.busy.flag);
	History.replaceState(States[2].data, States[2].title, States[2].url);

	// Test 4 / State 3 (2 -> 3)
	addLog('Test 4',History.queues.length,History.busy.flag);
	History.replaceState(States[3].data, States[3].title, States[3].url);

	// Test 5 / State 4 (3 -> 4)
	addLog('Test 5',History.queues.length,History.busy.flag);
	History.pushState(States[4].data, States[4].title, States[4].url);

	// ----------------------------------------------------------------------
	// Test State Functionality: Traversing

	// Test 6 / State 3 (4 -> 3)
	// Test 7 / State 1 (3 -> 2 -> 1)
	addLog('Test 6,7',History.queues.length,History.busy.flag);
	History.go(-2);

	// Test 8 / State 0 (1 -> 0)
	// Tests Default State
	addLog('Test 8',History.queues.length,History.busy.flag);
	History.back();

	// Test 9 / State 1 (0 -> 1)
	// Test 10 / State 3 (1 -> 2 -> 3)
	addLog('Test 9,10',History.queues.length,History.busy.flag);
	History.go(2);

	// Test 11 / State 4 (3 -> 4)
	addLog('Test 11',History.queues.length,History.busy.flag);
	History.forward();

	// Test 12 / State 3 (4 -> 3)
	addLog('Test 12',History.queues.length,History.busy.flag);
	History.back();

	// Test 13 / State 1 (3 -> 2 -> 1)
	addLog('Test 13',History.queues.length,History.busy.flag);
	History.back();

	// ----------------------------------------------------------------------
	// Test State Functionality: Traditional Anchors

	// Test 13-2 / State 1 (1 -> #log) / No Change
	addLog('Test 13-2',History.queues.length,History.busy.flag);
	History.setHash('log');

	// Test 13-3 / State 1 (#log -> 1) / No Change
	addLog('Test 13-3',History.queues.length,History.busy.flag);
	History.back();

	// Test 14 / State 0 (1 -> 0)
	addLog('Test 14',History.queues.length,History.busy.flag);
	History.back();

	// ----------------------------------------------------------------------
	// Test URL Handling: Adding

	// Test 15 / State 6 (1 -> 6)
	// Also tests data with no title
	addLog('Test 15',History.queues.length,History.busy.flag);
	History.pushState(States[6].data, States[6].title, States[6].url);

	// Test 16 / State 7 (6 -> 7)
	addLog('Test 16',History.queues.length,History.busy.flag);
	History.pushState(States[7].data, States[7].title, States[7].url);

	// Test 17 / State 7 (7 -> 8)
	addLog('Test 17',History.queues.length,History.busy.flag);
	History.pushState(States[8].data, States[8].title, States[8].url);

	// Test 18 / State 1 (8 -> 1)
	// Should be /eight?state=1
	addLog('Test 18',History.queues.length,History.busy.flag);
	History.pushState(States[1].data, States[1].title, States[1].url);

	// ----------------------------------------------------------------------
	// Test URL Handling: Traversing

	// Test 19 / State 8 (1 -> 8)
	addLog('Test 19',History.queues.length,History.busy.flag);
	History.back();

	// Test 20 / State 7 (8 -> 7)
	addLog('Test 20',History.queues.length,History.busy.flag);
	History.back();

	// Test 21 / State 6 (7 -> 6)
	addLog('Test 21',History.queues.length,History.busy.flag);
	History.back();

	// Test 22 / State 0 (6 -> 0)
	addLog('Test 22',History.queues.length,History.busy.flag);
	History.back();

	},1000); // wait for test one to complete
});

})();
