Welcome to History.js (v1.5.0 - February 12 2011)
==================


This project is the successor of [jQuery History](http://balupton.com/projects/jquery-history), it aims to:

- Follow the [HTML5 History/State APIs](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history) as much as possible
- Provide a cross-compatible experience for all HTML5 Browsers (they all implement the HTML5 History API a little bit differently causing different behaviours and sometimes bugs - History.js fixes this ensuring the experience is as expected / the same / great throughout the HTML5 browsers)
- Provide a backwards-compatible experience for all HTML4 Browsers using a hash-fallback (including continued support for the HTML5 History API's `data`, `title`, `pushState` and `replaceState`) with the option to [remove HTML4 support if it is not right for your application](https://github.com/balupton/History.js/wiki/Intelligent-State-Handling)
- Provide a forwards-compatible experience for HTML4 States to HTML5 States (so if a hash-fallbacked url is accessed by a HTML5 browser it is naturally transformed into its non-hashed url equivalent)
- Provide support for as many javascript frameworks as possible via adapters; especially [jQuery](http://jquery.com/), [MooTools](http://mootools.net/) and [Prototype](http://www.prototypejs.org/)

Licensed under the [New BSD License](http://creativecommons.org/licenses/BSD/)
Copyright 2011 [Benjamin Arthur Lupton](http://balupton.com)


## Usage

### Working with History.js:

	(function(window,undefined){

		var History = window.History; // Note: We are using a capital H instead of a lower h

		History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
			var State = History.getState(); // Note: We are using History.getState() instead of event.state
			History.log(State.data, State.title, State.url);
		});

		History.pushState({state:1}, "State 1", "?state=1"); // logs {state:1}, "State 1", "?state=1"
		History.pushState({state:2}, "State 2", "?state=2"); // logs {state:2}, "State 2", "?state=2"
		History.replaceState({state:3}, "State 3", "?state=3"); // logs {state:3}, "State 3", "?state=3"
		History.pushState(null, null, "?state=4"); // logs {}, '', "?state=4"
		History.back(); // logs {state:3}, "State 3", "?state=3"
		History.back(); // logs {state:1}, "State 1", "?state=1"
		History.back(); // logs {}, "Home Page", "?"
		History.go(2); // logs {state:3}, "State 3", "?state=3"

	})(window);

### How would the above operations look in a HTML5 Browser?

1. www.mysite.com
1. www.mysite.com?state=1
1. www.mysite.com?state=2
1. www.mysite.com?state=3
1. www.mysite.com?state=4
1. www.mysite.com?state=3
1. www.mysite.com?state=1
1. www.mysite.com
1. www.mysite.com?state=3

> Note: These urls also work in HTML4 browsers and Search Engines. So no need for the hashbang (`#!`) fragment-identifier that google ["recommends"](https://github.com/balupton/History.js/wiki/Intelligent-State-Handling).

### How would they look in a HTML4 Browser?

1. www.mysite.com
1. www.mysite.com#?state=1/uid=1
1. www.mysite.com#?state=2/uid=2
1. www.mysite.com#?state=3/uid=3
1. www.mysite.com#?state=4
1. www.mysite.com#?state=3/uid=3
1. www.mysite.com#?state=1/uid=1
1. www.mysite.com
1. www.mysite.com#?state=3/uid=3

> Note 1: These urls also work in HTML5 browsers - we use `replaceState` to transform these HTML4 states into their HTML5 equivalents so the user won't even notice :-)
>
> Note 2: These urls will be url-encoded in all HTML4 Browsers except Opera as it does not url-encode the urls. The url-encoding is necessary for these browsers as otherwise it won't work (the hashes won't actually apply). There is nothing we can do about this.
>
> Note 3: Support for HTML4 browsers (this hash fallback) is optional [- why supporting HTML4 browsers could be either good or bad based on my app's use cases](https://github.com/balupton/History.js/wiki/Intelligent-State-Handling)

### What's the deal with the UIDs used in the HTML4 States?

- UIDs are used when we utilise a `title` and/or `data` in our state. Adding a UID allows us to associate particular states with data and titles while keeping the urls as simple as possible (don't worry it's all tested, working and a lot smarter than I'm making it out to be).
- If you aren't utilising `title` or `data` then we don't even include a UID (as there is no need for it) - as seen by State 4 above :-)
- We also shrink the urls to make sure that the smallest url will be used. For instance we will adjust `http://www.mysite.com/#http://www.mysite.com/projects/History.js` to become `http://www.mysite.com/#/projects/History.js` automatically. (again tested, working, and smarter).
- It works with domains, subdomains, subdirectories, whatever - doesn't matter where you put it. It's smart.

### Is there a working demo?

- Sure is, give it a download and navigate to the demo directory in your browser :-)
- If you are after something a bit more adventurous than a end-user demo, open up the tests directory in your browser and editor - it'll rock your world and show all the vast use cases that History.js supports. _Note: you will have to [run a `git submodule init; git submodule update` and update the `tests/.htaccess` for your path] prior to running the tests._


## Download & Installation

1. Download History.js and upload it to your webserver. Download links: [tar.gz](https://github.com/balupton/History.js/tarball/master) or [zip](https://github.com/balupton/History.js/zipball/master)

2. Include [JSON2](http://www.json.org/js.html) for HTML4 Browsers Only *(replace www.yourwebsite.com)*

		<script type="text/javascript">
			if ( typeof JSON === 'undefined' ) {
				var
					url = 'http://www.yourwebsite.com/history.js/scripts/compressed/json2.js',
					scriptEl = document.createElement('script');
				scriptEl.type = 'text/javascript';
				scriptEl.src = url;
				document.body.appendChild(scriptEl);
			}
		</script>

3. Include the Adapter for your Framework:

	- [jQuery](http://jquery.com/)

			<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.jquery.js"></script>

	- [Mootools](http://mootools.net/)

			<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.mootools.js"></script>

	- [Prototype](http://www.prototypejs.org/)

			<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.prototype.js"></script>

	- _Would you like to support another framework? No problem! It's very easy to create adapters, and I'll be happy to include them or help out if you [let me know](https://github.com/balupton/history.js/issues) :-)_


4. Include History.js

		<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.js"></script>
		<script type="text/javascript" src="http://www.yourwebsite.com/history.js/scripts/compressed/history.html4.js"></script>

> Note: If you want to only support HTML5 Browsers and not HTML4 Browsers (so no hash fallback support) then just remove the `history.html4.js` include in step #4 file and the JSON2 include in step #2 [- why supporting HTML4 browsers could be either good or bad based on my app's use cases](https://github.com/balupton/History.js/wiki/Intelligent-State-Handling)


## Subscribe to Updates

- For Email Updates:
	- You can subscribe via the subscription form included in the demo page
- For Commit RSS/Atom Updates:
	- You can subscribe via the [GitHub Commit Atom Feed](https://github.com/balupton/History.js/commits/master.atom)
- For GitHub News Feed Updates:
	- You can click the "watch" button up the top right of History.js's [GitHub Project Page](https://github.com/balupton/History.js)


## Getting Support

History.js is an actively developed, supported and maintained project. You can grab support via its [GitHub Issue Tracker](https://github.com/balupton/History.js/issues). Alternatively you can reach [Benjamin Lupton](http://balupton.com) (the core developer) via [twitter](http://twitter.com/balupton), skype (balupton) or email (contact@balupton.com).


## Giving Support

If you'd love to give some support back and make a difference; here are a few great ways you can give back!

- Give it your honest rating on its [jQuery Plugin Page](http://plugins.jquery.com/project/history-js)
- If you have any feedback or suggestions let me know via its [Issue Tracker](https://github.com/balupton/History.js/issues) - so that I can ensure you get the best experience!
- Spread the word via tweets, blogs, tumblr, whatever - the more people talking about it the better!
- Donate via the donation form at the bottom right of [balupton.com](http://balupton.com) - every cent truly does help!
- Make it easier for me to let you know about future releases and updates by subscribing via the signup form inside the demo page
- Watch it via clicking the "watch" button up the top of its [Project Page](https://github.com/balupton/History.js)

Thanks! every bit of help really does make a difference. Again thank you.


## Browsers: Tested and Working In

### HTML5 Browsers

- Chrome 8,9
- Firefox 4
- Safari 5
- Safari iOS 4.2.1

### HTML4 Browsers

- Opera 10,11
- Firefox 3
- IE 6,7,8


## Exposed API

### Functions

- `History.pushState(data,title,url)` <br/> Pushes a new state to the browser, `data` and `title` can be null
- `History.replaceState(data,title,url)` <br/> Replaces the existing state with a new state to the browser, `data` and `title` can be null
- `History.getState()` <br/> Get's the current state of the browser, returns an object with `data`, `title` and `url`
- `History.getHash()` <br/> Get's the current hash of the browser
- `History.Adapter.bind(element,event,callback)` <br/> A framework independent event binder, you may either use this or your framework's native event binder.
- `History.Adapter.trigger(element,event)` <br/> A framework independent event trigger, you may either use this or your framework's native event trigger.
- `History.Adapter.onDomLoad(callback)` <br/> A framework independent onDomLoad binder, you may either use this or your framework's native onDomLoad binder.
- `History.back()` <br/> Go back once through the history (same as hitting the browser's back button)
- `History.forward()` <br/> Go forward once through the history (same as hitting the browser's forward button)
- `History.go(X)` <br/> If X is negative go back through history X times, if X is positive go forwards through history X times
- `History.log(...)` <br/> Logs messages to the console, the log element, and fallbacks to alert if neither of those two exist
- `History.debug(...)` <br/> Same as `History.log` but only runs if `History.debug.enable === true`

### Events

- `window.onstatechange` <br/> Fired when the state of the page changes (does not include hashchanges)
- `window.onanchorchange` <br/> Fired when the anchor of the page changes (does not include state hashes)


## Notes on Compatibility

- History.js resolves the following browser bugs:
	- Chrome does not retrieve the correct state data when traversing back to the start page
	- Safari 5 and Safari iOS 4.2.1 do not fire the `onpopstate` event on page load or when the hash has changed
	- MSIE 6 and 7 sometimes do not actually apply hash-changes
	- Non-Opera HTML4 browsers sometimes fail when the hash is not `urlencoded`
- State data will always contain the State's title and url at: `data.title` and `data.url`
- State data and title will not persist if the page was closed then re-opened, or navigated to another website then back - this is expected/standard functionality
- State titles will always be applied to the `document.title` if set
- ReplaceState functionality is emulated in HTML4 browsers by discarding the replaced state, so when the discarded state is accessed it is skipped using the appropriate `History.back()` / `History.forward()` call
- HTML4 Browsers on initial page load will have a hash inserted into the url; this is to ensure correct cross-compatibility between HTML4 browsers (as IE will refresh the page if the anchor is lost)
- Changing the hash of the page causes `onpopstate` to fire; this is expected/standard functionality. To ensure correct compatibility between HTML5 and HTML4 browsers the following events have been created:
	- `window.onstatechange`: this is the same as onpopstate except does not fire for traditional anchors
	- `window.onanchorchange`: this is the same as onhashchange except does not fire for states


## Changelog

- v1.5.0 - February 12 2011
	- Moved to UglifyJS instead of Google Closure
	- Split HTML4 functionality from HTML5 functionality
	- Installation details have changed (the filenames are different)

- v1.4.1 - February 10 2011
	- Added HTML History API Support for Safari 5 and Safari iOS 4.2.1
	- Cleaned code a bit (mostly with unit tests)

- v1.4.0 - February 10 2011
	- Unit Testing now uses [QUnit](http://docs.jquery.com/Qunit)
	- Corrected Safari 5 Support
	- Now uses queues instead of timeouts
		- This means the API works exactly as expected, no more need to wrap calls in timeouts
	- Included a Subscribe Form in the Demo for Version Updates via Email
	- Small updates to Documentation

- v1.3.1 - February 04 2011
	- Improved Documentation

- v1.3.0 - January 31 2011
	- Support for cleaner HTML4 States

- v1.2.1 - January 30 2011
	- Fixed History.log always being called - [reported by dlee](https://github.com/balupton/History.js/issues/#issue/2)
	- Re-Added `History.go(index)` support

- v1.2.0 - January 25 2011
	- Support for HTML4 States in HTML5 Browsers (added test)
	- Updates of Documentation

- v1.1.0 - January 24 2011
	- Developed a series of automated test cases
	- Fixed issue with traditional anchors
	- Fixed issue with differing replaceState functionality in HTML4 Browsers
	- Fixed issue with Google Chrome artefacts being carried over to the initial state
	- Provided `onstatechange` and `onanchorchange` events

- v1.0.0 - January 22 2011
	- Supported `History.pushState` and `History.replaceState` degradation
	- Supported jQuery, MooTools and Prototype Frameworks


## Todo for Upcoming Releases

- Allow for url to be optional in `pushState` and `replaceState` calls
- Add data persistance to HTML4 browsers (navigate to 3rd party website, navigate back, state data should still be there)
	- Default will use cookies (requires no configuration) - limited to a 4KB payload.
	- Extension will use cookies and add an ajax pre-fetch to fetch full (unlimited) data (requires configuration through a server-side helper)
- Add an Ajax extension to succeed the [jQuery Ajaxy](http://balupton.com/projects/jquery-ajaxy) project
- Add a compilation test to ensure `.debug = false` and no `History.log` or `console.xxx` calls exist.

It's likely these features and/or others have been included in the latest [dev branch](https://github.com/balupton/History.js/tree/dev). If you are wanting to fork and help out, then be sure to work on the dev branch and not master.
