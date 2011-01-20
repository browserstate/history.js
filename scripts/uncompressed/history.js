// History.js
// New-BSD License, Copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>

(function(window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// Localise Globals
	var
		History = window.History||{},
		history = window.history,
		debug = true;

	// Check Existence of History.js
	if ( typeof History.emulated !== 'undefined' ) {
		throw new Error('History.js has already been emulated...');
	}

	// Initialise
	History.init = function(){
		if(debug)console.info('History.init',this,arguments);

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

		// ----------------------------------------------------------------------
		// General Helper Functions

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param string hash
		 * @return string
		 */
		History.setHash = function(hash){
			if(debug)console.info('History.setHash',this,arguments);
			document.location.hash = hash;
			return hash;
		};

		/**
		 * History.getHash()
		 * Gets the current document hash
		 * @return string
		 */
		History.getHash = function(){
			if(debug)console.info('History.getHash',this,arguments);
			var hash = History.extractHash(document.location.hash);
			return hash;
		};

		/**
		 * History.extractHash(url)
		 * Extracts the Hash from a URL
		 * @param string url
		 * @return string url
		 */
		History.extractHash = function(url){
			if(debug)console.info('History.extractHash',this,arguments);
			// Extract the hash
			var hash = String(url)
				.replace(/^[^#]*#/, '')	/* strip anything before the first anchor (including the # symbol) */
				.replace(/^#+|#+$/, '') /* strip anything after the anchor (the second anchor) (including the # symbol) */
				;

			// Return hash
			return hash;
		};

		/**
		 * History.extractUrl(url)
		 * Extracts the Url from a URL (removes the hash)
		 * @param string url
		 * @return string url
		 */
		History.extractUrl = function(url){
			if(debug)console.info('History.extractUrl',this,arguments);

			// Extract the url
			var justTheUrl = String(url)
				.replace(/^#+|#+$/, '') /* strip anything after the anchor (including the # symbol) */
				;

			// Return hash
			return justTheUrl;
		};

		/**
		 * History.currentState
		 * The current State that we exist in.
		 */
		History.currentState = null;

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @return object {data,title,url}
		 */
		History.getState = function(){
			if(debug)console.info('History.getState',this,arguments);
			return History.currentState;
		};

		/**
		 * History.getStateObject(data,title,url)
		 * Creates a object based on the data, title and url state params
		 * @param object data
		 * @param string title
		 * @param string url
		 * @return object
		 */
		History.getStateObject = function(data,title,url){
			if(debug)console.info('History.getStateObject',this,arguments);
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
		 * @param object data
		 * @param string title
		 * @param string url
		 * @return string
		 */
		History.getStateHash = function(data,title,url){
			if(debug)console.info('History.getStateHash',this,arguments);
			// Hashify
			var StateHash = JSON.stringify(History.getStateObject(data,title,url));

			// Return hash
			return StateHash;
		};

		/**
		 * Refresh the Current State
		 */
		History.Adapter.bind(window,'popstate',function(event){
			if(debug)console.info('History.popstate',this,arguments);
			// Prepare
			var State = History.getStateObject(event.state,document.title,document.location.href);

			// Update
			History.currentState = State;

			// Return true
			return true;
		});

		// ----------------------------------------------------------------------
		// HTML4 HashChange Support

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

					// Insert a iFrame
					var
						iframeId = 'historyjs-iframe',
						iframeHTML = '<iframe id="'+iframeId+'" style="display: none;"></iframe>';
					document.body.open();
					document.body.innerHTML += iframeHTML;
					document.body.close();

					// Fetch the iFrame Element
					var iframe = document.getElementById('iframe');

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
							iframeHash = History.extractHash(History.$iframe.contentWindow.document.location.hash);

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Create a history entry in the iframe
							iframe.contentWindow.document.open();
							iframe.contentWindow.document.close();

							// Update the iframe's hash
							iframe.contentWindow.document.location.hash = documentHash;
							lastIframeHash = iframeHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger('window','hashchange'); // initHashChangeEvent
						}

						// The iFrame Hash has changed (back button caused)
						else if ( iframeHash !== lastIframeHash ) {
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
						var
							documentHash = History.getHash();

						// The Document Hash has changed (application caused)
						if ( documentHash !== lastDocumentHash ) {
							// Equalise
							lastDocumentHash = documentHash;

							// Trigger Hashchange Event
							History.Adapter.trigger('window','hashchange'); // initHashChangeEvent
						}

						// Return true
						return true;
					};
				}

				// Apply the checker function
				setInterval(checker, 200);

				// Return true
				return true;

			}); // closure

		} // if

		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * We must emulate the HTML5 State Management by using HTML4 HashChange
			 */

			/**
			 * Trigger HTML5's window.onpopstate via HTML4 HashChange Support
			 */
			History.Adapter.bind(window,'hashchange',function(event){
				if(debug)console.info('History.hashchange',this,arguments);
				// Prepare
				var
					newURL = event.newURL||document.location;

				// Fetch the new and old States
				var
					newStateHash = unescape(History.extractHash(newURL)),
					newState = JSON.parse(newStateHash),
					oldState = History.getState(),
					oldStateHash = History.getStateHash(oldState.data, oldState.title, oldState.url);

				// Check if we are the same state
				if ( newStateHash === oldStateHash ) {
					// There has been no change (just the page's hash has finally propagated)
					return false;
				}

				// Check if we are DiscardedState
				if ( History.discardedState(newState) ) {
					// Ignore this state as it has been discarded and go back to the state before it
					history.go(-1);
					return false;
				}

				// Push the new HTML5 State
				console.log(newState);
				History.pushState(newState.data,newState.title,newState.url);

				// Return true
				return true;
			});

			/**
			 * History.ignoredStates
			 * A hashed array of discarded states
			 */
			History.discardedStates = {};

			/**
			 * History.discardState(data,title,url)
			 * Discards the state by ignoring it through History
			 * @param object data
			 * @param string title
			 * @param string url
			 * @return true
			 */
			History.discardState = function(data,title,url){
				if(debug)console.info('History.discardState',this,arguments);
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
			 * @param object data
			 * @param string title
			 * @param string url
			 * @return bool
			 */
			History.discardedState = function(data,title,url){
				if(debug)console.info('History.discardedState',this,arguments);
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
			 * @param object data
			 * @param string title
			 * @param string url
			 * @return true
			 */
			History.recycleState = function(data,title,url){
				if(debug)console.info('History.recycleState',this,arguments);
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
			 * @param object data
			 * @param string title
			 * @param string url
			 * @return true
			 */
			History.pushState = function(data,title,url){
				if(debug)console.info('History.pushState',this,arguments);
				// Recycle the State
				History.recycleState(data,title,url);

				// Fetch the State Object
				var
					State = History.getStateObject(data,title,url),
					StateHash = History.getStateHash(data,title,url);

				// Fire HTML5 Event
				History.Adapter.trigger(window,'popstate',{
					'state': State.data
				});

				// Update HTML5 State
				History.currentState = State;

				// Update HTML4 Hash
				History.setHash(escape(StateHash));

				// Return true
				return true;
			};

			/**
			 * History.replaceState(data,title,url)
			 * Replaces the current State with the new State
			 * @param object data
			 * @param string title
			 * @param string url
			 * @return true
			 */
			History.replaceState = function(state,title,url){
				if(debug)console.info('History.replaceState',this,arguments);
				// Get Current State
				var State = History.getState();

				// Push New State
				History.pushState(state,title,data);

				// Discard Old State
				History.discardState(State.data, State.title, State.url);

				// Return true
				return true;
			};

		}
		else {
			History.pushState = function(){
				history.pushState.apply(history,arguments);
			}
			History.replaceState = function(){
				history.replaceState.apply(history,arguments);
			}
			History.go = function(){
				history.go.apply(history,arguments);
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
