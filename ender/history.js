/**
 * History.js Core
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

(function(window,undefined){
	"use strict";

	// --------------------------------------------------------------------------
	// Initialise

	// Localise Globals
	var
		console = window.console||undefined, // Prevent a JSLint complain
		document = window.document, // Make sure we are using the correct document
		navigator = window.navigator, // Make sure we are using the correct navigator
		amplify = window.amplify||false, // Amplify.js
		setTimeout = window.setTimeout,
		clearTimeout = window.clearTimeout,
		setInterval = window.setInterval,
		clearInterval = window.clearInterval,
		JSON = window.JSON,
		alert = window.alert,
		History = window.History = window.History||{}, // Public History Object
		history = window.history; // Old History Object

	// MooTools Compatibility
	JSON.stringify = JSON.stringify||JSON.encode;
	JSON.parse = JSON.parse||JSON.decode;

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

		// Prepare
		var initState, emptyFunction;

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
		History.options.hashChangeInterval = History.options.hashChangeInterval || 100;

		/**
		 * History.options.safariPollInterval
		 * How long should the interval be before safari poll checks
		 */
		History.options.safariPollInterval = History.options.safariPollInterval || 500;

		/**
		 * History.options.doubleCheckInterval
		 * How long should the interval be before we perform a double check
		 */
		History.options.doubleCheckInterval = History.options.doubleCheckInterval || 500;

		/**
		 * History.options.storeInterval
		 * How long should we wait between store calls
		 */
		History.options.storeInterval = History.options.storeInterval || 1000;

		/**
		 * History.options.busyDelay
		 * How long should we wait between busy events
		 */
		History.options.busyDelay = History.options.busyDelay || 250;

		/**
		 * History.options.debug
		 * If true will enable debug messages to be logged
		 */
		History.options.debug = History.options.debug || false;

		/**
		 * History.options.initialTitle
		 * What is the title of the initial state
		 */
		History.options.initialTitle = History.options.initialTitle || document.title;


		// ----------------------------------------------------------------------
		// Temporary

		/**
		 * History.temp
		 * Things that only exist temporarily
		 */
		History.temp = {
			internal: false,
			expectedStateId: false,
			ignore: 0,
			same: false,
			anchor: false
		};

		// ----------------------------------------------------------------------
		// Interval record

		/**
		 * History.intervalList
		 * List of intervals set, to be cleared when document is unloaded.
		 */
		History.intervalList = [];

		/**
		 * History.clearAllIntervals
		 * Clears all setInterval instances.
		 */
		History.clearAllIntervals = function(){
			var i, il = History.intervalList;
			if (typeof il !== "undefined" && il !== null) {
				for (i = 0; i < il.length; i++) {
					clearInterval(il[i]);
				}
				History.intervalList = null;
			}
		};
		History.Adapter.bind(window,"beforeunload",History.clearAllIntervals);
		History.Adapter.bind(window,"unload",History.clearAllIntervals);


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
		 * @return {void}
		 */
		History.log = function(){
			// Prepare
			var
				consoleExists = !(typeof console === 'undefined' || typeof console.log === 'undefined' || typeof console.log.apply === 'undefined'),
				textarea = document.getElementById('log'),
				message,
				i,n,
				args,arg
				;

			// Write to Console
			if ( consoleExists ) {
				args = Array.prototype.slice.call(arguments);
				message = args.shift();
				if ( typeof console.debug !== 'undefined' ) {
					console.debug.apply(console,[message,args]);
				}
				else {
					console.log.apply(console,[message,args]);
				}
			}
			else {
				message = ("\n"+arguments[0]+"\n");
			}

			// Write to log
			for ( i=1,n=arguments.length; i<n; ++i ) {
				arg = arguments[i];
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
						var v = 3,
								div = document.createElement('div'),
								all = div.getElementsByTagName('i');
						while ( (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->') && all[0] ) {}
						return (v > 4) ? v : false;
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
			var result =
				History.isInternetExplorer.cached =
				(typeof History.isInternetExplorer.cached !== 'undefined')
					?	History.isInternetExplorer.cached
					:	Boolean(History.getInternetExplorerMajorVersion())
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
				&& !(
					(/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i).test(navigator.userAgent) /* disable for versions of iOS before version 4.3 (8F190) */
					|| (/AppleWebKit\/5([0-2]|3[0-2])/i).test(navigator.userAgent) /* disable for the mercury iOS browser, or at least older versions of the webkit engine */
				)
			),
			hashChange: Boolean(
				!(('onhashchange' in window) || ('onhashchange' in document))
				||
				(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8)
			)
		};


		/**
		 * History.bugs
		 * Which bugs are present
		 */
		History.bugs = {};

		/**
		 * Safari 5 and Safari iOS 4 fail to have the correct history trail when inside an iframe
		 * https://github.com/balupton/history.js/issues/#issue/40
		 */
		History.bugs.safariIFrame = Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent) && window.parent !== window);

		/**
		 * Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call
		 * https://bugs.webkit.org/show_bug.cgi?id=56249
		 */
		History.bugs.safariHash = Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent));

		/**
		 * Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions
		 * https://bugs.webkit.org/show_bug.cgi?id=42940
		 */
		History.bugs.safariPoll = Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent));

		/**
		 * Safari 5 and Safari iOS 4 do not trigger onpopstate on onhashchange events
		 */
		History.bugs.noHashPopState = Boolean(!History.emulated.pushState && navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent));

		/**
		 * Safari 5 and Safari iOS 4 and Firefox 4 do not trigger an initial onpopstate
		 */
		History.bugs.noInitialPopState = Boolean(
			!History.emulated.pushState &&
			(
				(navigator.vendor === 'Apple Computer, Inc.' && /AppleWebKit\/5([0-2]|3[0-3])/.test(navigator.userAgent)) ||
				(/Gecko\//).test(navigator.userAgent)
			)
		);

		/**
		 * MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
		 */
		History.bugs.ieDoubleCheck = Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 8);

		/**
		 * MSIE 6 requires the entire hash to be encoded for the hashes to trigger the onHashChange event
		 */
		History.bugs.hashEscape = Boolean(History.isInternetExplorer() && History.getInternetExplorerMajorVersion() < 7);


		/**
		 * History.enabled
		 * Is History enabled?
		 */
		History.enabled = !History.emulated.pushState;

		/**
		 * History.isEmptyObject(obj)
		 * Checks to see if the Object is Empty
		 * @param {Object} obj
		 * @return {boolean}
		 */
		History.isEmptyObject = function(obj) {
			for ( var name in obj ) {
				if ( obj.hasOwnProperty(name) ) {
					return false;
				}
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
		 * @return {string} rootUrl
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
		 * @return {string} baseHref
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
		 * @return {string} baseUrl
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
		 * @return {string} pageUrl
		 */
		History.getPageUrl = function(){
			// Fetch
			var
				State = History.getState(false,false),
				stateUrl = (State||{}).url||document.location.href,
				pageUrl;

			// Create
			pageUrl = stateUrl.replace(/\/+$/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/\./).test(part) ? part : part+'/';
			});

			// Return
			return pageUrl;
		};

		/**
		 * History.getBasePageUrl()
		 * Fetches the Url of the directory of the current page
		 * @return {string} basePageUrl
		 */
		History.getBasePageUrl = function(){
			// Create
			var basePageUrl = document.location.href.replace(/[#\?].*/,'').replace(/[^\/]+$/,function(part,index,string){
				return (/[^\/]$/).test(part) ? '' : part;
			}).replace(/\/+$/,'')+'/';

			// Return
			return basePageUrl;
		};

		/**
		 * History.getFullUrl(url)
		 * Ensures that we have an absolute URL and not a relative URL
		 * @param {string} url
		 * @param {Boolean} allowBaseHref
		 * @return {string} fullUrl
		 */
		History.getFullUrl = function(url,allowBaseHref){
			// Prepare
			var fullUrl = url, firstChar = url.substring(0,1);
			allowBaseHref = (typeof allowBaseHref === 'undefined') ? true : allowBaseHref;

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
				if ( allowBaseHref ) {
					fullUrl = History.getBaseUrl()+url.replace(/^(\.\/)+/,'');
				} else {
					fullUrl = History.getBasePageUrl()+url.replace(/^(\.\/)+/,'');
				}
				// We have an if condition above as we do not want hashes
				// which are relative to the baseHref in our URLs
				// as if the baseHref changes, then all our bookmarks
				// would now point to different locations
				// whereas the basePageUrl will always stay the same
			}

			// Return
			return fullUrl.replace(/\#$/,'');
		};

		/**
		 * History.getShortUrl(url)
		 * Ensures that we have a relative URL and not a absolute URL
		 * @param {string} url
		 * @return {string} url
		 */
		History.getShortUrl = function(url){
			// Prepare
			var fullUrl = History.getFullUrl(url), shortUrl = fullUrl, baseUrl = History.getBaseUrl(), rootUrl = History.getRootUrl();

			// Trim baseUrl
			if ( History.emulated.pushState ) {
				// We are in a if statement as when pushState is not emulated
				// The actual url these short urls are relative to can change
				// So within the same session, we the url may end up somewhere different
				shortUrl = shortUrl.replace(baseUrl,'');
			}

			// Trim rootUrl
			shortUrl = shortUrl.replace(rootUrl,'/');

			// Ensure we can still detect it as a state
			if ( /^\.?\.?\//.test(shortUrl) === false ) {
				if ( rootUrl+shortUrl === fullUrl ) {
					shortUrl = '/'+shortUrl;
				}
				else {
					shortUrl = './'+shortUrl;
				}
			}

			// Clean It
			shortUrl = shortUrl.replace(/^(\.\/)+/g,'./').replace(/\#$/,'');

			// Return
			return shortUrl;
		};

		// ----------------------------------------------------------------------
		// State Storage

		/**
		 * History.store
		 * The store for all session specific data
		 */
		History.store = amplify ? (amplify.store('History.store')||{}) : {};
		History.store.idToState = History.store.idToState||{};
		History.store.urlToId = History.store.urlToId||{};
		History.store.stateToId = History.store.stateToId||{};

		/**
		 * History.idToState
		 * 1-1: State ID to State Object
		 */
		History.idToState = History.idToState||{};

		/**
		 * History.stateToId
		 * 1-1: State String to State ID
		 */
		History.stateToId = History.stateToId||{};

		/**
		 * History.urlToId
		 * 1-1: State URL to State ID
		 */
		History.urlToId = History.urlToId||{};

		/**
		 * History.storedStates
		 * Store the states in an array
		 */
		History.storedStates = History.storedStates||[];

		/**
		 * History.savedStates
		 * Saved the states in an array
		 */
		History.savedStates = History.savedStates||[];

		/**
		 * History.getState()
		 * Get an object containing the data, title and url of the current state
		 * @param {Boolean} friendly
		 * @param {Boolean} create
		 * @return {Object} State
		 */
		History.getState = function(friendly,create){
			// Prepare
			if ( typeof friendly === 'undefined' ) { friendly = true; }
			if ( typeof create === 'undefined' ) { create = true; }

			// Fetch
			var State = History.getLastSavedState();

			// Create
			if ( !State && create ) {
				State = History.createStateObject();
			}

			// Adjust
			if ( friendly ) {
				State = History.cloneObject(State);
				State.url = State.cleanUrl||State.url;
				State.internal = History.temp.internal;
				State.same = History.temp.same;
				State.anchor = State.anchor || History.temp.anchor;
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByState(State)
		 * Gets a ID for a State
		 * @param {State} newState
		 * @return {string} id
		 */
		History.getIdByState = function(newState){
			// Prepare
			var
				id = History.extractId(newState.url),
				str;

			// Fetch ID
			if ( !id ) {
				// Find ID via State String
				str = History.getStateString(newState);
				if ( typeof History.stateToId[str] !== 'undefined' ) {
					id = History.stateToId[str];
				}
				else if ( typeof History.store.stateToId[str] !== 'undefined' ) {
					id = History.store.stateToId[str];
				}
				else {
					// Generate a new ID
					while ( true ) {
						id = String(Math.floor(Math.random()*1000));
						if ( typeof History.idToState[id] === 'undefined' && typeof History.store.idToState[id] === 'undefined' ) {
							break;
						}
					}

					// Apply the new State to the ID
					History.stateToId[str] = id;
					History.idToState[id] = newState;
				}
			}

			// Return ID
			return id;
		};

		/**
		 * History.normalizeState(State)
		 * Expands a State Object
		 * @param {object} State
		 * @return {object}
		 */
		History.normalizeState = function(oldState){
			// Prepare
			var
				newState,
				dataNotEmpty;

			// Check
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

			// ----------------------------------------------------------------------

			// Create
			newState = {};
			newState.normalized = true;
			newState.title = oldState.title||'';
			newState.url = History.getFullUrl(History.unescapeString(oldState.url||document.location.href));
			newState.data = History.cloneObject(oldState.data);
			newState.anchor = History.extractAnchor(newState.url);
			newState.hash = History.getShortUrl(newState.url);

			// ID
			newState.id = History.getIdByState(newState);

			// ----------------------------------------------------------------------

			// Clean the URL
			newState.cleanUrl = newState.url.replace(/\??\&_anchor.*/,'').replace(/\??\&_suid.*/,'').replace(/#.*/,'');
			newState.url = newState.cleanUrl;

			// Check to see if we have more than just a url
			dataNotEmpty = !History.isEmptyObject(newState.data);

			// Add SUID to the Hash
			if ( newState.title || dataNotEmpty ) {
				// Add ID to Hash
				newState.hash = History.getShortUrl(newState.url);
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				newState.hash += '&_suid='+newState.id;
			}

			// Add Anchor to the Hash
			if ( newState.anchor ) {
				if ( !/\?/.test(newState.hash) ) {
					newState.hash += '?';
				}
				if ( History.emulated.pushState ) {
					// Safari 5 doesn't need this
					newState.hash += '&_anchor='+newState.anchor;
				}
				newState.url += '#'+newState.anchor;
			}

			// Create the Hashed URL
			newState.hashedUrl = History.getFullUrl(newState.hash);

			// ----------------------------------------------------------------------

			// Update the URL if we have a duplicate
			if ( (History.emulated.pushState || History.bugs.safariPoll) && History.hasUrlDuplicate(newState) ) {
				newState.url = newState.hashedUrl;
			}

			// ----------------------------------------------------------------------

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
		 * @param {string} id
		 */
		History.getStateById = function(id){
			// Prepare
			id = String(id);

			// Retrieve
			var State = History.idToState[id] || History.store.idToState[id] || undefined;

			// Return State
			return State;
		};

		/**
		 * Get a State's String
		 * @param {State} passedState
		 */
		History.getStateString = function(passedState){
			// Prepare
			var
				State = History.normalizeState(passedState),
				cleanedState, str;

			// Clean
			cleanedState = {
				data: State.data,
				title: passedState.title,
				url: passedState.url
			};

			// Fetch
			str = JSON.stringify(cleanedState);

			// Return
			return str;
		};

		/**
		 * Get a State's ID
		 * @param {State} passedState
		 * @return {string} id
		 */
		History.getStateId = function(passedState){
			// Prepare
			var State = History.normalizeState(passedState), id;

			// Fetch
			id = State.id;

			// Return
			return id;
		};

		/**
		 * History.getHashByState(State)
		 * Creates a Hash for the State Object
		 * @param {State} passedState
		 * @return {string} hash
		 */
		History.getHashByState = function(passedState){
			// Prepare
			var hash, State = History.normalizeState(passedState);

			// Fetch
			hash = State.hash;

			// Return
			return hash;
		};

		/**
		 * History.extractAnchor(url_or_hash)
		 * Get a State Anchor by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {string|false} anchor
		 */
		History.extractAnchor = function ( url_or_hash ) {
			// Prepare
			var anchor,parts,url;

			// Obvious
			anchor = url_or_hash.replace(/^[^#]+#?/,'');
			if ( !anchor ) {
				// Advanced
				parts = /(.*)\&_anchor=([a-zA-Z0-9_\-]+)$/.exec(url_or_hash);
				url = parts ? (parts[1]||url_or_hash) : url_or_hash;
				anchor = parts ? String(parts[2]||'') : '';
			}

			// Return
			return anchor||false;
		};

		/**
		 * History.extractId(url_or_hash)
		 * Get a State ID by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {string|false} id
		 */
		History.extractId = function ( url_or_hash ) {
			// Prepare
			var id,parts,url;

			// Extract
			parts = /(.*)\&_suid=([0-9]+)$/.exec(url_or_hash);
			url = parts ? (parts[1]||url_or_hash) : url_or_hash;
			id = parts ? String(parts[2]||'') : '';

			// Return
			return id||false;
		};

		/**
		 * History.isTraditionalAnchor
		 * Checks to see if the url is a traditional anchor or not
		 * @param {string} url_or_hash
		 * @return {Boolean}
		 */
		History.isTraditionalAnchor = function(url_or_hash){
			// Check
			var isTraditional = !(/[^a-zA-Z0-9_\-]/.test(url_or_hash));

			// Return
			return isTraditional;
		};

		/**
		 * History.extractState
		 * Get a State by it's URL or Hash
		 * @param {string} url_or_hash
		 * @return {State|null}
		 */
		History.extractState = function(url_or_hash,create,allowTraditional){
			// Prepare
			var State = null, id, url, anchor;
			create = create||false;
			allowTraditional = typeof allowTraditional === 'undefined' ? true : allowTraditional;

			// Strip Anchor
			url_or_hash = url_or_hash;

			// Fetch SUID
			id = History.extractId(url_or_hash);
			if ( id ) {
				State = History.getStateById(id);
			}

			// Fetch SUID returned no State
			if ( !State ) {
				// Fetch URL
				url = History.getFullUrl(url_or_hash);

				// Check URL
				id = History.getIdByUrl(url)||false;
				if ( id ) {
					State = History.getStateById(id);
				}

				// Create State
				if ( !State && create ) {
					if ( !allowTraditional && History.isTraditionalAnchor(url_or_hash) ) {
						// do nothing
					}
					else {
						State = History.createStateObject(null,null,url);
					}
				}
			}

			// Return
			return State;
		};

		/**
		 * History.getIdByUrl()
		 * Get a State ID by a State URL
		 */
		History.getIdByUrl = function(url){
			// Fetch
			var id = History.urlToId[url] || History.store.urlToId[url] || undefined;

			// Return
			return id;
		};

		/**
		 * History.getLastSavedState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastSavedState = function(){
			return History.getStateById(History.savedStates[History.savedStates.length-1]);
		};

		/**
		 * History.getLastStoredState()
		 * Get an object containing the data, title and url of the current state
		 * @return {Object} State
		 */
		History.getLastStoredState = function(){
			return History.getStateById(History.storedStates[History.storedStates.length-1]);
		};

		/**
		 * History.hasUrlDuplicate
		 * Checks if a Url will have a url conflict
		 * @param {Object} newState
		 * @return {Boolean} hasDuplicate
		 */
		History.hasUrlDuplicate = function(newState) {
			// Prepare
			var hasDuplicate = false, oldState;

			// Fetch
			oldState = History.extractState(newState.url);

			// Check
			hasDuplicate = oldState && oldState.id !== newState.id;

			// Return
			return hasDuplicate;
		};

		/**
		 * History.storeState
		 * Store a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.storeState = function(newState){
			// Check Hash
			if ( History.isLastStoredState(newState) ) {
				return newState;
			}

			// Store the State
			History.urlToId[newState.url] = newState.id;

			// Push the State
			History.storedStates.push(newState.id);

			// Return
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
				isLast = false,
				oldState,
				newId, oldId;

			// Check
			if ( History.storedStates.length ) {
				oldState = History.getLastStoredState();

				// Compare ids
				newId = newState.id;
				oldId = oldState.id;

				// Check
				isLast = (newId === oldId);
			}

			// Return
			return isLast;
		};

		/**
		 * History.isLastSavedState(newState)
		 * Tests to see if the state is the last state
		 * @param {Object} newState
		 * @param {boolean=} friendly (optional)
		 * @return {boolean} isLast
		 */
		History.isLastSavedState = function(newState,friendly){
			// Prepare
			var
				isLast = false,
				oldState,
				newId, oldId,
				newFriendly, oldFriendly;

			// Check
			if ( History.savedStates.length ) {
				oldState = History.getLastSavedState();

				// How do we compare
				if ( friendly ) {
					// Compare data, title and url
					newFriendly = {
						data: newState.data,
						title: newState.title,
						url: newState.cleanUrl
					};
					oldFriendly = {
						data: oldState.data,
						title: oldState.title,
						url: oldState.cleanUrl
					};

					// Check
					isLast = (JSON.stringify(newFriendly) === JSON.stringify(oldFriendly));
				}
				else {
					// Compare ids
					newId = newState.id;
					oldId = oldState.id;

					// Check
					isLast = (newId === oldId);
				}
			}

			// Return
			return isLast;
		};

		/**
		 * History.saveState
		 * Push a State
		 * @param {Object} newState
		 * @return {Object} newState
		 */
		History.saveState = function(newState){
			// Check Hash
			if ( History.isLastSavedState(newState) ) {
				return newState;
			}

			// Push the State
			History.savedStates.push(newState.id);

			// Return
			return newState;
		};

		/**
		 * History.getStateByIndex()
		 * Gets a state by the index
		 * @param {integer} index
		 * @return {Object}
		 */
		History.getStateByIndex = function(index){
			// Prepare
			var State = null, stateId;

			// Handle
			if ( typeof index === 'undefined' ) {
				// Get the last inserted
				stateId = History.savedStates[History.savedStates.length-1];
			}
			else if ( index < 0 ) {
				// Get from the end
				stateId = History.savedStates[History.savedStates.length+index];
			}
			else {
				// Get from the beginning
				stateId = History.savedStates[index];
			}

			// Fetch
			State = History.getStateById(stateId);

			// Return State
			return State;
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
		 * History.unescapeString()
		 * Unescape a string
		 * @param {string} str
		 * @return {string}
		 */
		History.unescapeString = function(str){
			// Prepare
			var result = str, tmp;

			// Unescape hash
			while ( true ) {
				tmp = window.decodeURI(result);
				if ( tmp === result ) {
					break;
				}
				result = tmp;
			}

			// Return result
			return result;
		};

		/**
		 * History.unescapeHash()
		 * normalize and Unescape a Hash
		 * @param {string} hash
		 * @return {string}
		 */
		History.unescapeHash = function(hash){
			// Prepare
			var result = History.normalizeHash(hash);

			// Unescape hash
			result = History.unescapeString(result);

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

			// Log
			History.debug('History.setHash: called',hash);

			// Prepare
			var
				adjustedHash = History.escapeHash(hash),
				State, pageUrl,
				parentState;

			// Make Busy + Continue
			History.busy(true);

			// Check if hash is a state
			State = History.extractState(hash,true,false);
			if ( State && !History.emulated.pushState ) {
				// Hash is a state so skip the setHash
				History.debug('History.setHash: Hash is a state so skipping the hash set with a direct pushState call',arguments);

				// PushState
				History.pushState(State.data,State.title,State.url,false);
			}
			else if ( document.location.hash !== adjustedHash ) {
				// Hash is a proper hash, so apply it

				// Handle browser bugs
				if ( History.bugs.safariHash ) {
					// Fix Safari Bug https://bugs.webkit.org/show_bug.cgi?id=56249

					// Fetch the base page
					pageUrl = History.getPageUrl();

					// Fetch Parent State
					parentState = History.extractState(pageUrl.replace(/#.*/,''));

					// Apply the State
					if ( parentState ) {
						History.pushState(parentState.data,parentState.title,parentState.url+'#'+adjustedHash,false);
					}
					else {
						History.pushState(null,null,pageUrl+'#'+adjustedHash,false);
					}
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
			result = window.encodeURI(result);

			// IE6 Escape Bug
			if ( !History.bugs.hashEscape ) {
				// Restore common parts
				result = result
					.replace(/\%21/g,'!')
					.replace(/\%26/g,'&')
					.replace(/\%3D/g,'=')
					.replace(/\%3F/g,'?');
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
		 * History.setTitle(title)
		 * Applies the title to the document
		 * @param {String|State} (input)
		 * @return {Boolean}
		 */
		History.setTitle = function(input){
			// Prepare
			var
				title = (typeof input === 'string') ? (input) : (input.title),
				titleElements,
				firstState;

			// Initial
			if ( !title ) {
				firstState = History.getStateByIndex(0);
				if ( firstState && firstState.url === (input.url||document.location.href) ) {
					title = firstState.title||History.options.initialTitle;
				}
			}

			// Apply
			titleElements = document.getElementsByTagName('title');
			if ( titleElements.length === 1 ) {
				try {
					titleElements[0].innerHTML = title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
				}
				catch ( err ) {
					// ignore err
				}
			}
			document.title = title;

			// Chain
			return History;
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
			// Apply
			if ( typeof value !== 'undefined' ) {
				History.debug('History.busy: changing ['+(History.busy.flag||false)+'] to ['+(value||false)+']', History.queues.length);
				History.busy.flag = value;
			}
			// Default
			else if ( typeof History.busy.flag === 'undefined' ) {
				History.busy.flag = false;
			}

			// Prepare
			var
				fireNext, i, queue, item;

			// Queue
			if ( !History.busy.flag ) {
				// Execute the next item in the queue
				clearTimeout(History.busy.timeout);
				fireNext = function(){
					if ( History.busy.flag ) return;
					for ( i=History.queues.length-1; i >= 0; --i ) {
						queue = History.queues[i];
						if ( queue.length === 0 ) continue;
						item = queue.shift();
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

		/**
		 * History.stateChanged
		 * States whether or not the state has changed since the last double check was initialised
		 */
		History.stateChanged = false;

		/**
		 * History.doubleChecker
		 * Contains the timeout used for the double checks
		 */
		History.doubleChecker = false;

		/**
		 * History.doubleCheckComplete()
		 * Complete a double check
		 * @return {History}
		 */
		History.doubleCheckComplete = function(){
			// Update
			History.stateChanged = true;

			// Clear
			History.doubleCheckClear();

			// Chain
			return History;
		};

		/**
		 * History.doubleCheckClear()
		 * Clear a double check
		 * @return {History}
		 */
		History.doubleCheckClear = function(){
			// Clear
			if ( History.doubleChecker ) {
				clearTimeout(History.doubleChecker);
				History.doubleChecker = false;
			}

			// Chain
			return History;
		};

		/**
		 * History.doubleCheck()
		 * Create a double check
		 * @return {History}
		 */
		History.doubleCheck = function(tryAgain){
			// Reset
			History.stateChanged = false;
			History.doubleCheckClear();

			// Fix IE6,IE7 bug where calling history.back or history.forward does not actually change the hash (whereas doing it manually does)
			// Fix Safari 5 bug where sometimes the state does not change: https://bugs.webkit.org/show_bug.cgi?id=42940
			if ( History.bugs.ieDoubleCheck ) {
				// Apply Check
				History.doubleChecker = setTimeout(
					function(){
						History.doubleCheckClear();
						if ( !History.stateChanged ) {
							History.debug('History.doubleCheck: State has not yet changed, trying again', arguments);
							// Re-Attempt
							tryAgain();
						}
						return true;
					},
					History.options.doubleCheckInterval
				);
			}

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// Safari Bug Fix

		/**
		 * History.safariStatePoll()
		 * Poll the current state
		 * @return {History}
		 */
		History.safariStatePoll = function(){
			// Poll the URL

			// Get the Last State which has the new URL
			var
				urlState = History.extractState(document.location.href),
				newState;

			// Check for a difference
			if ( urlState && !History.isLastSavedState(urlState) ) {
				newState = urlState;
			}
			else {
				return;
			}

			// Check if we have a state with that url
			// If not create it
			if ( !newState ) {
				History.debug('History.safariStatePoll: new');
				newState = History.createStateObject();
			}

			// Apply the New State
			History.debug('History.safariStatePoll: trigger');
			History.Adapter.trigger(window,'popstate');

			// Chain
			return History;
		};

		// ----------------------------------------------------------------------
		// State Aliases

		/**
		 * History.back(queue)
		 * Send the browser history back one item
		 * @param {integer} queue [optional]
		 * @return {boolean}
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
		 * @param {integer} queue [optional]
		 * @return {boolean}
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
		 * History.go(index)
		 * Send the browser history back or forward index times
		 */
		History.go = function(index){
			History.debug('History.go: called', arguments);

			// Prepare
			var i, ignore;

			// Ignore
			ignore = (index < 0 ? index*-1 : index)-1;
			if ( ignore ) {
				History.queue(function(){
					History.temp.ignore = ignore;
					History.busy(false);
				});
			}

			// Handle
			if ( index > 0 ) {
				// Forward
				for ( i=1; i<=index; ++i ) {
					History.forward();
				}
			}
			else if ( index < 0 ) {
				// Backward
				for ( i=-1; i>=index; --i ) {
					History.back();
				}
			}
			else {
				throw new Error('History.go: History.go requires a positive or negative integer passed.');
			}

			// Chain
			return History;
		};


		// ----------------------------------------------------------------------
		// Initialise

		/**
		 * Create the initial State
		 */
		 History.saveState(History.storeState(History.extractState(document.location.href,true)));

		/**
		 * Bind for Saving Store
		 */
		if ( amplify ) {
			History.onUnload = function(){
				// Prepare
				var
					currentStore = amplify.store('History.store')||{},
					item;

				// Ensure
				currentStore.idToState = currentStore.idToState || {};
				currentStore.urlToId = currentStore.urlToId || {};
				currentStore.stateToId = currentStore.stateToId || {};

				// Sync
				for ( item in History.idToState ) {
					if ( History.idToState.hasOwnProperty(item) ) {
						currentStore.idToState[item] = History.idToState[item];
					}
				}
				for ( item in History.urlToId ) {
					if ( History.urlToId.hasOwnProperty(item) ) {
						currentStore.urlToId[item] = History.urlToId[item];
					}
				}
				for ( item in History.stateToId ) {
					if ( History.stateToId.hasOwnProperty(item) ) {
						currentStore.stateToId[item] = History.stateToId[item];
					}
				}

				// Update
				History.store = currentStore;

				// Store
				amplify.store('History.store',currentStore);
			};
			// For Internet Explorer
			History.intervalList.push(setInterval(History.onUnload,History.options.storeInterval));
			// For Other Browsers
			History.Adapter.bind(window,'beforeunload',History.onUnload);
			History.Adapter.bind(window,'unload',History.onUnload);
			// Both are enabled for consistency
		}


		// ----------------------------------------------------------------------
		// HTML5 State Support

		if ( History.emulated.pushState ) {
			/*
			 * Provide Skeleton for HTML4 Browsers
			 */

			// Prepare
			emptyFunction = function(){};
			History.pushState = History.pushState||emptyFunction;
			History.replaceState = History.replaceState||emptyFunction;
		}
		else {
			/*
			 * Use native HTML5 History API Implementation
			 */

			/**
			 * History.onPopState(event,extra)
			 * Refresh the Current State
			 * @return {boolean}
			 */
			History.onPopState = function(event,eventData){
				// Prepare
				var
					currentHash, currentState, parentState, newState = false, stateId = false, internal = false;

				// Reset the double check
				History.doubleCheckComplete();

				// Check for a Hash, and handle appropriately
				currentHash	= History.getHash();
				if ( currentHash ) {
					// Expand Hash
					currentState = History.extractState(currentHash||document.location.href,true,false);
					if ( currentState ) {
						// We were able to parse it, it must be a State!
						// Let's forward to replaceState
						History.debug('History.onPopState: state anchor', currentHash, currentState);
						History.replaceState(currentState.data, currentState.title, currentState.url, false);
						return false;
					}
					else {
						// Traditional Anchor
						History.debug('History.onPopState: traditional anchor', currentHash);
					}
				}

				// Extract
				stateId = History.Adapter.extractEventData('state',event,eventData)||false;

				// Fetch State
				if ( stateId ) {
					// Vanilla: Back/forward button was used
					newState = History.getStateById(stateId);
				}
				else if ( History.temp.expectedStateId ) {
					// Vanilla: A new state was pushed, and popstate was called manually
					newState = History.getStateById(History.temp.expectedStateId);
				}
				else {
					// Initial State
					newState = History.extractState(document.location.href);
				}

				// The State did not exist in our store
				if ( !newState ) {
					// Is there an anchor?
					// If so generate from the parent state if it exists
					if ( currentHash ) {
						parentState = History.extractState(document.location.href.replace(/#.*/,''));
						if ( parentState ) {
							newState = History.createStateObject(parentState.data,parentState.title,document.location.href);
						}
					}

					// Regenerate the State
					if ( !newState ) {
						newState = History.createStateObject(null,null,document.location.href);
					}
				}

				// Check for Ignore
				if ( History.temp.ignore ) {
					--History.temp.ignore;
					History.busy(false);
					return false;
				}

				// Prevent a back traversal where a hash has changed from triggering popstate and hashchange
				if ( History.temp.internal === 'hashchange' ) {
					// Check
					if ( History.isLastSavedState(newState) ) {
						History.busy(false);
						return false;
					}
					// Reset
					History.temp.internal = false;
				}

				// Clean
				if ( !History.temp.expectedStateId ) {
					History.temp.internal = false;
				}
				History.temp.expectedStateId = false;

				// Check for Same
				History.temp.same = History.isLastSavedState(newState,true);

				// Store the State
				History.storeState(newState);
				History.saveState(newState);

				// Force update of the title
				History.setTitle(newState);

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
			 * @return {boolean}
			 */
			History.pushState = function(data,title,url,queue){
				History.debug('History.pushState: called', arguments);

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
				var newState = History.createStateObject(data,title,url), pushUrl;

				// Update Internal
				if ( queue !== false ) { History.temp.internal = 'pushState'; }
				History.temp.same = History.isLastSavedState(newState,true);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Fire HTML5 Event
					// We fire statechange here as we do not need any extra processing
					History.Adapter.trigger(window,'statechange');
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);

					// Push the newState
					history.pushState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.temp.expectedStateId = newState.id;
					History.Adapter.trigger(window,'popstate');
				}

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
			 * @return {boolean}
			 */
			History.replaceState = function(data,title,url,queue){
				History.debug('History.replaceState: called', arguments);

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
				var newState = History.createStateObject(data,title,url), pushUrl;

				// Update Internal
				if ( queue !== false ) { History.temp.internal = 'replaceState'; }
				History.temp.same = History.isLastSavedState(newState,true);

				// Check it
				if ( History.isLastSavedState(newState) ) {
					// Fire HTML5 Event
					// We fire statechange here as we do not need any extra processing
					History.Adapter.trigger(window,'statechange');
					History.busy(false);
				}
				else {
					// Store the newState
					History.storeState(newState);

					// Push the newState
					history.replaceState(newState.id,newState.title,newState.url);

					// Fire HTML5 Event
					History.temp.expectedStateId = newState.id;
					History.Adapter.trigger(window,'popstate');
				}

				// End replaceState closure
				return true;
			};

			// Be aware, the following is only for native pushState implementations
			// If you are wanting to include something for all browsers
			// Then include it above this if block

			// Ignore initial popstate
			++History.temp.ignore;

			/**
			 * Setup Safari Poll Fix
			 */
			if ( History.bugs.safariPoll ) {
				History.intervalList.push(setInterval(History.safariStatePoll, History.options.safariPollInterval));
			}

			/**
			 * Perform Safari Iframe Fix
			 * Works by adding a extra history entry for the initial state at the start
			 */
			if ( History.bugs.safariIFrame ) {
				initState = History.getState();
				history.pushState(initState.data,initState.title,initState.url);
			}

			/**
			 * Ensure a hashchange trigger popstate
			 */
			if ( History.bugs.noHashPopState ) {
				// Alias
				History.Adapter.bind(window,'hashchange',function(){
					History.temp.internal = 'hashchange';
					History.Adapter.trigger(window,'popstate');
				});

				// Initialise Alias
				if ( History.getHash() && History.bugs.noInitialPopState ) {
					History.Adapter.onDomLoad(function(){
						History.Adapter.trigger(window,'popstate');
					});
				}
			}

			/**
			 * Ensure a initial popstate
			 */
			if ( History.bugs.noInitialPopState ) {
				History.Adapter.trigger(window,'popstate');
			}

		} // !History.emulated.pushState

	}; // History.initCore

	// Try and Initialise History
	History.init();

})(window);

