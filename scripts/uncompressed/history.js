/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		History = window.History = window.History||{}, // Public History Object
		history = window.history; // Old History Object

	// Check Existence
	if ( typeof History.init !== 'undefined' ) {
		throw new Error('History.js Core has already been loaded...');
	}

	// Initialise History
	History.init = function(){
		// Check Load Status of Adapter
		if ( typeof History.Adapter === 'undefined' ) {
			return false;
		}

		// Check Load Status of Core
		if ( typeof History.initCore !== 'undefined' ) {
			History.initCore();
		}

		// Check Load Status of HTML4 Support
		if ( typeof History.initHtml4 !== 'undefined' ) {
			History.initHtml4();
		}

		// Return true
		return true;
	};

	// --------------------------------------------------------------------------
	// Initialise Core

	// Initialise Core
	History.initCore = function(){
		// Initialise
		if ( typeof History.initCore.initialized !== 'undefined' ) {
			// Already Loaded
			return false;
		}
		else {
			History.initCore.initialized = true;
		}

		// ----------------------------------------------------------------------
		// Options

		/**
		 * History.options
		 * Configurable options
		 */
		History.options = History.options||{};

		/**
		 * History.options.hashChangeInterval
		 * How long should the interval be before hashchange checks
		 */
		History.options.hashChangeInterval = 100;

		/**
		 * History.options.safariPollInterval
		 * How long should the interval be before safari poll checks
		 */
		History.options.safariPollInterval = 500;

		/**
		 * History.options.busyDelay
		 * How long should we wait between busy events
		 */
		History.options.busyDelay = 250;

		/**
		 * History.options.debug
		 * If true will enable debug messages to be logged
		 */
		History.options.debug = false;


		// ----------------------------------------------------------------------
		// Debug

		/**
		 * History.debug(message,...)
		 * Logs the passed arguments if debug enabled
		 */
		History.debug = function(){
			if ( (History.options.debug||false) ) {
				History.log.apply(History,arguments);
			}
		};

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
		 * History.getInternetExplorerMajorVersion()
		 * Get's the major version of Internet Explorer
		 * @return {integer}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 * @author James Padolsey <https://gist.github.com/527683>
		 */
		History.getInternetExplorerMajorVersion = function(){
			var result = History.getInternetExplorerMajorVersion.cached =
					(typeof History.getInternetExplorerMajorVersion.cached !== 'undefined')
				?	History.getInternetExplorerMajorVersion.cached
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
		 * History.isInternetExplorer()
		 * Are we using Internet Explorer?
		 * @return {boolean}
		 * @license Public Domain
		 * @author Benjamin Arthur Lupton <contact@balupton.com>
		 */
		History.isInternetExplorer = function(){
			var result = History.isInternetExplorer.cached =
					(typeof History.isInternetExplorer.cached !== 'undefined')
				?	History.isInternetExplorer.cached
				:	(History.getInternetExplorerMajorVersion() !== 0)
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
		 * History.bugs
		 * Which bugs are present
		 */
		History.bugs = {
			/**
			 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
			 * https://bugs.webkit.org/show_bug.cgi?id=56249
			 */
			setHash: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2][0-9]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
			 * https://bugs.webkit.org/show_bug.cgi?id=42940
			 */
			safariPoll: Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2][0-9]|3[0-3])/.test(navigator.userAgent)),

			/**
			 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
			 */
			ieDoubleCheck: Boolean(History.emulated.hashChange && History.isInternetExplorer())
		};

		/**
		 * History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		History.isEmptyObject = function(obj) {
			for ( var name in obj ) {
				return false;
			}
			return true;
		};

		/**
		 * History.cloneObject(obj)
		 * Clones a object
		 * @param {Object} obj
		 * @return {Object}
		 */
		History.cloneObject = function(obj) {
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

		/**
		 * History.getRootUrl()
		 * Turns "http://mysite.com/dir/page.html?asd" into "http://mysite.com"
		 * @return {String} rootUrl
		 */
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

		/**
		 * History.getBaseHref()
		 * Fetches the `href` attribute of the `<base href="...">` element if it exists
		 * @return {String} baseHref
		 */
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

		/**
		 * History.getBaseUrl()
		 * Fetches the baseHref or basePageUrl or rootUrl (whichever one exists first)
		 * @return {String} baseUrl
		 */
		History.getBaseUrl = function(){
			// Create
			var baseUrl = History.getBaseHref()||History.getBasePageUrl()||History.getRootUrl();

			// Return
			return baseUrl;
		};

		/**
		 * History.getPageUrl()
		 * Fetches the URL of the current page
		 * @return {String} pageUrl
		 */
		History.getPageUrl = function(){
			// Create
			var pageUrl = document.location.href.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
				return /\./.test(part) ? part : part+'/';
			});

			// Return
			return pageUrl;
		};

		/**
		 * History.getBasePageUrl()
		 * Fetches the Url of the directory of the current page
		 * @return {String} basePageUrl
		 */
		History.getBasePageUrl = function(){
			// Create
			var basePageUrl = document.location.href.replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return /\./.test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePageUrl;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @return {string} fullUrl
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
				fullUrl = History.getRootUrl()+url.replace(/^\/+/,'');
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
		// State Storage

		/**
		 * History.idsToStates
		 * State IDs to States
		 */
		History.idsToStates = {};

		/**
		 * History.stateToIds
		 * State Strings to State IDs
		 */
		History.stateToIds = {};

		/**
		 * History.urlsToIds
		 * State URLs to State IDs
		 */
		History.urlsToIds = {};

		/**
		 * History.hashesToIds
		 * State Hashes to State IDs
		 */
		History.hashesToIds = {};

		/**
		 * History.conflictedUrls
		 * Which urls have duplicate states (indexed by url)
		 */
		History.conflictedUrls = {};

		/**
		 * History.storedStates
		 * Store the states in an array
		 */
		History.storedStates = [];

		/**
		 * History.savedStates
		 * Saved the states in an array
		 */
		History.savedStates = [];

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getState = function(friendly){
			// Prepare
			if ( typeof friendly === 'undefined' ) { friendly = true; }

			// Fetch
			var State = History.getLastSavedState()||History.createStateObject();

			// Adjust
			if ( friendly ) {
				State = History.cloneObject(State);
				delete State.data._state;
			}

			// Return
			return State;
		};

		/**
		 * History.normalizeState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.normalizeState = function(oldState){
			// Prepare
			if ( !oldState || (typeof oldState !== 'object') ) {
				oldState = {};
			}

			// Check
			if ( typeof oldState.normalized !== 'undefined' ) {
				return oldState;
			}

			// Adjust
			if ( !oldState.data || (typeof oldState.data !== 'object') ) {
				oldState.data = {};
			}
			if ( !oldState.data._state || (typeof oldState.data._state !== 'object') ) {
				oldState.data._state = {};
			}

			// Create
			var newState = {};
			newState.normalized = true;
			newState.title = oldState.title||oldState.data._state.title||'';
			newState.url = History.getFullUrl(oldState.url||oldState.data._state.url||document.location.href);
			newState.hash = History.getShortUrl(newState.url);

			// Data
			newState.data = History.cloneObject(oldState.data);
			newState.data._state = {};
			newState.data._state.title	= newState.title;
			newState.data._state.url		= newState.url;

			// Fetch ID
			var id = History.getIdByHash(newState.url);

			// Handle ID
			if ( id ) {
				// An ID existed in the url
				newState.id = id;
			}
			else {
				// Find ID via State String
				var str = History.getStateString(newState);
				if ( typeof History.stateToIds[str] !== 'undefined' ) {
					id = History.stateToIds[str];
				}
				else {
					// Generate a new ID
					while ( true ) {
						id = String(Math.floor(Math.random()*1000));
						if ( typeof History.idsToStates[id] === 'undefined' ) {
							break;
						}
					}

					// Apply the new State to the ID
					History.stateToIds[str] = id;
					History.idsToStates[id] = newState;
				}

				// Add ID
				newState.id = id;
			}

			// Add ID if Necessary
			var addId = History.bugs.safariPoll;
			if ( !addId ) {
				// Check to see if we have more than just a url
				var dataClone = History.cloneObject(newState.data);
				delete dataClone._state;

				// Check
				var dataNotEmpty = !History.isEmptyObject(dataClone);
				console.log(newState.title,dataNotEmpty,dataClone);

				// Apply
				if ( newState.title || dataNotEmpty ) {
					addId = true;
				}
			}

			// Extras
			if ( addId && !/(.*)\&_state=([0-9]+)$/.test(newState.url) ) {
				// Extract Hash
				newState.hash = History.getShortUrl(State.url);
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				newState.hash += '&_state='+State.id;

				// Safari Bug Fix
				if ( History.hasUrlDuplicate(newState) ) {
					newState.data._state.url = newState.url = History.getFullUrl(newState.hash);
				}
			}

			// Return
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
			State = History.normalizeState(State);

			// Return object
			return State;
		};

		/**
		 * History.getStateById(id)
		 * Get a state by it's UID
		 * @param {String} id
		 */
		History.getStateById = function(id){
			id = String(id);
			var State = History.idsToStates[id]||undefined;
			return State;
		};

		/**
		 * Get a State's String
		 * @param {State} passedState
		 */
		History.getStateString = function(passedState){
			// Prepare
			State = History.normalizeState(passedState);

			// Clean
			var cleanedState = {
				data: State.data
			};

			// Fetch
			var str = JSON.stringify(cleanedState);

			// Return
			return str;
		};

		/**
		 * Get a State's ID
		 * @param {State} passedState
		 * @return {String} id
		 */
		History.getStateId = function(passedState){
			// Prepare
			State = History.normalizeState(passedState);

			// Fetch
			var id = State.id;

			// Return
			return id;
		};

		/**
		 * History.getHashByState(State)
		 * Creates a Hash for the State Object
		 * @param {State} passedState
		 * @return {String} hash
		 */
		History.getHashByState = function(passedState){
			// Prepare
			var
				hash,
				State = History.normalizeState(passedState);

			// Fetch
			hash = State.hash;

			// Return
			return hash;
		};

		/**
		 * History.getIdByHash(hash)
		 * Gets a State ID from a State Hash
		 * @param {string} hash
		 * @return {string} id
		 */
		History.getIdByHash = function(hash){
			// Prepare
			var id;

			// Lookup
			id = History.hashesToIds[hash]||'';

			// Extract
			if ( !id ) {
				var parts,url;
				parts = /(.*)\&_state=([0-9]+)$/.exec(hash);
				url = parts ? (parts[1]||hash) : hash;
				id = parts ? String(parts[2]||'') : '';
			}

			// Return
			return id;
		}

		/**
		 * History.getStateByHash(hash)
		 * Expands a Hash into a State if possible
		 * @param {string} hash
		 * @return {Object|null} State
		 */
		History.getStateByHash = function(hash){
			// Prepare
			var State = null;

			// Check
			if ( hash === '' ) {
				State = History.createStateObject();
			}
			else {
				// Extract ID from Hash
				var id = History.getIdByHash(hash);

				// Have ID
				if ( id ) {
					State = History.getStateById(id)||null;
				}

				// State Failed
				if ( !State && /\//.test(hash) ) {
					// Is a URL
					var expandedUrl = History.getFullUrl(hash);
					State = History.createStateObject(null,null,expandedUrl);
				}
				else {
					// Non State Hash
				}
			}

			// Normalise
			State = State;

			// Return State
			return State;
		};

		/**
		 * History.getLastSavedState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastSavedState = function(){
			return History.savedStates[History.savedStates.length-1]||undefined;
		};

		/**
		 * History.getLastStoredState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastStoredState = function(){
			return History.storedStates[History.storedStates.length-1]||undefined;
		};

		/**
		 * History.getStateByUrl
		 * Get a state by it's url
		 * @param {string} stateUrl
		 */
		History.getStateByUrl = function(stateUrl){
			// Prepare
			stateUrl = History.getFullUrl(stateUrl);

			// Fetch
			var
				id = History.urlsToIds[stateUrl]||undefined,
				State = History.getStateById(id);

			// Return
			return State;
		};

		/**
		 * History.storeState
		 * Store a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.storeState = function(newState){
			// Prepare
			var
				newStateHash = History.getHashByState(newState),
				hasDuplicate = History.hasUrlDuplicate(newState);

			// Store duplicate status
			if ( hasDuplicate ) {
				History.conflictedUrls[newState.url] = true;
			}

			// Store the State
			History.hashesToIds[newState.hash] = History.urlsToIds[newState.url] = newState.id;

			// Push the State
			History.storedStates.push(History.cloneObject(newState));

			// Return newState
			return newState;
		};

		/**
		 * History.isLastStoredState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		History.isLastStoredState = function(newState){
			// Prepare
			var
				newStateHash = History.getHashByState(newState),
				oldStateHash = History.getHashByState(History.getLastStoredState());

			// Check
			var isLast = History.storedStates.length && newStateHash === oldStateHash;

			// Return isLast
			return isLast;
		};

		/**
		 * History.isLastSavedState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @return {boolean} isLast
		 */
		History.isLastSavedState = function(newState){
			// Prepare
			var
				newStateHash = History.getHashByState(newState),
				oldStateHash = History.getHashByState(History.getLastSavedState());

			// Check
			var isLast = History.savedStates.length && newStateHash === oldStateHash;

			// Return isLast
			return isLast;
		};

		/**
		 * History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {boolean} changed
		 */
		History.saveState = function(newState){
			// Check Hash
			if ( History.isLastSavedState(newState) ) {
				return false;
			}

			// Push the State
			History.savedStates.push(History.cloneObject(newState));

			// Return true
			return true;
		};

		/**
		 * History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		History.getStateByIndex = function(index){
			// Prepare
			var State = null;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				State = History.savedStates[History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				State = History.savedStates[History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				State = History.savedStates[index];
			}

			// Return State
			return State;
		};

		/**
		 * History.stateUrlExists
		 * Checks if the State Url Exists
		 * @param {string} stateUrl
		 * @return {boolean} exists
		 */
		History.stateUrlExists = function(stateUrl){
			// Prepare
			var exists = typeof History.urlsToIds[stateUrl] !== 'undefined';

			// Return exists
			return exists;
		};

		/**
		 * History.hasUrlDuplicate
		 * Checks if a Url will have a url conflict
		 * @param {Object} newState
		 * @return {Boolean} hasConflict
		 */
		History.hasUrlDuplicate = function(newState) {
			// Prepare
			var
				newStateHash = History.getHashByState(newState),
				oldState = History.getStateByUrl(newState.url),
				hasConflict = false;

			// Check for Conflict
			if ( typeof oldState !== 'undefined' ) {
				// Compare Hashes
				var oldStateHash = History.getHashByState(oldState);
				if ( oldStateHash !== newStateHash ) {
					// We have a conflict
					hasConflict = true;
				}
			}

			// Return
			return hasConflict;
		};

		/**
		 * History.hasUrlConflict
		 * Check if the url has multiple states associated to it
		 * @param {string} stateUrl
		 * @return {boolean} exists
		 */
		History.hasUrlConflict = function(stateUrl){
			stateUrl = History.getFullUrl(stateUrl);
			var exists = typeof History.conflictedUrls[stateUrl] !== 'undefined';
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
			var hash = History.unescapeHash(document.location.hash);
			return hash;
		};

		/**
		 * History.unescapeHash()
		 * normalize and Unescape a Hash
		 * @return {string}
		 */
		History.unescapeHash = function(hash){
			var result = History.normalizeHash(hash);

			// Unescape hash
			if ( /[\%]/.test(result) ) {
				result = unescape(result);
			}

			// Return result
			return result;
		};

		/**
		 * History.normalizeHash()
		 * normalize a hash across browsers
		 * @return {string}
		 */
		History.normalizeHash = function(hash){
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
			var adjustedHash = History.escapeHash(hash);

			// Log hash
			History.debug('History.setHash',this,arguments,'hash:',hash,'adjustedHash:',adjustedHash,'oldHash:',document.location.hash);

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			var State = History.getStateByHash(hash);
			if ( State && !History.emulated.pushState ) {
				// Hash is a state so skip the setHash
				History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',this,arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( document.location.hash !== adjustedHash ) {
				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( History.bugs.setHash ) {
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
		 * History.escape()
		 * normalize and Escape a Hash
		 * @return {string}
		 */
		History.escapeHash = function(hash){
			var result = History.normalizeHash(hash);

			// Escape hash
			if ( /[^a-zA-Z0-9\/\-\_\%\.]/.test(result) ) {
				result = escape(result);
			}

			// Return result
			return result;
		};

		/**
		 * History.getHashByUrl(url)
		 * Extracts the Hash from a URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getHashByUrl = function(url){
			// Extract the hash
			var hash = String(url)
				.replace(/([^#]*)#?([^#]*)#?(.*)/, '$2')
				;

			// Unescape hash
			hash = History.unescapeHash(hash);

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
				hash = History.getHashByUrl(url),
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

			// Chain
			return History;
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

			// Chain
			return History;
		};

		/**
		 * History.clearQueue()
		 * Clears the Queue
		 */
		History.clearQueue = function(){
			History.busy.flag = false;
			History.queues = [];
			return History;
		};


		// ----------------------------------------------------------------------
		// IE Bug Fix

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
			// Reset
			History.stateChanged = false;
			History.doubleCheckReset();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( History.bugs.ieDoubleCheck ) {
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
					History.options.hashChangeInterval*5
				);
			}

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// Safari Bug Fix

		History.nextState = false;

		/**
		 * Poll the current state
		 **/
		History.safariStatePoll = function(){
			// Poll the URL

			// Get the Last State which has the new URL
			var
				urlState = History.getStateByUrl(document.location.href),
				newState;

			// Check for a difference
			if ( !History.isLastSavedState(urlState) ) {
				newState = urlState;
			}
			else {
				return;
			}

			// Check if we have a state with that url
			// If not create it
			if ( !newState ) {
				History.log('History.safariStatePoll: new');
				newState = History.createStateObject();
			}

			// Apply the New State
			History.log('History.safariStatePoll: trigger');
			History.Adapter.trigger(window,'popstate');

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// State Aliases

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

			// Chain
			return History;
		};


		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( !History.emulated.pushState ) {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * History.onPopState(event,extra)
			 * Refresh the Current State
			 */
			History.onPopState = function(event){
				History.debug('History.onPopState',this,arguments);

				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle apporiatly
				var currentHash	= unescape(History.getHash());
				if ( currentHash ) {
					// Expand Hash
					var currentState = History.getStateByHash(currentHash);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						History.debug('History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.title, currentState.url, false);
					}
					else {
						// Traditional Anchor
						History.debug('History.onPopState: traditional anchor', currentHash);
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
				if ( typeof event.state !== 'undefined' ) {
					// Vanilla: Back/forward button was used

					// Browser Fix
					if ( false ) {
						// Use the way that should work
						stateData = event.state;
					}
					else {
						// Using Chrome Fix
						var
							newStateUrl = document.location.href,
							oldState = History.getStateByUrl(newStateUrl),
							urlConflict = History.hasUrlConflict(newStateUrl);

						// Does oldState Exist?
						if ( typeof oldState !== 'undefined' && !urlConflict ) {
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
						oldState = History.getStateByUrl(newStateUrl);

					// Check if the URLs match
					if ( oldState && (newStateUrl === oldState.url) ) {
						stateData = oldState.data;
					}
					else {
						stateData = null;
					}
				}

				// Resolve newState
				stateData					= (typeof stateData !== 'object' || stateData === null) ? {} : stateData;
				stateData._state	= (typeof stateData._state !== 'object' || stateData._state === null) ? {} : stateData._state;
				stateTitle				=	stateData._state.title||'',
				stateUrl					=	stateData._state.url||document.location.href,
				newState					=	History.createStateObject(stateData,stateTitle,stateUrl);

				// Check if we are the same state
				if ( History.isLastSavedState(newState) ) {
					// There has been no change (just the page's hash has finally propagated)
					History.debug('History.onPopState: no change', newState, History.savedStates);
					History.busy(false);
					return false;
				}

				// Log
				History.debug(
					'History.onPopState',
					'newState:', newState,
					'oldState:', History.getStateByUrl(document.location.href),
					'urlConflict:', History.hasUrlConflict(document.location.href)
				);

				// Store the State
				History.storeState(newState);
				History.saveState(newState);

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
			History.Adapter.bind(window,'popstate',History.onPopState);

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
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
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
				History.storeState(newState);

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
				if ( History.getHashByUrl(url) && History.emulated.pushState ) {
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
				History.storeState(newState);

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
			History.saveState(History.storeState(History.createStateObject({},document.title,document.location.href)));

			/**
			 * Setup Safari Fix
			 */
			if ( History.bugs.safariPoll ) {
				setInterval(History.safariStatePoll, History.options.safariPollInterval);
			}

			/**
			 * Ensure Cross Browser Compatibility
			 */
			if ( navigator.vendor === 'Apple Computer, Inc.' ) {
				/**
				 * Fix Safari HashChange Issue
				 */
				History.Adapter.bind(window,'hashchange',function(){
					History.Adapter.trigger(window,'popstate');
					//History.onPopState();
				});
			}

		} // !History.emulated.pushState

	}; // History.initCore

	// Try and Initialise History
	History.init();

})(window);
