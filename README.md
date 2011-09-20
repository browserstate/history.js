Welcome to History.js (v1.8.0 - ???)
==================


This project is the successor of [jQuery History](http://balupton.com/projects/jquery-history), it aims to:

- Follow the [HTML5 History API](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history) as much as possible
- Provide a cross-compatible experience for all HTML5 Browsers (they all implement the HTML5 History API a little bit differently causing different behaviours and sometimes bugs - History.js fixes this ensuring the experience is as expected / the same / great throughout the HTML5 browsers)
- Provide a backwards-compatible experience for all HTML4 Browsers using a hash-fallback (including continued support for the HTML5 History API's `data`, `title`, `pushState` and `replaceState`) with the option to [remove HTML4 support if it is not right for your application](https://github.com/balupton/history.js/wiki/Intelligent-State-Handling)
- Provide a forwards-compatible experience for HTML4 States to HTML5 States (so if a hash-fallbacked url is accessed by a HTML5 browser it is naturally transformed into its non-hashed url equivalent)
- Provide support for use without any javascript framework, as well as native support for popular javascript frameworks - including [jQuery](http://jquery.com/), [MooTools](http://mootools.net/), [RightJS](http://rightjs.org/) and [Zepto](http://zeptojs.com/)

Licensed under the [New BSD License](http://creativecommons.org/licenses/BSD/)
Copyright 2011 [Benjamin Arthur Lupton](http://balupton.com)


## Usage

### Working with History.js

``` javascript
(function(window,undefined){

	// Prepare
	var History = window.History; // Note: We are using a capital H instead of a lower h
	if ( !History.enabled ) {
		 // History.js is disabled for this browser.
		 // This is because we can optionally choose to support HTML4 browsers or not.
		return false;
	}

	// Bind to StateChange Event
	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
		var State = History.getState(); // Note: We are using History.getState() instead of event.state
		History.log(State.data, State.title, State.url);
	});

	// Check the Initial State
	var initialState = History.getState();
	History.log(initialState.data, initialState.title, initialState.url);
	// ^ Logs: {}, "Home Page", "?"

	// Add our States
	History.pushState({state:1}, "State 1", "?state=1");
	// ^ Logs: {state:1}, "State 1", "?state=1"
	History.pushState({state:2}, "State 2", "?state=2");
	// ^ Logs: {state:2}, "State 2", "?state=2"
	History.replaceState({state:3}, "State 3", "?state=3");
	// ^ Logs: {state:3}, "State 3", "?state=3"
	History.pushState(null, null, "?state=4");
	// ^ Logs: {}, '', "?state=4"

	// Notice how the above calls trigger statechange events, if for some reason you do not want this to happen
	// then inside your statechange handler you can use the following:
	// if ( History.getState().internal ) { return; }

	// Other special variables include:
	// `History.getState().anchor` for when the state includes a traditional anchor
	// and `History.getState().same` for when the state is the same as the last state (no change)

	// Traverse our States
	History.back();
	// ^ Logs: {state:3}, "State 3", "?state=3"
	History.back();
	// ^ Logs: {state:1}, "State 1", "?state=1"
	History.back();
	// ^ Logs: {}, "Home Page", "?"
	History.go(2);
	// ^ Logs: logs {state:3}, "State 3", "?state=3"

})(window);
```

**For solutions to ajaxify your entire website with zero-configuration, there are these pre-made scripts:**

- [This snippet of jQuery code](https://gist.github.com/854622) which you can drop into your website
- [This bookmarklet](https://gist.github.com/919358) which you can use to see what your website (or others) looks like with History.js enabled
- [This Google Chrome Extension](https://chrome.google.com/extensions/detail/oikegcanmmpmcmbkdopcfdlbiepmcebg) which you can use to inject History.js and keep it injected on websites of your choice


### How would the above operations look in a HTML5 Browser?

1. www.mysite.com
1. www.mysite.com/?state=1
1. www.mysite.com/?state=2
1. www.mysite.com/?state=3
1. www.mysite.com/?state=4
1. www.mysite.com/?state=3
1. www.mysite.com/?state=1
1. www.mysite.com
1. www.mysite.com/?state=3

> Note: These urls also work in HTML4 browsers and Search Engines. So no need for the hashbang (`#!`) fragment-identifier that google ["recommends"](https://github.com/balupton/history.js/wiki/Intelligent-State-Handling).


### How would they look in a HTML4 Browser?

1. www.mysite.com
1. www.mysite.com/#?state=1&_suid=1
1. www.mysite.com/#?state=2&_suid=2
1. www.mysite.com/#?state=3&_suid=3
1. www.mysite.com/#?state=4
1. www.mysite.com/#?state=3&_suid=3
1. www.mysite.com/#?state=1&_suid=1
1. www.mysite.com
1. www.mysite.com/#?state=3&_suid=3

> Note 1: These urls also work in HTML5 browsers - we use `replaceState` to transform these HTML4 states into their HTML5 equivalents so the user won't even notice :-)
>
> Note 2: These urls will be automatically url-encoded in IE6 to prevent certain browser-specific bugs.
>
> Note 3: Support for HTML4 browsers (this hash fallback) is optional [- why supporting HTML4 browsers could be either good or bad based on my app's use cases](https://github.com/balupton/history.js/wiki/Intelligent-State-Handling)


### What's the deal with the SUIDs used in the HTML4 States?

- SUIDs (State Unique Identifiers) are used when we utilise a `title` and/or `data` in our state. Adding a SUID allows us to associate particular states with data and titles while keeping the urls as simple as possible (don't worry it's all tested, working and a lot smarter than I'm making it out to be).
- If you aren't utilising `title` or `data` then we don't even include a SUID (as there is no need for it) - as seen by State 4 above :-)
- We also shrink the urls to make sure that the smallest url will be used. For instance we will adjust `http://www.mysite.com/#http://www.mysite.com/projects/History.js` to become `http://www.mysite.com/#/projects/History.js` automatically. (again tested, working, and smarter).
- It works with domains, subdomains, subdirectories, whatever - doesn't matter where you put it. It's smart.
- Safari 5 will also have a SUID appended to the URL, it is entirely transparent but just a visible side-effect. It is required to fix a bug with Safari 5.

### Is there a working demo? Sure is.

- [You can try the official demo right here](http://balupton.github.com/history.js/demo/)
- or [check out how other people are using History.js in their own web sites and apps right here](https://github.com/balupton/history.js/wiki/Showcase)
- if you're feeling even more adventurous you can [check out the History.js Test Suite right here](http://balupton.github.com/history.js/tests/) - it'll rock your world and [show all the vast use cases that History.js supports](https://github.com/balupton/history.js/blob/dev/tests/tests.js#L172).


## Download & Installation

1. Download History.js and upload it to your webserver. Download links: [tar.gz](https://github.com/balupton/history.js/tarball/master) or [zip](https://github.com/balupton/history.js/zipball/master)

1. Include [JSON2](http://www.json.org/js.html) for HTML4 Browsers Only *(replace www.yourwebsite.com)*

	``` html
	<script>if ( typeof window.JSON === 'undefined' ) { document.write('<script src="http://www.yourwebsite.com/history.js/scripts/compressed/json2.js"><\/script>'); }</script>
	```

1. Include [Amplify.js Store](http://amplifyjs.com/api/store) for Data Persistance and Synchronisation Support (optional but recommended)

	``` html
	<script src="http://www.yourwebsite.com/history.js/scripts/compressed/amplify.store.js"></script>
	```

1. Include the Adapter for your Framework:

	- [jQuery](http://jquery.com/) v1.3+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.jquery.js"></script>
		```

	- [Mootools](http://mootools.net/) v1.3+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.mootools.js"></script>
		```

	- [RightJS](http://rightjs.org/) v2.2+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.right.js"></script>
		```

	- [Zepto](http://zeptojs.com/) v0.5+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.zepto.js"></script>
		```

	- Native (works with all frameworks, even without a framework)

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.adapter.native.js"></script>
		```

1. Include History.js

	``` html
	<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.js"></script>
	```

1. _Optional: Include support for HTML4 browsers_

	``` html
	<script src="http://www.yourwebsite.com/history.js/scripts/compressed/history.html4.js"></script>
	```

	> Note: It is recommended to include support for HTML4 browsers _only if you **really** need to_ [- why supporting HTML4 browsers could be either good or bad based on my app's use cases](https://github.com/balupton/history.js/wiki/Intelligent-State-Handling)


## Getting Updates

- For GitHub News Feed Updates:
	- Click the "watch" button up the top right of History.js's [GitHub Project Page](https://github.com/balupton/history.js)
- For Weekly Meetups:
	- [Hangout with Benjamin Lupton on Google+](https://plus.google.com/117485112588440259770/about)
- For Twitter Updates:
	- [Follow Benjamin Lupton on Twitter](https://twitter.com/balupton)
- For Commit RSS/Atom Updates:
	- [Subscribe via the GitHub Commit Atom Feed](http://feeds.feedburner.com/historyjs)


## Getting Support

**History.js is an actively supported, maintained and developed project.** You can grab support via its **[GitHub Issue Tracker](https://github.com/balupton/history.js/issues)** and contact its core developer [Benjamin Lupton](http://balupton.com) via [twitter](http://twitter.com/balupton), skype (balupton) and email (b@lupton.cc). Benjamin is also available for [bookings](http://speakerrate.com/speakers/11963-benjamin-lupton) (trainings, seminars, talks), [consulting](http://careers.stackoverflow.com/balupton) (development, advisory, implementations), sponsorship (angels, investors, donations, advertisement), interviews, chats, hackathons, socials and mentoring.


## Giving Support

If you'd love to give some support back and make a difference; here are a few great ways you can give back!

- Give it your honest rating on its [jQuery Plugin's Page](http://plugins.jquery.com/project/history-js) and its [Ohloh Page](https://www.ohloh.net/p/history-js)
- If you have any feedback or suggestions let me know via its [Issue Tracker](https://github.com/balupton/history.js/issues) - so that I can ensure you get the best experience!
- Spread the word via tweets, blogs, tumblr, whatever - the more people talking about it the better!
- [Make a donation](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=balupton%40gmail%2ecom&lc=AU&item_name=Donation%20to%20Benjamin%20Lupton&currency_code=AUD&bn=PP%2dDonationsBF%3adonate%2egif%3aNonHosted) - every cent truly does help!
- Add your website or app which is using History.js to the [Showcase](https://github.com/balupton/history.js/wiki/Showcase)
- Watch it via clicking the "watch" button up the top of its [Project Page](https://github.com/balupton/history.js)

Thanks! every bit of help really does make a difference. Again thank you.


## Browsers: Tested and Working In

### HTML5 Browsers

- Chrome 8,9,10
- Firefox 4
- Safari 5
- Safari iOS 4.3

### HTML4 Browsers

- IE 6,7,8,9
- Firefox 3
- Opera 10,11
- Safari 4
- Safari iOS prior to version 4.3


## Exposed API

### Functions

- `History.pushState(data,title,url)` <br/> Pushes a new state to the browser; `data` can be null or a serializable object, `title` can be null or a string, `url` must be a string
- `History.replaceState(data,title,url)` <br/> Replaces the existing state with a new state to the browser; `data` can be null or a serializable object, `title` can be null or a string, `url` must be a string
- `History.getState()` <br/> Gets the current state of the browser, returns a State object with the keys:
	- `data`: object: the state data that was pushed
	- `title`: string or `null`: the state title that was pushed
	- `url`: string: the state url that was pushed
	- `internal`: enum of `'pushState'`, `'replaceState'` or `false`: whether or not we where called internally or externally (back/forward button, refresh, new page)
	- `same`: boolean value: whether or not this state is the same as the last one
	- `anchor`: string or `false`: if the state has a traditional anchor, this is it
- `History.getHash()` <br/> Gets the current hash of the browser
- `History.setTitle(title)` <br/> Sets the title of the browser as well as the `<title>` element on the page
- `History.Adapter.bind(element,event,callback)` <br/> A framework independent event binder, you may either use this or your framework's native event binder.
- `History.Adapter.trigger(element,event)` <br/> A framework independent event trigger, you may either use this or your framework's native event trigger.
- `History.Adapter.onDomLoad(callback)` <br/> A framework independent onDomLoad binder, you may either use this or your framework's native onDomLoad binder.
- `History.back()` <br/> Go back once through the history (same as hitting the browser's back button)
- `History.forward()` <br/> Go forward once through the history (same as hitting the browser's forward button)
- `History.go(X)` <br/> If X is negative go back through history X times, if X is positive go forwards through history X times
- `History.log(...)` <br/> Logs messages to the console, the log element, and fallbacks to alert if neither of those two exist
- `History.debug(...)` <br/> Same as `History.log` but only runs if `History.debug.enable === true`

### Events

- `window.onstatechange` <br/> Fired when the state of the page changes (includes anchor changes)


## Notes on Compatibility

- History.js **solves** the following browser bugs:
	- HTML5 Browsers
		- Chrome 8 sometimes does not contain the correct state data when traversing back to the initial state
		- Safari 5, Safari iOS 4 and Firefox 3 and 4 do not fire the `window.onhashchange` event when the page is loaded with a hash
		- Safari 5 and Safari iOS 4 do not fire the `window.onpopstate` event when the hash has changed unlike the other browsers
		- Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call / [bug report](https://bugs.webkit.org/show_bug.cgi?id=56249)
		- Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions / [bug report](https://bugs.webkit.org/show_bug.cgi?id=42940)
		- Google Chrome 8,9,10 and Firefox 4 prior to the RC will always fire `window.onpopstate` once the page has loaded / [change recommendation](http://hacks.mozilla.org/2011/03/history-api-changes-in-firefox-4/)
		- Safari iOS 4.0, 4.1, 4.2 have a working HTML5 History API - although the actual back buttons of the browsers do not work, therefore we treat them as HTML4 browsers
	- HTML4 Browsers
		- Old browsers like MSIE 6,7 and Firefox 2 do not have a `window.onhashchange` event
		- MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
		- Non-Opera HTML4 browsers sometimes do not apply the hash when the hash is not `urlencoded`
	- All Browsers
		- State data and titles do not persist once the site is left and then returned (includes page refreshes)
		- State titles are never applied to the `document.title`
- ReplaceState functionality is emulated in HTML4 browsers by discarding the replaced state, so when the discarded state is accessed it is skipped using the appropriate `History.back()` / `History.forward()` call
- Data persistance and synchronisation works like so: Every second or so, the SUIDs and URLs of the states will synchronise between the store and the local session. When a new session opens a familiar state (via the SUID or the URL) and it is not found locally then it will attempt to load the last known stored state with that information.
- URLs will be unescaped to the maximum, so for instance the URL `?key=a%20b%252c` will become `?key=a b c`. This is to ensure consistency between browser url encodings.
- We use the new `window.onstatechange` event, as History.js binds into to the original `window.onpopstate` to do it's handling, and sometimes it may decide that we do not want to follow through with the propagation. Simply calling `event.stopImmediatePropagation()` is not enough to ensure consistency, so we have created the new `window.onstatechange` event for this.
- Known Issues
	- Opera 11 fails to create history entries when under stressful loads (events fire perfectly, just the history events fail) - there is nothing we can do about this
	- Mercury iOS fails to apply url changes (hashes and HTML5 History API states) - there is nothing we can do about this


## Changelog

- v1.8.0 - ???
	- Added [RightJS](http://rightjs.org/) Adapter
	- Added [Native](http://rightjs.org/) Adapter for use with any, or without any framework!
	- Fixed using History.js inside an iFrame with Safari 5 - [Reported](https://github.com/balupton/history.js/issues/#issue/40) by [desaintflorent](https://github.com/desaintflorent)
	- Fixed using History.js inside an iFrame with IE8 and IE9 (not yet done)
	- Fixed pushing states which contain traditional anchors (needs testing) - [Reported](https://github.com/balupton/history.js/issues#issue/42) by [Mark Jaquith](http://markjaquith.com/)
	- Added the flags `internal`, `same` and `anchor` to `History.getState()` - see Exposed API section of this readme
	- Fixed compatibility with Env.js - [Submitted](https://github.com/balupton/history.js/pull/60) by [Ryan Lee](http://zepheira.com/about/people/ryan-lee/)

- v1.7.0 - April 01 2011
	- Added `History.enabled` property (refer to usage section). This reflects whether or not History.js is enabled for our particular browser. For instance, if we have not included support for a HTML4 browser and we are accessing through a HTML4 browser then `History.enabled` will be `false`.
	- Added (optional but recommended) Data Persistance and Synchronisation Support thanks to [AppendTo's](http://appendto.com/) [Amplify.js](http://amplifyjs.com/) (refer to installation and compatibility sections for details)
	- Made HTML5 SUIDs more transparent - [Reported](https://github.com/balupton/history.js/issues#issue/34) by [azago](https://github.com/azago) and [Mark Jaquith](http://markjaquith.com/)
	- Fixed Session Storage Issue - Reported by a whole bunch of different people; [one](https://github.com/balupton/history.js/issues#issue/36), [two](https://github.com/balupton/history.js/issues#issue/37), [three](http://getsatisfaction.com/balupton/topics/history_js_1_6_losing_state_after_manual_page_reload)
	- Fixed URL Encoding Issue - [Reported](https://github.com/balupton/history.js/issues/#issue/33) by [Rob Madole](http://robmadole.com/)
	- Disabled support for IE6,7,8 when using the Prototype Adapter (there is nothing we can do about this, it is due to a bug in the prototype library) - [Reported](https://github.com/balupton/history.js/issues#issue/39) by [Sindre Wimberger](http://sindre.at/)
	- URLs in the State Hashes for HTML4 Browsers are now even shorter - [Discussion](https://github.com/balupton/history.js/issues#issue/28)
	- Fixed an issue with the MooTools Adapter and JSON with IE7 and IE8

- v1.6.0 - March 22 2011
	- Added Zepto adapter thanks to [Matt Garrett](http://twitter.com/#!/matthewgarrett)
	- The readme now references the supported versions of the libraries we use
	- Updated vendors to the most recent versions. jQuery 1.5.1 and Mootools 1.3.1
	- Reverted versions of Safari iOS prior to version 4.3 to be HTML4 browsers, Safari iOS 4.3 is a HTML5 browser
	- Refined code in History.js and its adapters
	- Fixed issue with extra state being inserted on Safari 5 requiring an extra click on the back button to go home - [Reported](https://github.com/balupton/history.js/issues#issue/17) by [Rob Madole](http://robmadole.com/)
	- Fixed issue with Safari 5 and Safari iOS 4 sometimes failing to apply the state change under busy conditions - Solution conceived with [Matt Garrett](http://twitter.com/matthewgarrett)
	- Fixed issue with HTML4 browsers requiring a query-string in the urls of states - [Reported](https://github.com/balupton/history.js/issues#issue/26) by [azago](https://github.com/azago)
	- Fixed issue with HTML4 browsers requiring title in the states in order to use state data - [Reported](https://github.com/balupton/history.js/issues#issue/25) by [Jonathan McLaughlin](http://system-werks.com/)
	- Fixed issue with HTML4 browsers failing is a state is pushed/replaced twice in a row - [Reported](https://github.com/balupton/history.js/issues#issue/17) by [Joey Baker](http://byjoeybaker.com/)
	- **B/C BREAK:** The `statechange` event now only fires if the state has changed; it no longer fires on page initialisation. This is following the [Firefox 4 History API Changes](http://hacks.mozilla.org/2011/03/history-api-changes-in-firefox-4/) which we agree with - this breaks standard, but makes more sense.

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
	- Fixed History.log always being called - [reported by dlee](https://github.com/balupton/history.js/issues/#issue/2)
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
- Add an Ajax extension to succeed the [jQuery Ajaxy](http://balupton.com/projects/jquery-ajaxy) project
- Add a compilation test to ensure `.debug = false` and no `History.log` or `console.xxx` calls exist.

It's likely these features and/or others have been included in the latest [dev branch](https://github.com/balupton/history.js/tree/dev). If you are wanting to fork and help out, then be sure to work on the dev branch and not master.
