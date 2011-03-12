/**
 * History.js HTML5 Support
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// History Object
	window.History = window.History||{};
	window._History = window._History||{};

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		_History = window._History, // Private History Object
		History = window.History, // Public History Object
		history = window.history; // Old History Object

	// Check Existence of History.js
	if ( typeof History.initHtml5 !== 'undefined' ) {
		throw new Error('History.js HTML5 Support has already been loaded...');
	}

	// Initialise
	History.initHtml5 = function(){

		// ----------------------------------------------------------------------
		// Check Status

		if ( typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// ----------------------------------------------------------------------
		// Debug Helpers

		/**
		 * History.options
		 * Configurable options
		 */
		History.options = {
			/**
			 * History.options.hashChangeCheckerDelay
			 * How long should the interval be before hashchange checks
			 */
			hashChangeCheckerDelay: 100,
			/**
			 * History.options.busyDelay
			 * How long should we wait between busy events
			 */
			busyDelay: 250
		};

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
			// Prepare
			var
				consoleExists = (typeof console !== 'undefined'),
				textarea = document.getElementById('log'),
				message = ("\n"+arguments[0]+"\n"),
				i
				;

			// Write to Console
			if ( consoleExists ) {
				var
					args = Array.prototype.slice.call(arguments),
					message = args.shift();
				if ( typeof console.debug !== 'undefined' ) {
					console.debug.apply(console,[message,args]);
				}
				else {
					console.log.apply(console,[message,args]);
				}
			}

			// Write to log
			for ( i=1,n=arguments.length; i<n; ++i ) {
				var arg = arguments[i];
				if ( typeof arg === 'object' && typeof JSON !== 'undefined' ) {
					try {
						arg = JSON.stringify(arg);
					}
					catch ( Exception ) {
						// Recursive Object
					}
				}
				message += "\n"+arg+"\n";
			}

			// Textarea
			if ( textarea ) {
				textarea.value += message+"\n-----\n";
				textarea.scrollTop = textarea.scrollHeight - textarea.clientHeight;
			}
			// No Textarea, No Console
			else if ( !consoleExists ) {
				alert(message);
			}

			// Return true
			return true;
		};

		// ----------------------------------------------------------------------
		// Emulated Status

		/**
		 * _History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		_History.getInternetExplorerMajorVersion = function(){
			var result = _History.getInternetExplorerMajorVersion.cached =
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
			return result;
		};

		/**
		 * _History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 */
		_History.isInternetExplorer = function(){
			var result = _History.isInternetExplorer.cached =
					(typeof _History.isInternetExplorer.cached !== 'undefined')
				?	_History.isInternetExplorer.cached
				:	(_History.getInternetExplorerMajorVersion() !== 0)
				;
			return result;
		};

		/**
		 * History.emulated
		 * Which features require emulating?
		 */
		History.emulated = {
			pushState: !Boolean(
				window.history && window.history.pushState && window.history.replaceState
				&& !/ Mobile\/(7W367a|8A400|8B117|8C134) /.test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
			)
		};

		/**
		 * _History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		_History.isEmptyObject = function(obj) {
			for ( var key in obj ) {
				if ( !this.hasOwnProperty(key) ) {
					continue;
				}
				return false;
			}
			return true;
		};

		/**
		 * _History.cloneObject(obj)
		 * Clones a object
		 * @param {Object} obj
		 * @return {Object}
		 */
		_History.cloneObject = function(obj) {
			var hash,newObj;
			if ( obj ) {
				hash = JSON.stringify(obj);
				newObj = JSON.parse(hash);
			}
			else {
				newObj = {};
			}
			return newObj;
		};

		// ----------------------------------------------------------------------
		// URL Helpers

		History.getRootUrl = function(){
			// Create
			var rootUrl = document.location.protocol+'//'+(document.location.hostname||document.location.host);
			if ( document.location.port||false ) {
				rootUrl += ':'+document.location.port;
			}
			rootUrl += '/';

			// Return
			return rootUrl;
		};

		History.getBaseHref = function(){
			// Create
			var
				baseElements = document.getElementsByTagName('base'),
				baseElement = null,
				baseHref = '';

			// Test for Base Element
			if ( baseElements.length === 1 ) {
				// Prepare for Base Element
				baseElement = baseElements[0];
				baseHref = baseElement.href.replace(/[^\/]+$/,'');
			}

			// Adjust trailing slash
			baseHref = baseHref.replace(/\/+$/,'');
			if ( baseHref ) baseHref += '/';

			// Return
			return baseHref;
		};

		History.getBaseUrl = function(){
			// Create
			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

			// Return
			return baseUrl;
		};

		History.getPageUrl = function(){
			// Create
			var basePage = document.location.href.replace(/\/+$/,'');

			// Return
			return basePage;
		};

		History.getBasePageUrl = function(){
			// Create
			var basePage = document.location.href.replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return /\./.test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePage;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getFullUrl = function(url){
			// Prepare
			var fullUrl = url, firstChar = url.substring(0,1);

			// Check
			if ( /[a-z]+\:\/\//.test(url) ) {
				// Full URL
			}
			else if ( firstChar === '/' ) {
				// Root URL
				fullUrl = History.getRootUrl()+url;
			}
			else if ( firstChar === '#' ) {
				// Anchor URL
				fullUrl = History.getPageUrl().replace(/#.*/,'')+url;
			}
			else if ( firstChar === '?' ) {
				// Query URL
				fullUrl = History.getPageUrl().replace(/[\?#].*/,'')+url;
			}
			else {
				// Relative URL
				fullUrl = History.getBaseUrl()+url;
			}

			// Return
			return fullUrl;
		};

		/**
		 * History.getShortUrl(url)
		 * Ensures that we have a relative URL and not a absolute URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getShortUrl = function(url){
			// Prepare
			var shortUrl, rootUrl = History.getRootUrl();

			// Adjust
			shortUrl = url.replace(rootUrl,'/');

			// Return
			return shortUrl;
		};

		// ----------------------------------------------------------------------
		// State Object Helpers

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
				'url': History.getFullUrl(oldState.url||''),
				'title': oldState.title||''
			};
			newState.data.title = newState.data.title||newState.title;
			newState.data.url = newState.data.url||newState.url;
			return newState;
		};

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
				'data': data,
				'title': title,
				'url': url
			};

			// Expand the State
			State = History.expandState(State);

			// Return object
			return State;
		};

		/**
		 * History.expandHash(hash)
		 * Expands a Hash into a StateHash if applicable
		 * @param {string} hash
		 * @return {Object|null} State
		 */
		History.expandHash = function(hash){
			// Prepare
			var State = null;

			// Check
			if ( hash === '' ) {
				State = History.createStateObject();
			}
			else {
				// JSON
				try {
					State = JSON.parse(hash);
				}
				catch ( Exception ) {
					var
						parts = /(.*)\/uid=([0-9]+)$/.exec(hash),
						url = parts ? (parts[1]||hash) : hash,
						uid = parts ? String(parts[2]||'') : '';

					if ( uid ) {
						State = _History.getStateByUid(uid)||null;
					}

					if ( !State && /\//.test(hash) ) {
						// Is a URL
						var expandedUrl = History.getFullUrl(hash);
						State = History.createStateObject(null,null,expandedUrl);
					}
					else {
						// Non State Hash
						// do nothing
					}
				}
			}

			// Expand
			State = State ? History.expandState(State) : null;

			// Return State
			return State;
		};

		/**
		 * History.contractState(State)
		 * Creates a Hash for the State Object
		 * @param {object} passedState
		 * @return {string} hash
		 */
		History.contractState = function(passedState){
			// Check
			if ( !passedState ) {
				return null;
			}

			// Prepare
			var
				hash = null,
				State = _History.cloneObject(passedState);

			// Ensure State
			if ( State ) {
				// Clean
				State.data = State.data||{};
				delete State.data.title;
				delete State.data.url;

				// Handle
				if ( _History.isEmptyObject(State) && !State.title ) {
					hash = History.getShortUrl(State.url);
				}
				else {
					// Serialised Hash
					hash = JSON.stringify(State);

					// Has it been associated with a UID?
					var uid;
					if ( typeof _History.hashesToUids[hash] !== 'undefined' ) {
						uid = _History.hashesToUids[hash];
					}
					else {
						while ( true ) {
							uid = String(Math.floor(Math.random()*1000));
							if ( typeof _History.uidsToStates[uid] === 'undefined' ) {
								break;
							}
						}
					}

					// Associate UID with Hash
					_History.hashesToUids[hash] = uid;
					_History.uidsToStates[uid] = State;

					// Simplified Hash
					hash = History.getShortUrl(State.url)+'/uid='+uid;
				}
			}

			// Return hash
			return hash;
		};

		/**
		 * _History.uidsToStates
		 * UIDs to States
		 */
		_History.uidsToStates = {};

		/**
		 * _History.hashesToUids
		 * Serialised States to UIDs
		 */
		_History.hashesToUids = {};

		/**
		 * _History.getStateByUid(uid)
		 * Get a state by it's UID
		 * @param {string} uid
		 */
		_History.getStateByUid = function(uid){
			uid = String(uid);
			var State = _History.uidsToStates[uid]||undefined;
			return State;
		};


		// ----------------------------------------------------------------------
		// State Storage

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
		 * _History.savedStates
		 * Store the states in an array
		 */
		_History.savedStates = [];

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getState = function(){
			return _History.getStateByIndex();
		};

		/**
		 * History.getStateHash()
		 * Get the hash of the current state
		 * @return {string} hash
		 */
		History.getStateHash = function(){
			return History.contractState(History.getState());
		};

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
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		_History.storeState = function(newState){
			// Prepare
			var
				newStateHash = History.contractState(newState),
				oldState = _History.getStateByUrl(newState.url);

			// Check for Conflict
			if ( typeof oldState !== 'undefined' ) {
				// Compare Hashes
				var oldStateHash = History.contractState(oldState);
				if ( oldStateHash !== newStateHash ) {
					// We have a conflict
					_History.duplicateStateUrls[newState.url] = true;
				}
			}

			// Store the State
			_History.statesByUrl[newState.url] = _History.statesByHash[newStateHash] = newState;

			// Return newState
			return newState;
		};

		/**
		 * _History.isLastState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		_History.isLastState = function(newState){
			// Prepare
			var
				newStateHash = History.contractState(newState),
				oldStateHash = History.getStateHash();

			// Check
			var isLast = _History.savedStates.length && newStateHash === oldStateHash;

			// Return isLast
			return isLast;
		};

		/**
		 * _History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {boolean} changed
		 */
		_History.saveState = function(newState){
			// Check Hash
			if ( _History.isLastState(newState) ) {
				return false;
			}

			// Push the State
			_History.savedStates.push(newState);

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
				State = _History.savedStates[_History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				State = _History.savedStates[_History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				State = _History.savedStates[index];
			}

			// Return State
			return State;
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
		// Hash Helpers

		/**
		 * History.getHash()
		 * Gets the current document hash
		 * @return {string}
		 */
		History.getHash = function(){
			var hash = _History.unescapeHash(document.location.hash);
			return hash;
		};

		/**
		 * _History.unescapeHash()
		 * Normalise and Unescape a Hash
		 * @return {string}
		 */
		_History.unescapeHash = function(hash){
			var result = _History.normalizeHash(hash);

			// Unescape hash
			if ( /[\%]/.test(result) ) {
				result = unescape(result);
			}

			// Return result
			return result;
		};

		/**
		 * _History.normalizeHash()
		 * Normalise a hash across browsers
		 * @return {string}
		 */
		_History.normalizeHash = function(hash){
			var result = hash.replace(/[^#]*#/,'').replace(/#.*/, '');

			// Return result
			return result;
		};

		/**
		 * History.setHash(hash)
		 * Sets the document hash
		 * @param {string} hash
		 * @return {History}
		 */
		History.setHash = function(hash,queue){
			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				History.debug('History.setHash: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.setHash,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Prepare
			var adjustedHash = _History.escapeHash(hash);

			// Log hash
			History.debug('History.setHash',this,arguments,'hash:',hash,'adjustedHash:',adjustedHash,'oldHash:',document.location.hash);

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			var State = History.expandHash(hash);
			if ( State ) {
				// Hash is a state so skip the setHash
				History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',this,arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( document.location.hash !== adjustedHash ) {

				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( !History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' ) {
					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

					// Fetch the base page
					var pageUrl = History.getPageUrl();

					// Safari hash apply
					History.pushState(null,null,pageUrl+'#'+adjustedHash,false);
				}
				else {
					// Normal hash apply
					document.location.hash = adjustedHash;
				}
			}

			// Chain
			return History;
		};

		/**
		 * _History.escape()
		 * Normalise and Escape a Hash
		 * @return {string}
		 */
		_History.escapeHash = function(hash){
			var result = _History.normalizeHash(hash);

			// Escape hash
			if ( /[^a-zA-Z0-9\/\-\_\%\.]/.test(result) ) {
				result = escape(result);
			}

			// Return result
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

			// Unescape hash
			hash = _History.unescapeHash(hash);

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
				isTraditionalAnchor = typeof el !== 'undefined';

			// Return isTraditionalAnchor
			return isTraditionalAnchor;
		};

		// ----------------------------------------------------------------------
		// Queueing

		/**
		 * History.queues
		 * The list of queues to use
		 * First In, First Out
		 */
		History.queues = [];

		/**
		 * History.busy(value)
		 * @param {boolean} value [optional]
		 * @return {boolean} busy
		 */
		History.busy = function(value){
			History.debug('History.busy: called: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues);

			// Apply
			if ( typeof value !== 'undefined' ) {
				History.busy.flag = value;
			}
			// Default
			else if ( typeof History.busy.flag === 'undefined' ) {
				History.busy.flag = false;
			}

			// Queue
			if ( !History.busy.flag ) {
				// Execute the next item in the queue
				clearTimeout(History.busy.timeout);
				var fireNext = function(){
					if ( History.busy.flag ) return;
					for ( var i=History.queues.length-1; i >= 0; --i ) {
						var queue = History.queues[i];
						if ( queue.length === 0 ) continue;
						var item = queue.shift();
						History.debug('History.busy: firing', item);
						History.fireQueueItem(item);
						History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
					}
				};
				History.busy.timeout = setTimeout(fireNext,History.options.busyDelay);
			}

			// Return
			return History.busy.flag;
		};

		/**
		 * History.fireQueueItem(item)
		 * Fire a Queue Item
		 * @param {Object} item
		 * @return {Mixed} result
		 */
		History.fireQueueItem = function(item){
			return item.callback.apply(item.scope||History,item.args||[]);
		};

		/**
		 * History.pushQueue(callback,args)
		 * Add an item to the queue
		 * @param {Object} item [scope,callback,args,queue]
		 */
		History.pushQueue = function(item){
			History.debug('History.pushQueue: called', arguments);

			// Prepare the queue
			History.queues[item.queue||0] = History.queues[item.queue||0]||[];

			// Add to the queue
			History.queues[item.queue||0].push(item);

			// End pushQueue closure
			return true;
		};

		/**
		 * History.queue (item,queue), (func,queue), (func), (item)
		 * Either firs the item now if not busy, or adds it to the queue
		 */
		History.queue = function(item,queue){
			// Prepare
			if ( typeof item === 'function' ) {
				item = {
					callback: item
				};
			}
			if ( typeof queue !== 'undefined' ) {
				item.queue = queue;
			}

			// Handle
			if ( History.busy() ) {
				History.pushQueue(item);
			} else {
				History.fireQueueItem(item);
			}

			// End queue closure
			return true;
		};


		// ----------------------------------------------------------------------
		// State Aliases

		History.stateChanged = false;
		History.doubleChecker = null;

		History.doubleCheckComplete = function(){
			// Update
			History.stateChanged = true;

			// Clear
			History.doubleCheckReset();

			// Chain
			return History;
		}

		History.doubleCheckReset = function(){
			// Clear
			if ( History.doubleChecker ) {
				clearTimeout(History.doubleChecker);
				History.doubleChecker = null;
			}

			// Chain
			return History;
		}

		History.doubleCheck = function(tryAgain){
			// Prepare
			var
				safariBug = (!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.'),
				ieBug = (History.emulated.hashChange && _History.isInternetExplorer()),
				hasBug = safariBug || ieBug;

			// Reset
			History.stateChanged = false;
			History.doubleCheckReset();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( hasBug ) {
				// Apply Check
				History.doubleChecker = setTimeout(
					function(){
						History.doubleCheckReset();
						if ( !History.stateChanged ) {
							History.log('History.doubleCheck: State has not yet changed, trying again', arguments);
							// Re-Attempt
							tryAgain();
						}
						return true;
					},
					History.options.hashChangeCheckerDelay*5
				);
			}

			// Chain
			return History;
		};

		/**
		 * History.back(queue)
		 * Send the browser history back one item
		 * @param {Integer} queue [optional]
		 */
		History.back = function(queue){
			History.debug('History.back: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				History.debug('History.back: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.back,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.back(false);
			});

			// Go back
			history.go(-1);

			// End back closure
			return true;
		};

		/**
		 * History.forward(queue)
		 * Send the browser history forward one item
		 * @param {Integer} queue [optional]
		 */
		History.forward = function(queue){
			History.debug('History.forward: called', arguments);

			// Handle Queueing
			if ( queue !== false && History.busy() ) {
				// Wait + Push to Queue
				History.debug('History.forward: we must wait', arguments);
				History.pushQueue({
					scope: History,
					callback: History.forward,
					args: arguments,
					queue: queue
				});
				return false;
			}

			// Make Busy + Continue
			History.busy(true);

			// Fix certain browser bugs that prevent the state from changing
			History.doubleCheck(function(){
				History.forward(false);
			});

			// Go forward
			history.go(1);

			// End forward closure
			return true;
		};

		/**
		 * History.go(index,queue)
		 * Send the browser history back or forward index times
		 * @param {Integer} queue [optional]
		 */
		History.go = function(index,queue){
			History.debug('History.go: called', arguments);

			// Handle
			if ( index > 0 ) {
				// Forward
				for ( var i=1; i<=index; ++i ) {
					History.forward(queue);
				}
			}
			else if ( index < 0 ) {
				// Backward
				for ( var i=-1; i>=index; --i ) {
					History.back(queue);
				}
			}
			else {
				throw new Error('History.go: History.go requires a positive or negative integer passed.');
			}

			// End go closure
			return true;
		};


		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( !History.emulated.pushState ) {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * _History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			_History.onPopState = function(event){
				History.debug('_History.onPopState',this,arguments);

				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle apporiatly
				var currentHash	= unescape(History.getHash());
				if ( currentHash ) {
					// Expand Hash
					var currentState = History.expandHash(currentHash);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						History.debug('_History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.tite, currentState.url, false);
					}
					else {
						// Traditional Anchor
						History.debug('_History.onPopState: traditional anchor', currentHash);
						History.Adapter.trigger(window,'anchorchange');
						History.busy(false);
					}

					// We don't care for hashes
					return false;
				}

				// Prepare
				var
					currentStateHashExits				= null,
					stateData										= {},
					stateTitle									= null,
					stateUrl										= null,
					newState										= null;

				// Prepare
				event = event||{};
				if ( typeof event.state === 'undefined' ) {
					// jQuery
					if ( typeof event.originalEvent !== 'undefined' && typeof event.originalEvent.state !== 'undefined' ) {
						event.state = event.originalEvent.state;
					}
					// MooTools
					else if ( typeof event.event !== 'undefined' && typeof event.event.state !== 'undefined' ) {
						event.state = event.event.state;
					}
				}

				// Fetch Data
				if ( event.state === null ) {
					// Vanilla: State has no data (new state, not pushed)
					stateData = event.state;
				}
				else if ( typeof event.state !== 'undefined' ) {
					// Vanilla: Back/forward button was used

					// Browser Fix
					if ( false ) {
						// Use the way that should work
						stateData = event.state;
					}
					else {
						// Using Chrome Fix
						var
							newStateUrl = History.getFullUrl(document.location.href),
							oldState = _History.getStateByUrl(newStateUrl),
							duplicateExists = _History.urlDuplicateExists(newStateUrl);

						// Does oldState Exist?
						if ( typeof oldState !== 'undefined' && !duplicateExists ) {
							stateData = oldState.data;
						}
						else {
							stateData = event.state;
						}
					}

				}
				else {
					// Vanilla: A new state was pushed, and popstate was called manually

					// Get State object from the last state
					var
						newStateUrl = History.getFullUrl(document.location.href),
						oldState = _History.getStateByUrl(newStateUrl);

					// Check if the URLs match
					if ( oldState && newStateUrl == oldState.url ) {
						stateData = oldState.data;
					}
					else {
						throw new Error('Unknown state');
					}
				}

				// Resolve newState
				stateData		= (typeof stateData !== 'object' || stateData === null) ? {} : stateData;
				stateTitle	=	stateData.title||'',
				stateUrl		=	stateData.url||document.location.href,
				newState		=	History.createStateObject(stateData,stateTitle,stateUrl);

				// Check if we are the same state
				if ( _History.isLastState(newState) ) {
					// There has been no change (just the page's hash has finally propagated)
					History.debug('_History.onPopState: no change', newState, _History.savedStates);
					History.busy(false);
					return false;
				}

				// Log
				History.debug(
					'_History.onPopState',
					'newState:', newState,
					'oldState:', _History.getStateByUrl(History.getFullUrl(document.location.href)),
					'duplicateExists:', _History.urlDuplicateExists(History.getFullUrl(document.location.href))
				);

				// Store the State
				_History.storeState(newState);
				_History.saveState(newState);

				// Force update of the title
				if ( newState.title ) {
					document.title = newState.title
				}

				// Fire Our Event
				History.Adapter.trigger(window,'statechange');
				History.busy(false);

				// Return true
				return true;
			};
			History.Adapter.bind(window,'popstate',_History.onPopState);

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
				// Check the State
				if ( History.extractHashFromUrl(url) && History.emulated.pushState ) {
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

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Store the newState
				_History.storeState(newState);

				// Push the newState
				history.pushState(newState.data,newState.title,newState.url);

				// Fire HTML5 Event
				History.Adapter.trigger(window,'popstate');

				// End pushState closure
				return true;
			}

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
				// Check the State
				if ( History.extractHashFromUrl(url) && History.emulated.pushState ) {
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

				// Make Busy + Continue
				History.busy(true);

				// Create the newState
				var newState = History.createStateObject(data,title,url);

				// Store the newState
				_History.storeState(newState);

				// Push the newState
				history.replaceState(newState.data,newState.title,newState.url);

				// Fire HTML5 Event
				History.Adapter.trigger(window,'popstate');

				// End replaceState closure
				return true;
			}

			/**
			 * Create the initial State
			 */
			_History.saveState(_History.storeState(History.createStateObject({},'',document.location.href)));

			/**
			 * Ensure Cross Browser Compatibility
			 */
			if ( navigator.vendor === 'Apple Computer, Inc.' ) {
				/**
				 * Fix Safari HashChange Issue
				 */
				History.Adapter.bind(window,'hashchange',function(){
					//History.Adapter.trigger(window,'popstate');
					_History.onPopState();
				});
			}

		} // if ( !History.emulated.pushState ) {

	}; // History.initHtml5 = function(){

	// Try Load HTML5 Support
	History.initHtml5();

})(window);
