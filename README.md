Welcome to History.js
==================

This project is the successor of jQuery History, it aims to:

- Support HTML5's State Management
- Provide a backwards compatible experience for Browsers which do not support HTML5's State Management *- including continued support replaceState, and data storage*
- Provide a backwards compatible experience for Browsers which do not support HTML4's OnHashChange *- including continued support for traditional anchors*
- Follow the original API's as much as possible
- Support as many javascript frameworks as possible via adapters.

Licensed under the New BSD License, Copyright 2011 Benjamin Arthur Lupton <contact@balupton.com>

## Usage

	(function(window,undefined){

		var History = window.History; // note: we are using a capital H instead of a lower h

		History.Adapter.bind(window,'statechange',functon(){ // note: We are using statechange instead of popstate
			var State = History.getState(); // note: we are using History.getState() instead of event.state
			console.log(State.data, State.title, State.url);
		});

		History.pushState({state:1}, "State 1", "?state=1");
		History.pushState({state:2}, "State 2", "?state=2");
		History.replaceState({state:3}, "State 3", "?state=3");
		History.back(); // logs {state:1}, "State 1", "?state=1"
		History.back(); // logs {}, "Home Page", "?"
		History.go(2);  // logs {state:3}, "State 3", "?state=3"

		History.pushStateAndTrigger({state:1}, "State 1", "?state=1");  		// logs {state:1}, "State 1", "?state=1"
		History.pushStateAndTrigger({state:2}, "State 2", "?state=2");  		// logs {state:2}, "State 2", "?state=2"
		History.replaceStateAndTrigger({state:3}, "State 3", "?state=3");		// logs {state:3}, "State 3", "?state=3"

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


## Explanation

We create the new namespace `window.History` instead of extending the exiting namespace `window.history` (capitalisation), as each framework handles the events a little bit so we cannot guarantee full compatibility with the original spec. This is shown in the above code by using `History.getState().data` instead of `event.state`, which is actually more powerful as we have access to that state's title and url as well. As such, extending the inbuilt `window.history` would cause discrepancies.

## Extra Support

- State data will always contain `data.title` and `data.url`
- State titles will always be applied to the document.title

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

- ReplaceState functionality is emulated in HTML4 browsers by discarding the replaced state, so when the discarded state is accessed it is skipped using the appropriate `History.back` / `History.forward` call (determined by the direction the user is traversing their history).
	- As such, History.js does not support `History.go` (instead only `History.back` and `History.forward`) as otherwise we cannot accurately detect the direction the user is traversing their history.
- History.js fixes a bug in Google Chrome where traversing back through the history to the home page does not return the correct state data.
- Setting a hash (even in HTML5 browsers) causes `onpopstate` to fire - this is expected/standard functionality.
	- As such, to ensure correct compatability between HTML5 and HTML4 browsers, we now have two new events:
		- onstatechange: this is the same as onpopstate except does not fire for traditional anchors
		- onanchorchange: this is the same as onhashchange but only fires for traditional anchors and not HTML5 states
	- To fetch the anchor/hash, you may use `History.getHash()`.

## Todo

- Degradation of the HTML5 States perhaps could be more graceful. Will need to:
	- Evaluate the behaviour of the `data` stored in states with HTML5. Discover if it persists once the page is closed then re-opened.
		- If it persists: use cookies
		- If it doesn't then we don't need to do url serialisation (current solutions).
	- Alternatively, we could support url serialisation for both HTML5 and HTML4 browsers to ensure the state of the page always persists in it's full entirety.
		- HTML5 could have `data` and `title` passed as querystring.
	- Will need to decide on best way forward, feedback welcome! contact@balupton.com
