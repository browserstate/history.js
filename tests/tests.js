// Variables
var
	States = {
		// Home
		0: {
			'url': document.location.href.replace(/#.*$/,'')
		},
		// One
		1: {
			'data': {
				'state': 1
			},
			'title': 'State 1',
			'url': '?state=1'
		},
		// Two
		2: {
			'data': {
				'state': 2
			},
			'title': 'State 2',
			'url': '?state=2'
		},
		// Three
		3: {
			'url': '?state=3'
		},
		// Four
		4: {
			'data': {
				'state': 4,
				'trick': true
			},
			'title': 'State 4',
			'url': '?state=3'
		},
		// Log
		5: {
			'url': '?state=1#log'
		}
	},
	stateOrder = [0,1,2,3,4,3,1,0,1,3,4,3,1,0],
	currentTest = 0;

// State Change
History.Adapter.bind(window,'statechange',function(){
	var
		stateIndex = stateOrder[currentTest],
		expectedState = History.expandState(States[stateIndex]),
		actualState = History.getState();

	++currentTest;

	var
		testName = 'Test '+currentTest,
		stateName = 'State '+stateIndex;

	test(testName,function(){
		var result = same(actualState,expectedState,stateName);
		History.log('Completed: '+testName +' / '+ stateName);
	});
});


var addLog = function(){
	var args = arguments;
	if ( History.busy() ) {
		History.pushQueue({
			callback: function(){
				History.log.apply(History,args);
			}
		});
	} else {
		History.log.apply(History,args);
	}
};

History.Adapter.onDomLoad(function(){
	setTimeout(function(){

	// Test 2 / State 1 (0 -> 1)
	// Tests HTML4 -> HTML5 Graceful Upgrade
	addLog('Test 2',History.queues,History.busy.flag);
	History.setHash(History.contractState(History.expandState(States[1])));

	// Test 3 / State 2 (1 -> 2)
	addLog('Test 3',History.queues,History.busy.flag);
	History.pushState(States[2].data, States[2].title, States[2].url);

	// Test 4 / State 3 (2 -> 3)
	addLog('Test 4',History.queues,History.busy.flag);
	History.replaceState(States[3].data, States[3].title, States[3].url);

	// Test 5 / State 4 (3 -> 4)
	addLog('Test 5',History.queues,History.busy.flag);
	History.pushState(States[4].data, States[4].title, States[4].url);

	// Test 6 / State 3 (4 -> 3)
	// Test 7 / State 1 (3 -> 2 -> 1)
	addLog('Test 6,7',History.queues,History.busy.flag);
	History.go(-2);

	// Test 8 / State 0 (1 -> 0)
	// Tests Default State
	addLog('Test 8',History.queues,History.busy.flag);
	History.back();

	// Test 9 / State 1 (0 -> 1)
	// Test 10 / State 3 (1 -> 2 -> 3)
	addLog('Test 9,10',History.queues,History.busy.flag);
	History.go(2);

	// Test 11 / State 4 (3 -> 4)
	addLog('Test 11',History.queues,History.busy.flag);
	History.forward();

	// Test 12 / State 3 (4 -> 3)
	addLog('Test 12',History.queues,History.busy.flag);
	History.back();

	// Test 13 / State 1 (3 -> 2 -> 1)
	addLog('Test 13',History.queues,History.busy.flag);
	History.back();

	// Test 13-2 / State 1 (1 -> #log) / No Change
	addLog('Test 13-2',History.queues,History.busy.flag);
	History.setHash('log');

	// Test 13-3 / State 1 (#log -> 1) / No Change
	addLog('Test 13-3',History.queues,History.busy.flag);
	History.back();

	// Test 14 / State 0 (1 -> 0)
	addLog('Test 14',History.queues,History.busy.flag);
	History.back();

	},5000); // wait for test one to complete
});
