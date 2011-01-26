Welcome to History.js (v1.2.0 - 25th January 2011)
==================

This project is the successor of jQuery History, it aims to:

- Support HTML5's State Management
- Provide a backwards compatible experience for Browsers which do not support HTML5's State Management *- including continued support `replaceState`, and state data storage*
- Provide a backwards compatible experience for Browsers which do not support HTML4's OnHashChange *- including continued support for traditional anchors*
- Provide a forwards compatible experience for HTML4 States in HTML5 Browsers *- so urls that contain states in hashes (a HTML4 State) will still work in HTML5 browsers*
- Follow the original API's as much as possible *- support attaching data and title properties to states and both the `pushState` and `replaceState` methods in all browsers*
- Support as many javascript frameworks as possible via adapters *- especially jQuery, MooTools and Prototype*

Licensed under the [New BSD License](http://creativecommons.org/licenses/BSD/)
Copyright 2011 [Benjamin Arthur Lupton](http://balupton.com)


## Usage

	(function(window,undefined){

		var History = window.History; // Note: We are using a capital H instead of a lower h

		History.Adapter.bind(window,'statechange',functon(){ // Note: We are using statechange instead of popstate
			var State = History.getState(); // Note: We are using History.getState() instead of event.state
			History.log(State.data, State.title, State.url);
		});

		History.pushState({state:1}, "State 1", "?state=1");			// logs {state:1}, "State 1", "?state=1"
		History.pushState({state:2}, "State 2", "?state=2");			// logs {state:2}, "State 2", "?state=2"
		History.replaceState({state:3}, "State 3", "?state=3");		// logs {state:2}, "State 3", "?state=3"
		History.back();																						// logs {state:1}, "State 1", "?state=1"
		History.back();																						// logs {}, "Home Page", "?"
		History.go(2);																						// logs {state:3}, "State 3", "?state=3"

	})(window);


## Installation

1. Download History.js and upload it to your webserver. Download links: [tar.gz](https://github.com/balupton/History.js/tarball/master) or [zip](https://github.com/balupton/History.js/zipball/master)

2. Include [JSON2](http://www.json.org/js.html) for HTML4 Browsers Only *(replace www.yourwebsite.com)*

		<script type="text/javascript">
			if ( typeof JSON === 'undefined' ) {
				var
					url = 'http://www.yourwebsite.com/history.js/scripts/compressed/json2.min.js',
					scriptEl = document.createElement('script');
				scriptEl.type = 'text/javascript';
				scriptEl.src = url;
				document.body.appendChild(scriptEl);
			}
		</script>

3. Include the Adapter for your Framework:

	- jQuery

			<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.jquery.min.js"></script>

	- Mootools

			<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.mootools.min.js"></script>

	- Prototype

			<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.prototype.min.js"></script>

4. Include History.js

		<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.min.js"></script>


## Adapters

### Supported

- jQuery
- Prototype
- MooTools

> If your favourite framework is not included? Then just write an adapter for it, and send it to us :-) Easy peasy.


## Browsers

### Tested and Working In:

- Chrome 8
- Opera 10,11
- Safari 5
- Firefox 4 Beta 9
- Firefox 3
- IE 6,7,8


## Notes on Compatibility

- State data will always contain the State's title and url at: `data.title` and `data.url`
- State titles will always be applied to the document.title
- ReplaceState functionality is emulated in HTML4 browsers by discarding the replaced state, so when the discarded state is accessed it is skipped using the appropriate `History.back()` / `History.forward()` call.
	- As such, there is no `History.go(index)` method as we cannot ensure compatibility between HTML5 and HTML4 browsers due to discarded states.
- History.js fixes a bug in Google Chrome where traversing back through the history to the home page does not return the correct state data.
- Setting a hash (even in HTML5 browsers) causes `onpopstate` to fire - this is expected/standard functionality.
	- As such, to ensure correct compatability between HTML5 and HTML4 browsers, we now have two new events:
		- onstatechange: this is the same as onpopstate except does not fire for traditional anchors
		- onanchorchange: this is the same as onhashchange but only fires for traditional anchors and not states
	- To fetch the anchor/hash, you may use `History.getHash()`.


## Changelog

- v1.3.0 - Upcoming (Expected 1st Week February 2011)
	- Support for cleaner HTML4 States

- v1.2.0 - 25th of January 2011
	- Support for HTML4 States in HTML5 Browsers (added test)
	- Updates of Documentation

- v1.1.0 - 24th January 2011
	- Developed a series of automated test cases
	- Fixed issue with traditional anchors
	- Fixed issue with differing replaceState functionality in HTML4 Browsers
	- Fixed issue with Google Chrome artefacts being carried over to the initial state
	- Provided `onstatechange` and `onanchorchange` events

- v1.0.0 - 22nd January 2011
	- Supported `History.pushState` and `History.replaceState` degradation
	- Supported jQuery, MooTools and Prototype Frameworks


## Todo for Upcoming Releases

- Degradation of the HTML5 States could perhaps be cleaner (have the anchor as only a URL with a UID, instead of the serialised state). Will need to:
	- Evaluate if the `State.data` is kept in HTML5 browsers if the page is:
		- Closed and re-opened.
		- Navigated to a 3rd party website, then returned.
	- Under both circumstances of:
		- The initial opening
		- Traversing the history
	- This then leads to:
		- If the data persists, then we can either:
			- Use the existing URL Serialisation
			- Use `document.cookie` to store the states indexed by UIDs, and give the hash a UID.
		- If the data doesn't persist, then we can either:
			- Use the existing URL Serialisation
			- Use a local data structure to store the states indexed by UIDs, and give the hash a UID.
