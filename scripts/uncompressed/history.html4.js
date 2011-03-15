/**
 * History.js HTML4 Support
 * Depends on the HTML5 Support
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// History Object
	window.History = window.History||{};

	// Localise Globals
	var
		document = window.document, // Make sure we are using the correct document
		History = window.History; // Public History Object

	// Check Existence of History.js
	if ( typeof History.initHtml4 !== 'undefined' ) {
		throw new Error('History.js HTML4 Support has already been loaded...');
	}

	// Initialise HTML4 Support
	History.initHtml4 = function(){

		// ----------------------------------------------------------------------
		// Check Status

		if ( typeof History.initHtml5 === 'undefined' || typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// ----------------------------------------------------------------------
		// Emulated Status

		/**
		 * History.emulated
		 * Which features require emulating?
		 */
		History.emulated.hashChange = Boolean(
			!('onhashchange' in window || 'onhashchange' in document)
			||
			(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
		);



		// ----------------------------------------------------------------------
		// Hash Storage

		/**
		 * History.savedHashes
		 * Store the hashes in an array
		 */
		History.savedHashes = [];

		/**
		 * History.isLastHash(newHash)
		 * Checks if the hash is the last hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.isLastHash = function(newHash){
			// Prepare
			var oldHash = History.getHashByIndex();

			// Check
			var isLast = newHash === oldHash;

			// Return isLast
			return isLast;
		};

		/**
		 * History.saveHash(newHash)
		 * Push a Hash
		 * @param {string} newHash
		 * @return {boolean} true
		 */
		History.saveHash = function(newHash){
			// Check Hash
			if ( History.isLastHash(newHash) ) {
				return false;
			}

			// Push the Hash
			History.savedHashes.push(newHash);

			// Return true
			return true;
		};

		/**
		 * History.getHashByIndex()
		 * Gets a hash by the index
		 * @param {integer} index
		 * @return {string}
		 */
		History.getHashByIndex = function(index){
			// Prepare
			var hash = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				hash = History.savedHashes[History.savedHashes.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				hash = History.savedHashes[History.savedHashes.length+index];
			}
			else {
				// Get from the beginning
				hash = History.savedHashes[index];
			}

			// Return hash
			return hash;
		};

		// ----------------------------------------------------------------------
		// Discarded States

		/**
		 * History.discardedHashes
		 * A hashed array of discarded hashes
		 */
		History.discardedHashes = {};

		/**
		 * History.discardedStates
		 * A hashed array of discarded states
		 */
		History.discardedStates = {};

		/**
		 * History.discardState(State)
		 * Discards the state by ignoring it through History
		 * @param {object} State
		 * @return {true}
		 */
		History.discardState = function(discardedState,forwardState,backState){
			History.debug('History.discardState',this,arguments);
			// Prepare
			var discardedStateHash = History.getStateHash(discardedState);

			// Create Discard Object
			var discardObject = {
				'discardedState': discardedState,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to DiscardedStates
			History.discardedStates[discardedStateHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardHash(hash)
		 * Discards the hash by ignoring it through History
		 * @param {string} hash
		 * @return {true}
		 */
		History.discardHash = function(discardedHash,forwardState,backState){
			History.debug('History.discardState',this,arguments);
			// Create Discard Object
			var discardObject = {
				'discardedHash': discardedHash,
				'backState': backState,
				'forwardState': forwardState
			};

			// Add to discardedHash
			History.discardedHashes[discardedHash] = discardObject;

			// Return true
			return true;
		};

		/**
		 * History.discardState(State)
		 * Checks to see if the state is discarded
		 * @param {object} State
		 * @return {bool}
		 */
		History.discardedState = function(State){
			// Prepare
			var StateHash = History.getStateHash(State);

			// Check
			var discarded = History.discardedStates[StateHash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.discardedHash(hash)
		 * Checks to see if the state is discarded
		 * @param {string} State
		 * @return {bool}
		 */
		History.discardedHash = function(hash){
			// Check
			var discarded = History.discardedHashes[hash]||false;

			// Return true
			return discarded;
		};

		/**
		 * History.recycleState(State)
		 * Allows a discarded state to be used again
		 * @param {object} data
		 * @param {string} title
		 * @param {string} url
		 * @return {true}
		 */
		History.recycleState = function(State){
			History.debug('History.recycleState',this,arguments);
			// Prepare
			var StateHash = History.getStateHash(State);

			// Remove from DiscardedStates
			if ( History.discardedState(State) ) {
				delete History.discardedStates[StateHash];
			}

			// Return true
			return true;
		};

	// ----------------------------------------------------------------------
		// HTML4 HashChange Support

		if ( History.emulated.hashChange ) {
			/*
			 * We must emulate the HTML4 HashChange Support by manually checking for hash changes
			 */

			History.Adapter.onDomLoad(function(){
				// Define our Checker Function
				History.checkerFunction = null;

				// Handle depending on the browser
				if ( History.isInternetExplorer() ) {
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
						lastIframeHash = null,
						checkerRunning = false;

					// Define the checker function
					History.checkerFunction = function(){
						// Check Running
						if ( checkerRunning ) {
							History.debug('hashchange.checker: checker is running');
							return false;
						}

						// Update Running
						checkerRunning = true;

						// Fetch
						var
							documentHash = History.getHash(),
							iframeHash = History.unescapeHash(iframe.contentWindow.document.location.hash);

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Create a history entry in the iframe
							if ( iframeHash !== documentHash ) {
								History.debug('hashchange.checker: iframe hash change', 'documentHash (new):', documentHash, 'iframeHash (old):', iframeHash);

								// Equalise
								lastIframeHash = iframeHash = documentHash;

								// Create History Entry
								iframe.contentWindow.document.open();
								iframe.contentWindow.document.close();

								// Update the iframe's hash
								iframe.contentWindow.document.location.hash = History.escapeHash(documentHash);
							}

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// The iFrame Hash has changed (back button caused)
						else if ( iframeHash !== lastIframeHash ) {
							History.debug('hashchange.checker: iframe hash out of sync', 'iframeHash (new):', iframeHash, 'documentHash (old):', documentHash);

							// Equalise
							lastIframeHash = iframeHash;

							// Update the Hash
							History.setHash(iframeHash,false);
						}

						// Reset Running
						checkerRunning = false;

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
					History.checkerFunction = function(){
						// Prepare
						var documentHash = History.getHash();

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger(window,'hashchange');
						}

						// Return true
						return true;
					};
				}

				// Apply the checker function
				setInterval(History.checkerFunction, History.options.hashChangeInterval);

				// End onDomLoad closure
				return true;
			});

		}

		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * History.onHashChange(event)
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			History.onHashChange = function(event){
				History.debug('History.onHashChange',this,arguments);
				// Prepare
				var
					currentUrl						= (event && event.newURL) || document.location.href;
					currentHash						= unescape(History.extractHashByUrl(currentUrl)),
					currentState					= null,
					currentStateHash			= null,
					currentStateHashExits	= null;

				// Check if we are the same state
				if ( History.isLastHash(currentHash) ) {
					// There has been no change (just the page's hash has finally propagated)
					History.debug('History.onHashChange: no change');
					History.busy(false);
					return false;
				}

				// Store our location for use in detecting back/forward direction
				History.saveHash(currentHash);

				// Expand Hash
				currentState = History.getHashState(currentHash);
				if ( !currentState ) {
					// Traditional Anchor Hash
					History.debug('History.onHashChange: traditional anchor', currentHash);
					History.Adapter.trigger(window,'anchorchange');
					History.busy(false);
					return false;
				}

				// Check if we are the same state
				if ( History.isLastState(currentState) ) {
					// There has been no change (just the page's hash has finally propagated)
					History.debug('History.onHashChange: no change');
					History.busy(false);
					return false;
				}

				// Create the state Hash
				currentStateHash = History.getStateHash(currentState);

				// Log
				History.debug('History.onHashChange: ',
					'currentStateHash',
					currentStateHash,
					'Hash -1',
					History.getHashByIndex(-1),
					'Hash -2',
					History.getHashByIndex(-2),
					'Hash -3',
					History.getHashByIndex(-3),
					'Hash -4',
					History.getHashByIndex(-4),
					'Hash -5',
					History.getHashByIndex(-5),
					'Hash -6',
					History.getHashByIndex(-6),
					'Hash -7',
					History.getHashByIndex(-7)
				);

				// Check if we are DiscardedState
				var discardObject = History.discardedState(currentState);
				if ( discardObject ) {
					History.debug('forwardState:',History.getStateHash(discardObject.forwardState),'backState:',History.getStateHash(discardObject.backState));
					// Ignore this state as it has been discarded and go back to the state before it
					if ( History.getHashByIndex(-2) === History.getStateHash(discardObject.forwardState) ) {
						// We are going backwards
						History.debug('History.onHashChange: go backwards');
						History.back(false);
					} else {
						// We are going forwards
						History.debug('History.onHashChange: go forwards');
						History.forward(false);
					}
					History.busy(false);
					return false;
				}

				// Push the new HTML5 State
				History.debug('History.onHashChange: success hashchange');
				History.pushState(currentState.data,currentState.title,currentState.url,false);

				// End onHashChange closure
				return true;
			};
			History.Adapter.bind(window,'hashchange',History.onHashChange);

			/**
			 * History.pushState(data,title,url)
			 * Add a new State to the history object, become it, and trigger onpopstate
			 * We have to trigger for HTML4 compatibility
			 * @param {object} data
			 * @param {string} title
			 * @param {string} url
			 * @return {true}
			 */
			History.pushState = function(data,title,url,queue){
				History.debug('History.pushState',this,arguments);

				// Check the State
				if ( History.extractHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					History.debug('History.pushState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.pushState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Object
				var
					newState = History.createStateObject(data,title,url),
					newStateHash = History.getStateHash(newState),
					oldState = History.getState(false),
					oldStateHash = History.getStateHash(),
					html4Hash = unescape(History.getHash());

				// Store the newState
				History.storeState(newState);

				// Recycle the State
				History.recycleState(newState);

				// Force update of the title
				if ( document.title !== newState.title ) {
					document.title = newState.title
					try {
						document.getElementsByTagName('title')[0].innerHTML = newState.title;
					}
					catch ( Exception ) { }
				}

				History.debug(
					'History.pushState: details',
					'newStateHash:', newStateHash,
					'oldStateHash:', oldStateHash,
					'html4Hash:', html4Hash
				);

				// Check if we are the same State
				if ( newStateHash === oldStateHash ) {
					History.debug('History.pushState: no change', newStateHash);
					return false;
				}

				// Update HTML4 Hash
				if ( newStateHash !== html4Hash && newStateHash !== History.getShortUrl(document.location.href) ) {
					History.debug('History.pushState: update hash', newStateHash, html4Hash);
					History.setHash(newStateHash,false);
					return false;
				}

				// Update HTML5 State
				History.saveState(newState);

				// Fire HTML5 Event
				History.debug('History.pushState: trigger popstate');
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// End pushState closure
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
			History.replaceState = function(data,title,url,queue){
				History.debug('History.replaceState',this,arguments);
				// Check the State
				if ( History.extractHashByUrl(url) ) {
					throw new Error('History.js does not support states with fragement-identifiers (hashes/anchors).');
				}

				// Handle Queueing
				if ( queue !== false && History.busy() ) {
					// Wait + Push to Queue
					History.debug('History.replaceState: we must wait', arguments);
					History.pushQueue({
						scope: History,
						callback: History.replaceState,
						args: arguments,
						queue: queue
					});
					return false;
				}

				// Make Busy
				History.busy(true);

				// Fetch the State Objects
				var
					newState 				= History.createStateObject(data,title,url),
					oldState 				= History.getState(false),
					previousState 	= History.getStateByIndex(-2)

				// Discard Old State
				History.discardState(oldState,newState,previousState);

				// Alias to PushState
				History.pushState(newState.data,newState.title,newState.url,false);

				// End replaceState closure
				return true;
			};

			/**
			 * Create the initial State
			 */
			History.saveState(History.storeState(History.createStateObject({},'',document.location.href)));

			/**
			 * Ensure initial state is handled correctly
			 **/
			if ( document.location.hash && document.location.hash !== '#' && !History.emulated.hashChange ) {
				History.debug('Firefox Initial State Change Fix');
				History.Adapter.onDomLoad(function(){
					History.onHashChange();
				});
			}

		} // if ( History.emulated.pushState ) {

	}; // History.initHtml4 = function(){


	// Try Load HTML4 Support
	History.initHtml4();

})(window);
