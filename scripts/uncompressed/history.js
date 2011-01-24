// History.js
// New-BSD License, Copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>

(function(window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// History Object
	window.History = window.History||{};

	// Localise Globals
	var
		document = window.document, // Make sure we are using the correct document
		_History = {}, // Private History Object
		History = window.History, // Public History Object
		history = window.history; // Old History Object

	// Check Existence of History.js
	if ( typeof History.emulated !== 'undefined' ) {
		throw new Error('History.js has already been emulated...');
	}

	// Initialise
	History.init = function(){

		// ----------------------------------------------------------------------
		// Debug Helpers

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.debug.enable||false) ) {
				History.log.apply(History,arguments);
			}
		};
		History.debug.enable = false;

		/**
		 * History.log(message,...)
		 * Logs the passed arguments
		 */
		History.log = function(){
			if ( typeof console === 'undefined' ) {
				var message = "\n"+arguments[0]+"\n";
				for ( var i=1,n=arguments.length; i<n; ++i ) {
					message += "\n"+arguments[i]+"\n";
				}
				var textarea = document.getElementById('log');
				if ( textarea ) {
					textarea.value += message+"\n-----\n";
				} else {
					alert(message);
				}
			}
			else {
				console.log.apply(console,[arguments]);
			}
		}

		// ----------------------------------------------------------------------
		// Emulated Status

		/**
		 * _History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		_History.getInternetExplorerMajorVersion = function(){
			return _History.getInternetExplorerMajorVersion.cached =
					(typeof _History.getInternetExplorerMajorVersion.cached !== 'undefined')
				?	_History.getInternetExplorerMajorVersion.cached
				:	(function(){
						var undef,
								v = 3,
								div = document.createElement('div'),
								all = div.getElementsByTagName('i');
						while (
								div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
								all[0]
						);
						return v > 4 ? v : undef;
					})()
				;
		};

		/**
		 * _History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Lupton <contact@balupton.com>
		 */
		_History.isInternetExplorer = function(){
			return _History.isInternetExplorer.cached =
					(typeof _History.isInternetExplorer.cached !== 'undefined')
				?	_History.isInternetExplorer.cached
				:	(_History.getInternetExplorerMajorVersion() !== 0)
				;
		};

		/**
		 * History.emulated
		 * Which features require emulating?
		 */
		History.emulated = {
			pushState: !Boolean(window.history && window.history.pushState && window.history.replaceState),
			hashChange: Boolean(
				!('onhashchange' in window || 'onhashchange' in document)
				||
				(_History.isInternetExplorer() && _History.getInternetExplorerMajorVersion() < 8)
			)
		};

		// ----------------------------------------------------------------------
		// Hash Helpers

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
		 * History.isTraditionalAnchor(url)
		 * Checks to see if the url is a traditional anchor
		 * @param {string} url
		 * @return {boolean}
		 */
		History.isTraditionalAnchor = function(url){
			var
				hash = History.extractHashFromUrl(url),
				el = document.getElementById(hash),
				exists = typeof el !== 'undefined';

			return exists;
		}

		// ----------------------------------------------------------------------
		// State Object Helpers

		/**
		 * History.expandUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.expandUrl = function(url){
			// Remove Anchor
			// url = url.replace(/#.*/,'');

			// Test for Full URL
			if ( /[a-z]+\:\/\//.test(url) ) {
				// We have a Full URL
			}

			// Relative URL
			else {
				// Test for Base Page
				if ( url.length === 0 || url.substring(0,1) === '?' ) {
					// Fetch Base Page
					var basePage = document.location.href.replace(/[#\?].*/,'');

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
							var baseUrl = document.location.href.replace(/[#\?].*/,'').replace(/[^\/]+$/,'');
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
		 * History.expandState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.expandState = function(oldState){
			oldState = oldState||{};
			var newState = {
				'data': oldState.data||{},
				'url': History.expandUrl(oldState.url||''),
				'title': oldState.title||''
			};
			newState.data.title = newState.data.title||newState.title;
			newState.data.url = newState.data.url||newState.url;
			return newState;
		}

		/**
		 * History.createStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {object}
		 */
		History.createStateObject = function(data,title,url){
			// Hashify
			var State = {
				"data": data,
				"title": title,
				"url": url
			};

			// Expand the State
			State = History.expandState(State);

			// Return object
			return State;
		};

		/**
		 * History.createStateHash(data,title,url)
		 * Creates a Hash for the State Object
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {string}
		 */
		History.createStateHash = function(data,title,url){
			// Handle being just passed a StateObject
			if ( arguments.length === 1 ) {
				url = data.url||undefined;
				title = data.title||undefined;
				data = data.data;
			}

			// Hashify
			var StateHash = JSON.stringify(History.createStateObject(data,title,url));

			// Return hash
			return StateHash;
		};

		// ----------------------------------------------------------------------
		// State Persistance Helpers

		/**
		 * History.currentState
		 * The current State that we exist in.
		 */
		History.currentState = History.createStateObject({},'',document.location.href);

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @return {object} {data,title,url}
		 */
		History.getState = function(){
			return History.currentState;
		};


		// ----------------------------------------------------------------------
		// HTML4 HashChange Support

		if ( History.emulated.hashChange ) {
			/*
			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
			 */

			(function(){
				// Define our Checker Function
				_History.checkerFunction = null;

				// Handle depending on the browser
				if ( _History.isInternetExplorer() ) {
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
					_History.checkerFunction = function(){
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
					_History.checkerFunction = function(){
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
				setInterval(_History.checkerFunction, 200);

				// Return true
				return true;

			})(); // closure

		}

		// ----------------------------------------------------------------------
		// State Logging

		/**
		 * _History.statesByUrl
		 * Store the states indexed by their URLs
		 */
		_History.statesByUrl = {};

		/**
		 * _History.duplicateStateUrls
		 * Which urls have duplicate states (indexed by url)
		 */
		_History.duplicateStateUrls = {};

		/**
		 * _History.statesByHash
		 * Store the states indexed by their Hashes
		 */
		_History.statesByHash = {};

		/**
		 * _History.storedStates
		 * Store the states in an array
		 */
		_History.storedStates = [];

		/**
		 * _History.getStateByUrl
		 * Get a state by it's url
		 * @param {string} stateUrl
		 */
		_History.getStateByUrl = function(stateUrl){
			var State = _History.statesByUrl[stateUrl]||undefined;
			return State;
		};

		/**
		 * _History.getStateByHash
		 * Get a state by it's hash
		 * @param {string} stateHash
		 */
		_History.getStateByHash = function(stateHash){
			var State = _History.statesByHash[stateHash]||undefined;
			return State;
		};

		/**
		 * _History.storeState
		 * Store a State
		 * @param {object} State
		 * @return {boolean} true
		 */
		_History.storeState = function(newState){
			// Prepare
			var
				newStateHash = History.createStateHash(newState),
				oldState = _History.getStateByUrl(newState.url);

			// Check for Conflict
			if ( typeof oldState !== 'undefined' ) {
				// Compare Hashes
				var oldStateHash = History.createStateHash(oldState);
				if ( oldStateHash !== newStateHash ) {
					// We have a conflict
					_History.duplicateStateUrls[newState.url] = true;
				}
			}

			// Store the State
			_History.statesByUrl[newState.url] = _History.statesByHash[newStateHash] = newState;
			_History.storedStates.push(newState);

			// Return true
			return true;
		};

		/**
		 * _History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		_History.getStateByIndex = function(index){
			// Prepare
			var State = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				_History.storedStates(_History.storedStates.length-1);
			}
			else if ( index < 0 ) {
				// Get from the end
				_History.storedStates(_History.storedStates-index);
			}
			else {
				// Get from the beginning
				_History.storedStates(index);
			}

			// Return State
			return State;
		};

		/**
		 * _History.getHashByIndex()
		 * Gets a hash by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		_History.getHashByIndex = function(index){
			// Prepare
			var hash = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				_History.storedStates(_History.storedStates.length-1);
			}
			else if ( index < 0 ) {
				// Get from the end
				_History.storedStates(_History.storedStates-index);
			}
			else {
				// Get from the beginning
				_History.storedStates(index);
			}

			// Return State
			return State;
		};

		/**
		 * _History.stateHashExists
		 * Checks if the State Hash Exists
		 * @param {string} stateHash
		 * @return {boolean} exists
		 */
		_History.stateHashExists = function(stateHash){
			// Prepare
			var exists = typeof _History.statesByHash[stateHash] !== 'undefined';

			// Return exists
			return exists;
		};

		/**
		 * _History.stateUrlExists
		 * Checks if the State Url Exists
		 * @param {string} stateUrl
		 * @return {boolean} exists
		 */
		_History.stateUrlExists = function(stateUrl){
			// Prepare
			var exists = typeof _History.statesByUrl[stateUrl] !== 'undefined';

			// Return exists
			return exists;
		};

		/**
		 * _History.urlDuplicateExists
		 * Check if the url has multiple states associated to it
		 * @param {string} stateUrl
		 * @return {boolean} exists
		 */
		_History.urlDuplicateExists = function(stateUrl){
			var exists = typeof _History.duplicateStateUrls[stateUrl] !== 'undefined';
			return exists;
		};

		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * _History.stateHashes
			 * Store the hashes for use in detecting the state direction (for discarded redirects)
			 */
			_History.stateHashes = [];

			/**
			 * _History.onHashChange(event)
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			_History.onHashChange = function(event){
				History.debug('History.hashchange',this,arguments);
				// Prepare
				var
					currentUrl						= (event && event.newURL) || document.location.href;
					currentHash						= unescape(History.extractHashFromUrl(currentUrl)),
					currentState					= null,
					currentStateHash			= null,
					currentStateHashExits	= null;

				// Store our location for use in detecting back/forward direction
				_History.stateHashes.push(currentHash);

				// Create the State
				try {
					currentState = JSON.parse(currentHash);
				} catch ( Exception ) {
					currentState = History.createStateObject({},document.title,currentUrl);
				}

				// Create the state Hash
				currentStateHash = History.createStateHash(currentState);

				/* Check if we are the same state
				if ( currentStateHash === _History.stateHashes[_History.stateHashes.length-2] ) {
					// There has been no change (just the page's hash has finally propagated)
					History.log('History.hashchange: no change');
					return false;
				}// */

				// Check if we are DiscardedState
				if ( _History.discardedState(currentState.data,currentState.title,currentState.url) ) {
					// Ignore this state as it has been discarded and go back to the state before it
					History.log('History.hashchange: discarded',
						'currentStateHash',
						currentStateHash,
						'oldStateHash',
						oldStateHash,
						'-1',
						_History.stateHashes[_History.stateHashes.length-1],
						'-2',
						_History.stateHashes[_History.stateHashes.length-2],
						'-3',
						_History.stateHashes[_History.stateHashes.length-3],
						'-4',
						_History.stateHashes[_History.stateHashes.length-4]
					);
					if ( _History.stateHashes[_History.stateHashes.length-3] === currentStateHash ) {
						// We are going backwards
						History.log('History.hashchange: go backwards');
						History.back();
					} else {
						// We are going forwards
						History.log('History.hashchange: go forwards');
						History.forward();
					}
					return false;
				}

				// Store the State
				_History.storeState(currentState);

				// Push the new HTML5 State
				History.debug('History.hashchange: success hashchange');
				History.pushState(currentState.data,currentState.title,currentState.url);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'hashchange',_History.onHashChange);

			/**
			 * _History.ignoredStates
			 * A hashed array of discarded states
			 */
			_History.discardedStates = {};

			/**
			 * _History.discardState(data,title,url)
			 * Discards the state by ignoring it through History
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			_History.discardState = function(data,title,url){
				History.debug('History.discardState',this,arguments);
				// Prepare
				var StateHash = History.createStateHash(data,title,url);

				// Add to DiscardedStates
				_History.discardedStates[StateHash] = true;

				// Return true
				return true;
			};

			/**
			 * _History.discardState(data,title,url)
			 * Checks to see if the state is discarded
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {bool}
			 */
			_History.discardedState = function(data,title,url){
				// Prepare
				var StateHash = History.createStateHash(data,title,url);

				// Check
				var discarded = typeof _History.discardedStates[StateHash] !== 'undefined';

				// Return true
				return discarded;
			};

			/**
			 * _History.recycleState(data,title,url)
			 * Allows a discarded state to be used again
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			_History.recycleState = function(data,title,url){
				History.debug('History.recycleState',this,arguments);
				// Prepare
				var StateHash = History.createStateHash(data,title,url);

				// Remove from DiscardedStates
				if ( _History.discardedState(data,title,url) ) {
					delete _History.discardedStates[StateHash];
				}

				// Return true
				return true;
			};

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url){
				History.debug('History.pushState',this,arguments);
				// Fetch the State Object
				var
					newState = History.createStateObject(data,title,url),
					newStateHash = History.createStateHash(newState.data,newState.title,newState.url),
					oldState = History.getState(),
					oldStateHash = History.createStateHash(oldState.data,oldState.title,oldState.url),
					html4Hash = unescape(History.getHash());

				// Store the newState
				_History.storeState(newState);

				// Recycle the State
				_History.recycleState(newState.data,newState.title,newState.url);

				// Force update of the title
				if ( newState.title ) {
					document.title = newState.title
				}

				History.debug(
					'History.pushState: details',
					'newStateHash:', newStateHash,
					'oldStateHash:', oldStateHash,
					'html4Hash:', html4Hash
				);

				// Check if we are the same State
				if ( newStateHash === oldStateHash && html4Hash === newStateHash ) {
					History.log('History.pushState: no change');
					return false;
				}

				// Update HTML5 State
				History.currentState = newState;

				// Update HTML4 Hash
				if ( newStateHash !== html4Hash ) {
					History.debug('History.pushState: update hash');
					History.setHash(escape(newStateHash));
				}

				// Fire HTML5 Event
				History.debug('History.pushState: trigger popstate');
				History.Adapter.trigger(window,'popstate',{
					'state': newState.data
				});

				// Return true
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url){
				History.log('History.replaceState',this,arguments);
				// Get the oldState
				var oldState = History.getState();

				// Discard Old State
				_History.discardState(oldState.data, oldState.title, oldState.url);

				// Alias to PushState
				History.pushState(data,title,url);

				// Return true
				return true;
			};

			/**
			 * Ensure initial state is handled correctly
			 **/
			if ( !document.location.hash || document.location.hash === '#' ) {
				History.Adapter.onDomLoad(function(){
					History.log('hash1');
					var currentState = History.getState();
					History.pushState(currentState.data,currentState.title,currentState.url);
				});
			} else if ( !History.emulated.hashChange ) {
				History.log('hash2');
				History.Adapter.onDomLoad(function(){
					_History.onHashChange();
				});
			}

		}
		else {

			/**
			 * _History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			_History.onPopState = function(event,extra){
				History.debug('_History.onPopState',this,arguments);

				// Prepare
				var
					currentStateHashExits				= null,
					stateData										= {},
					stateTitle									= null,
					stateUrl										= null,
					newState										= null;

				// Prepare
				event = event||{};
				event.originalEvent = event.originalEvent||{};
				event.memo = event.memo||{};
				extra = extra||{};

				// Fetch Data
				if ( event.originalEvent.state === null ) {
					// Vanilla: State has no data (original state)
					stateData = event.originalEvent.state;
				} else if ( typeof event.state !== 'undefined' ) {
					// MooTools
					stateData = event.state;
				} else if ( typeof event.memo.state !== 'undefined' ) {
					// Prototype
					stateData = event.memo.state;
				} else if ( typeof extra.state !== 'undefined' ) {
					// jQuery
					stateData = extra.state;
				}
				else if ( typeof event.originalEvent.state !== 'undefined' ) {
					// Vanilla: Back/forward button was used

					// Do we need to use the Chrome Fix
					if ( true ) {
						// Using Chrome Fix
						var
							oldStateUrl = History.expandUrl(document.location.href),
							oldState = _History.getStateByUrl(oldStateUrl),
							duplicateExists = _History.urlDuplicateExists(oldStateUrl);

						// Does oldState Exist?
						if ( typeof oldState !== 'undefined' && !duplicateExists ) {
							stateData = oldState.data;
						}
						else {
							stateData = event.originalEvent.state;
						}
					}
					else {
						// Use the way that should work
						stateData = event.originalEvent.state;
					}
				}

				// Resolve newState
				stateData		= (typeof stateData !== 'object' || stateData === null) ? {} : stateData;
				stateTitle	=	stateData.title||'',
				stateUrl		=	stateData.url||document.location.href,
				newState		=	History.createStateObject(stateData,stateTitle,stateUrl);

				if ( false )
				History.log(
					'_History.onPopState',
					'newState:', newState,
					'oldState:', _History.getStateByUrl(History.expandUrl(document.location.href)),
					'duplicateExists:', _History.urlDuplicateExists(History.expandUrl(document.location.href))
				);

				// Store the State
				_History.storeState(newState);

				// Force update of the title
				if ( newState.title ) {
					document.title = newState.title
				}

				// Update HTML5 State
				History.currentState = newState;

				// Return true
				return true;
			};
			History.Adapter.bind(window,'popstate',_History.onPopState);

			/**
			 * History.pushStateAndTrigger(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url){
				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Store the newState
				_History.storeState(newState);

				// Push the newState
				history.pushState(newState.data,newState.title,newState.url);

				// Fire HTML5 Event
				History.Adapter.trigger(window,'popstate',{
					'state': newState.data
				});

				// Return true
				return true;
			}

			/**
			 * History.replaceStateAndTrigger(data,title,url)
			 * Replace the State and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.replaceState = function(data,title,url){
				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Store the newState
				_History.storeState(newState);

				// Push the newState
				history.replaceState(newState.data,newState.title,newState.url);

				// Fire HTML5 Event
				History.Adapter.trigger(window,'popstate',{
					'state': newState.data
				});

				// Return true
				return true;
			}

		}

		// ----------------------------------------------------------------------
		// HTML4 State Aliases
		// We do not support go, as we cannot guarantee correct positioning due to discards

		History.back = function(){
			return history.go(-1);
		}
		History.forward = function(){
			return history.go(1);
		}

	}; // init

	// Check Load Status
	if ( typeof History.Adapter !== 'undefined' ) {
		// Adapter loaded faster than History.js, fire init.
		History.init();
	}

})(window);
