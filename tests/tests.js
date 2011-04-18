(function(window,undefined){

	var
		History = window.History,
		document = window.document,
		test = window.test,
		module = window.module,
		same = window.same;

	// Check
	if ( !History.enabled ) {
		throw new Error('History.js is disabled');
	}

	// Prepare
	History.options.debug = true;

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
		internalOrder = [false],
		stateOrder = [0],
		sameOrder = [false],
		anchorOrder = [false],
		currentTest = 0,
		title = document.title,
		banner,
		checkStatus,checkState,
		addLog,addTest;

	// Check Status
	checkStatus = function(){
		banner = banner || document.getElementById('qunit-banner');
		var status = banner.className !== 'qunit-fail';
		return status;
	};

	// Check State
	checkState = function(){
		// Check
		if ( !checkStatus() ) {
			throw new Error('A test has failed');
		}

		// Prepare
		var
			stateIndex = stateOrder[currentTest],
			expectedState = History.normalizeState(States[stateIndex]),
			actualState = History.getState(false), friendlyState = History.getState(),
			testName, stateName;

		// Internal
		expectedState.internal = internalOrder[currentTest];
		actualState.internal = friendlyState.internal;

		// Same
		expectedState.same = sameOrder[currentTest];
		actualState.same = friendlyState.same;

		// Anchor
		expectedState.anchor = anchorOrder[currentTest];
		actualState.anchor = friendlyState.anchor;

		// Handle
		++currentTest;
		document.title = title+': '+actualState.url;
		testName = 'Test '+currentTest;
		stateName = 'State '+stateIndex;

		// Test
		test(testName,function(){
			History.log('Completed: '+testName +' / '+ stateName);
			same(actualState,expectedState,stateName);
		});

		// Image Load to Stress Test Safari and Opera
		//(new Image()).src = "image.php";
	};

	// Add Log
	addLog = function(){
		var args = arguments;
		History.queue(function(){
			History.log.apply(History,args);
		});
	};

	// Add Test
	addTest = function(testIndex,stateIndex,internal,same,anchor){
		addLog('Test '+testIndex,History.queues.length,History.busy.flag);
		stateOrder.push(stateIndex);
		internalOrder.push(internal||false);
		sameOrder.push(same||false);
		anchorOrder.push(anchor||false);
	};

	// Check the Initial State
	checkState();

	// State Change
	History.Adapter.bind(window,'statechange',checkState);
	History.Adapter.bind(window,'anchorchange',function(){
		History.log('anchorchange: '+document.location.href);
	});

	// Dom Load
	History.Adapter.onDomLoad(function(){
		setTimeout(function(){

		// ----------------------------------------------------------------------
		// Test State Functionality: Adding

		// State 1 (0 -> 1)
		// Tests HTML4 -> HTML5 Graceful Upgrade
		addTest(2,1,false);
		History.setHash(History.getHashByState(States[1]));

		// State 2 (1 -> 2)
		addLog('Test 3',History.queues.length,History.busy.flag);
		addTest(3,2,'pushState');
		History.pushState(States[2].data, States[2].title, States[2].url);

		// State 2 (2 -> 2) / No Change
		addTest(4,2,'pushState',true);
		History.pushState(States[2].data, States[2].title, States[2].url);

		//State 2 (2 -> 2) / No Change
		addTest(5,2,'replaceState',true);
		History.replaceState(States[2].data, States[2].title, States[2].url);

		// State 3 (2 -> 3)
		addTest(6,3,'replaceState');
		History.replaceState(States[3].data, States[3].title, States[3].url);

		// State 4 (3 -> 4)
		addTest(7,4,'pushState');
		History.pushState(States[4].data, States[4].title, States[4].url);

		// ----------------------------------------------------------------------
		// Test State Functionality: Traversing

		// State 1 (4 -> 3) (3 -> 2 -> 1)
		addTest(8,1,false);
		History.go(-2);

		// State 0 (1 -> 0)
		// Tests Default State
		addTest(9,0,false);
		History.back();

		// State 3 (0 -> 1) (1 -> 2 -> 3)
		addTest(10,3,false);
		History.go(2);

		// State 4 (3 -> 4)
		addTest(11,4,false);
		History.forward();

		// State 3 (4 -> 3)
		addTest(12,3,false);
		History.back();

		// State 1 (3 -> 2 -> 1)
		addTest(13,1,false);
		History.back();

		// ----------------------------------------------------------------------
		// Test State Functionality: Traditional Anchors

		// State 1 (1 -> #log) / No Change
		addTest(14,1,false,true,'log');
		History.setHash('log');

		// State 1 (#log -> 1) / No Change
		addTest(15,1,false,true);
		History.back();

		// State 0 (1 -> 0)
		addTest(16,0,false);
		History.back();

		// State 5 (0 -> 5)
		// Tests pushing a state with a hash included
		addTest(17,5,'pushState',false,'log');
		History.pushState(States[5].data, States[5].title, States[5].url);

		// State 0 (5 -> 0)
		addTest(18,0,false,false);
		History.back();

		// ----------------------------------------------------------------------
		// Test URL Handling: Adding

		// State 6 (0 -> 6)
		// Also tests data with no title
		addTest(19,6,'pushState',false);
		History.pushState(States[6].data, States[6].title, States[6].url);

		// State 7 (6 -> 7)
		addTest(20,7,'pushState',false);
		History.pushState(States[7].data, States[7].title, States[7].url);

		// State 8 (7 -> 8)
		addTest(21,8,'pushState',false);
		History.pushState(States[8].data, States[8].title, States[8].url);

		// State 1 (8 -> 1)
		// Should be /eight?state=1
		addTest(22,1,'pushState',false);
		History.pushState(States[1].data, States[1].title, States[1].url);

		// ----------------------------------------------------------------------
		// Test URL Handling: Traversing

		// State 8 (1 -> 8)
		addTest(23,8,false,false);
		History.back();

		// State 7 (8 -> 7)
		addTest(24,7,false,false);
		History.back();

		// State 6 (7 -> 6)
		addTest(25,6,false,false);
		History.back();

		// State 0 (6 -> 0)
		addTest(26,0,false,false);
		History.back();

		},1000); // wait for test one to complete
	});

})(window);
