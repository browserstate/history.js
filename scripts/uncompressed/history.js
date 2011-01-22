// History.js
// New-BSD License, Copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>

(function(window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// Localise Globals
	var
		History = window.History||{},
		history = window.history;

	// Check Existence of History.js
	if ( typeof History.emulated !== 'undefined' ) {
		throw new Error('History.js has already been emulated...');
	}

	// Initialise
	History.init = function(){

		/**
		 * History.emulated
		 * Which features require emulating?
		 */
		History.emulated = {
			pushState: !Boolean(window.history && window.history.pushState && window.history.replaceState),
			hashChange: Boolean(
				!('onhashchange' in window || 'onhashchange' in document)
				||
				(History.Adapter.getBrowserFlag() === 'msie' && History.Adapter.getBrowserMajorVersion() < 8)
			)
		};

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.debug.enable||false) ) {
				History.log.apply(History,arguments);
			}
		}
		History.debug.enable = true;

		/**
		 * History.log(message,...)
		 * Logs the passed arguments
		 */
		History.log = function(){
			if ( typeof console === 'undefined' ) {
				var message = arguments[0];
				for ( var i=1,n=arguments.length; i<n; ++i ) {
					message += "\n\n"+arguments[i];
				}
				alert(message);
			}
			else {
				console.log.apply(console,[arguments]);
			}
		}

		// ----------------------------------------------------------------------
		// General Helper Functions

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param {string} hash
		 * @return {string}
		 */
		History.setHash = function(hash){
			History.debug('History.setHash',this,arguments,hash);
			document.location.hash = History.normalizeHash(hash);
			return hash;
		};

		/**
		 * History.getHash()
		 * Gets the current document hash
		 * @return {string}
		 */
		History.getHash = function(){
			var hash = History.normalizeHash(document.location.hash);
			return hash;
		};

		/**
		 * History.normalizeHash()
		 * Normalise a hash across browsers
		 * @return {string}
		 */
		History.normalizeHash = function(hash){
			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');
			return result;
		};

		/**
		 * History.extractHashFromUrl(url)
		 * Extracts the Hash from a URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.extractHashFromUrl = function(url){
			// Extract the hash
			var hash = String(url)
				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
				;

			// Return hash
			return hash;
		};

		/**
		 * History.expandUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.expandUrl = function(url){
			// Remove Anchor
			url = url.replace(/#.*/,'');

			// Test for Full URL
			if ( /[a-z]+\:\/\//.test(url) ) {
				// We have a Full URL
			}

			// Relative URL
			else {
				// Test for Base Page
				if ( url.length === 0 || url.substring(0,1) === '?' ) {
					// Fetch Base Page
					var basePage = document.location.href.replace(/#.*/,'');

					// Adjust Page
					url = basePage+url;
				}

				// No Base Page
				else {

					// Prepare for Base Element
					var
						baseElements = document.getElementsByTagName('base'),
						baseElement = null,
						baseHref = '';

					// Test for Base Element
					if ( baseElements.length === 1 ) {
						// Prepare for Base Element
						baseElement = baseElements[0];
						baseHref = baseElement.href;
						if ( baseHref[baseHref.length-1] !== '/' ) baseHref += '/';

						// Adjust for Base Element
						url = baseHref+url.replace(/^\//,'');
					}

					// No Base Element
					else {
						// Test for Base URL
						if ( url.substring(0,1) === '.' ) {
							// Prepare for Base URL
							var baseUrl = document.location.href.replace(/#.*/,'').replace(/[^\/]+$/,'');
							if ( baseUrl[baseUrl.length-1] !== '/' ) baseUrl += '/';

							// Adjust for Base URL
							url = baseUrl + url;
						}

						// No Base URL
						else {
							// Prepare for Base Domain
							var baseDomain = document.location.protocol+'//'+(document.location.hostname||document.location.host);
							if ( document.location.port||false ) {
								baseDomain += ':'+document.location.port;
							}
							baseDomain += '/';

							// Adjust for Base Domain
							url = baseDomain+url.replace(/^\//,'');
						}
					}
				}
			}

			// Return url
			return url;
		};

		/**
		 * History.getStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {object}
		 */
		History.getStateObject = function(data,title,url){
			// Hashify
			var State = {
				"data": data,
				"title": title,
				"url": url
			};

			// Return object
			return State;
		};

		/**
		 * History.getStateHash(data,title,url)
		 * Creates a Hash for the State Object
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {string}
		 */
		History.getStateHash = function(data,title,url){
			// Hashify
			var StateHash = JSON.stringify(History.getStateObject(data,title,url));

			// Return hash
			return StateHash;
		};

		/**
		 * History.currentState
		 * The current State that we exist in.
		 */
		History.currentState = History.getStateObject({},document.title,document.location.href);

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @return {object} {data,title,url}
		 */
		History.getState = function(){
			return History.currentState;
		};

		/**
		 * History.pushStateAndTrigger(data,title,url)
		 * Add a new State to the history object, become it, and trigger onpopstate
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {true}
		 */
		History.pushStateAndTrigger = function(data,title,url){
			// Push the State
			History.pushState(data,title,url);

			// Fire HTML5 Event
			History.Adapter.trigger(window,'popstate',{
				'state': data
			});

			// Return true
			return true;
		}

		/**
		 * History.replaceStateAndTrigger(data,title,url)
		 * Replace the State and trigger onpopstate
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {true}
		 */
		History.replaceStateAndTrigger = function(data,title,url){
			// Push the State
			History.replaceState(data,title,url);

			// Fire HTML5 Event
			History.Adapter.trigger(window,'popstate',{
				'state': data
			});

			// Return true
			return true;
		}

		// ----------------------------------------------------------------------
		// HTML4 HashChange Support

		History.debug("browser version:", History.Adapter.getBrowserMajorVersion());
		History.debug("browser flag:", History.Adapter.getBrowserFlag());
		History.debug("emulate hashchange:", History.emulated.hashChange );

		if ( History.emulated.hashChange ) {
			/*
			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
			 */

			(function(){
				// Define our Checker Function
				var checkerFunction = null;

				// Handle depending on the browser
				if ( History.Adapter.getBrowserFlag() === 'msie' ) {
					// IE6 and IE7
					// We need to use an iframe to emulate the back and forward buttons

					// Create iFrame
					var
						iframeId = 'historyjs-iframe',
						iframe = document.createElement('iframe');

					// Adjust iFarme
					iframe.setAttribute('id', iframeId);
					iframe.style.display = 'none';

					// Append iFrame
					document.body.appendChild(iframe);

					// Create initial history entry
					iframe.contentWindow.document.open();
					iframe.contentWindow.document.close();

					// Define some variables that will help in our checker function
					var
						lastDocumentHash = null,
						lastIframeHash = null;

					// Define the checker function
					checkerFunction = function(){
						// Fetch
						var
							documentHash = History.getHash(),
							iframeHash = History.normalizeHash(iframe.contentWindow.document.location.hash);

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Create a history entry in the iframe
							History.debug('hashchange.checker: iframe hash check', iframeHash, documentHash);
							if ( iframeHash !== documentHash ) {
								History.debug('hashchange.checker: iframe hash change', iframeHash, documentHash);
								iframe.contentWindow.document.open();
								iframe.contentWindow.document.close();

								// Update the iframe's hash
								iframe.contentWindow.document.location.hash = documentHash;

								// Equalise
								lastIframeHash = iframeHash = documentHash;
							}

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// The iFrame Hash has changed (back button caused)
						else if ( iframeHash !== lastIframeHash ) {
							History.debug('hashchange.checker: iframe hash out of sync', iframeHash, documentHash);

							// Equalise
							lastIframeHash = iframeHash;

							// Update the Hash
							History.setHash(iframeHash);
						}

						// Return true
						return true;
					};
				}
				else {
					// We are not IE
					// Firefox 1 or 2, Opera

					// Define some variables that will help in our checker function
					var
						lastDocumentHash = null;

					// Define the checker function
					checkerFunction = function(){
						// Prepare
						var documentHash = History.getHash();

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange')
						}

						// Return true
						return true;
					};
				}

				// Apply the checker function
				setInterval(checkerFunction, 200);

				// Return true
				return true;

			})(); // closure

		}

		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			var hashchangeHandler = function(event){
				History.debug('History.hashchange',this,arguments);
				// Prepare
				var
					newURL = (event && event.newURL) || document.location;

				// Fetch the new State
				var
					newStateHash = unescape(History.extractHashFromUrl(newURL)),
					newState = null;

				// Check the Hash
				if ( !newStateHash ) {
					History.debug('History.hashchange: state hash doesn\'t exist',newStateHash);
					return false;
				}

				// Parse the new State's JSON
				try {
					newState = JSON.parse(newStateHash);
				} catch ( Exception ) {
					History.debug('History.hashchange: JSON Parse Error',Exception);
					return false;
				}

				// Fetch the old State
				var
					oldState = History.getState(),
					oldStateHash = History.getStateHash(oldState.data, oldState.title, oldState.url);

				// Check if we are the same state
				if ( newStateHash === oldStateHash ) {
					// There has been no change (just the page's hash has finally propagated)
					History.debug('History.hashchange: no change');
					return false;
				}

				// Check if we are DiscardedState
				if ( History.discardedState(newState) ) {
					// Ignore this state as it has been discarded and go back to the state before it
					History.debug('History.hashchange: discarded');
					history.go(-1);
					return false;
				}

				// Push the new HTML5 State
				History.debug('History.hashchange: success hashchange');
				History.pushState(newState.data,newState.title,newState.url);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'hashchange',hashchangeHandler);

			/**
			 * History.ignoredStates
			 * A hashed array of discarded states
			 */
			History.discardedStates = {};

			/**
			 * History.discardState(data,title,url)
			 * Discards the state by ignoring it through History
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.discardState = function(data,title,url){
				History.debug('History.discardState',this,arguments);
				// Prepare
				var StateHash = History.getStateHash(data,title,url);

				// Add to DiscardedStates
				History.discardedStates[StateHash] = true;

				// Return true
				return true;
			};

			/**
			 * History.discardState(data,title,url)
			 * Checks to see if the state is discarded
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {bool}
			 */
			History.discardedState = function(data,title,url){
				// Prepare
				var StateHash = History.getStateHash(data,title,url);

				// Check
				var discarded = typeof History.discardedStates[StateHash] !== 'undefined';

				// Return true
				return discarded;
			};

			/**
			 * History.recycleState(data,title,url)
			 * Allows a discarded state to be used again
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.recycleState = function(data,title,url){
				History.debug('History.recycleState',this,arguments);
				// Remove from DiscardedStates
				if ( History.discardedState(data,title,url) ) {
					delete History.discardedStates[StateHash];
				}

				// Return true
				return true;
			};

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object and become it
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url){
				History.debug('History.pushState',this,arguments);
				// Expand the URL
				url = History.expandUrl(url);

				// Adjust Data
				data.url = url;
				data.title = title;

				// Recycle the State
				History.recycleState(data,title,url);

				// Fetch the State Object
				var
					State = History.getStateObject(data,title,url),
					StateHash = History.getStateHash(data,title,url),
					Hash = escape(StateHash),
					oldHash = History.getHash();

				// Force update of the title
				if ( State.title ) {
					document.title = State.title
				}

				// Update HTML5 State
				History.currentState = State;

				// Fire HTML5 Event
				History.Adapter.trigger(window,'popstate',{
					'state': State.data
				});

				// Update HTML4 Hash
				if ( oldHash !== Hash && escape(oldHash) !== Hash ) {
					History.debug('History.pushState: update hash', Hash, oldHash);
					History.setHash(Hash);
				}

				// Return true
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replaces the current State with the new State
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(state,title,url){
				History.debug('History.replaceState',this,arguments);
				// Get Current State
				var State = History.getState();

				// Push New State
				History.pushState(state,title,data);

				// Discard Old State
				History.discardState(State.data, State.title, State.url);

				// Return true
				return true;
			};

			/**
			 * Ensure that for non emulated hashchange that we still handle the initial state
			 */
			if ( !History.emulated.hashChange && (document.location.hash && document.location.hash !== '#') ) {
				History.Adapter.onDomLoad(function(){
					hashchangeHandler();
				});
			}
		}
		else {
			/**
			 * Refresh the Current State
			 */
			History.Adapter.bind(window,'popstate',function(event,extra){
				History.debug('History.popstate',this,arguments);

				// Extract
				var
					url = History.expandUrl(document.location.href),
					title = document.title,
					data = {};

				// Adjust Data
				if ( (event||false) && (event.state||false) ) data = event.state;
				else if ( (event||false) && (event.originalEvent||false) && (event.originalEvent.state||false) ) data = event.originalEvent.state;
				else if ( (event||false) && (event.memo||false) && (event.memo.state||false) ) data = event.memo.state;
				else if ( (extra||false) && (extra.state||false) ) data = extra.state;

				// Adjust Title
				title = data.title||title;

				// Create
				var State = History.getStateObject(data,title,url);

				// Force update of the title
				if ( State.title ) {
					document.title = State.title
				}

				// Update HTML5 State
				History.currentState = State;

				// Return true
				return true;
			});

			History.pushState = function(data,title,url){
				data.url = url;
				data.title = title;
				history.pushState.apply(history,[data,title,url]);
			}
			History.replaceState = function(data,title,url){
				data.url = url;
				data.title = title;
				history.replaceState.apply(history,[data,title,url]);
			}
			History.go = function(){
				history.go.apply(history,arguments);
			}
			History.back = function(){
				history.back.apply(history,arguments);
			}
			History.forward = function(){
				history.forward.apply(history,arguments);
			}
		}

	}; // init

	// Check Load Status
	if ( typeof History.Adapter !== 'undefined' ) {
		// Adapter loaded faster than History.js, fire init.
		History.init();
	}

	// Apply History
	window.History = History;

})(window);
