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
	stateOrder = [0,1,2,3,4,1,0,3,4,3,1,0],
	currentTest = 0;

// State Change
History.Adapter.bind(window,'statechange',function(){
	var
		stateIndex = stateOrder[currentTest],
		expectedState = History.expandState(States[stateIndex]),
		actualState = History.getState(),
		expectedStateStr = JSON.stringify(expectedState),
		actualStateStr = JSON.stringify(actualState);

	++currentTest;

	test('Test '+currentTest,function(){
		same(actualState,expectedState,'State '+stateIndex);
	});
});


History.Adapter.onDomLoad(function(){

	// Test 2 / State 1 (0 -> 1)
	// Tests HTML4 -> HTML5 Graceful Upgrade
	History.setHash(History.contractState(History.expandState(States[1])));

	// Test 3 / State 2 (1 -> 2)
	History.pushState(States[2].data, States[2].title, States[2].url);

	// Test 4 / State 3 (2 -> 3)
	History.replaceState(States[3].data, States[3].title, States[3].url);

	// Test 5 / State 4 (3 -> 4)
	History.pushState(States[4].data, States[4].title, States[4].url);

	// Test 6 / State 1 (4 -> 3 -> 2 -> 1)
	History.go(-2);

	// Test 7 / State 0 (1 -> 0)
	// Tests Default State
	History.back();

	// Test 8 / State 3 (0 -> 1 -> 2 -> 3)
	History.go(2);

	// Test 9 / State 4 (3 -> 4)
	History.forward();

	// Test 10 / State 3 (4 -> 3)
	History.back();

	// Test 11 / State 1 (3 -> 2 -> 1)
	History.back();

	// Test 11 / State 1 (1 -> #log) / No Change
	History.setHash('log');

	// Test 11 / State 1 (#log -> 1) / No Change
	History.back();

	// Test 12 / State 0 (1 -> 0)
	History.back();

});
