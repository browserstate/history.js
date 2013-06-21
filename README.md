Welcome to History.js <br/> v1.8b2, June 22 2013
==================

[![Flattr this project](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=balupton&url=https://github.com/browserstate/history.js&title=History.js&language=&tags=github&category=software)

## News
- 22/06/2013: Beta 2 of v1.8 is released. Fixes and uncompressed bundled files.
- 31/05/2013: Beta 1 of v1.8 is released. Fixes.
- 14/02/2013: Alpha 4 of v1.8 is released. Fixes.
- 05/02/2013: Alpha 3 of v1.8 is released. Tests updated.
- 21/01/2013: Alpha 2 of v1.8 is released. Correct statechange behaviour.
- 19/01/2013: Alpha 1 of v1.8 is released. Started to categorize old balupton's issues.

### History

See the [`History.md`](https://github.com/browserstate/history.js/blob/master/History.md#files) file for a detailed list of features, changes, solved issues and bugs

### Involve

Please create an issue if something doesn't work or if there is a browser specific bug. I'll try to fix it as soon as possible. Please send me your Pull requests if you have a nice solution! I'm also going to review old issues in balupton's repository and try to solve them too.

## Aims

- Follow the [HTML5 History API](https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history) as much as possible
- Provide a cross-compatible experience for all HTML5 Browsers (they all implement the HTML5 History API a little bit differently causing different behaviours and sometimes bugs - History.js fixes this ensuring the experience is as expected / the same / great throughout the HTML5 browsers)
- Provide a backwards-compatible experience for all HTML4 Browsers using a hash-fallback (including continued support for the HTML5 History API's `data`, `title`, `pushState` and `replaceState`) with the option to [remove HTML4 support if it is not right for your application](https://github.com/browserstate/history.js/wiki/Intelligent-State-Handling)
- Provide a forwards-compatible experience for HTML4 States to HTML5 States (so if a hash-fallbacked url is accessed by a HTML5 browser it is naturally transformed into its non-hashed url equivalent)
- Provide support for as many javascript frameworks as possible via adapters; especially [Dojo](http://dojotoolkit.org/), [ExtJS](http://www.sencha.com/), [jQuery](http://jquery.com/), [MooTools](http://mootools.net/), [Right.js](http://rightjs.org/) and [Zepto](http://zeptojs.com/).

## Usage

### Instant

To ajaxify your entire website with the HTML5 History API, History.js and jQuery the [Ajaxify Script](https://github.com/browserstate/ajaxify) is all you need. It's that easy.

### Ruby On Rails

If you are using Rails, then the easiest way for you to try History.js would be to use [Wiselinks](https://github.com/igor-alexandrov/wiselinks) gem. Wiselinks integrates  into Rails application and allows you to start using History.js with three lines of code.

### Working with History.js directly

``` javascript
(function(window,undefined){

	// Bind to StateChange Event
	History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
		var State = History.getState(); // Note: We are using History.getState() instead of event.state
	});

	// Change our States
	History.pushState({state:1}, "State 1", "?state=1"); // logs {state:1}, "State 1", "?state=1"
	History.pushState({state:2}, "State 2", "?state=2"); // logs {state:2}, "State 2", "?state=2"
	History.replaceState({state:3}, "State 3", "?state=3"); // logs {state:3}, "State 3", "?state=3"
	History.pushState(null, null, "?state=4"); // logs {}, '', "?state=4"
	History.back(); // logs {state:3}, "State 3", "?state=3"
	History.back(); // logs {state:1}, "State 1", "?state=1"
	History.back(); // logs {}, "Home Page", "?"
	History.go(2); // logs {state:3}, "State 3", "?state=3"

})(window);
```

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

> Note: These urls also work in HTML4 browsers and Search Engines. So no need for the hashbang (`#!`) fragment-identifier that google ["recommends"](https://github.com/browserstate/history.js/wiki/Intelligent-State-Handling).

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
> Note 3: Support for HTML4 browsers (this hash fallback) is optional [- why supporting HTML4 browsers could be either good or bad based on my app's use cases](https://github.com/browserstate/history.js/wiki/Intelligent-State-Handling)

### What's the deal with the SUIDs used in the HTML4 States?

- SUIDs (State Unique Identifiers) are used when we utilise a `title` and/or `data` in our state. Adding a SUID allows us to associate particular states with data and titles while keeping the urls as simple as possible (don't worry it's all tested, working and a lot smarter than I'm making it out to be).
- If you aren't utilising `title` or `data` then we don't even include a SUID (as there is no need for it) - as seen by State 4 above :-)
- We also shrink the urls to make sure that the smallest url will be used. For instance we will adjust `http://www.mysite.com/#http://www.mysite.com/projects/History.js` to become `http://www.mysite.com/#/projects/History.js` automatically. (again tested, working, and smarter).
- It works with domains, subdomains, subdirectories, whatever - doesn't matter where you put it. It's smart.
- Safari 5 will also have a SUID appended to the URL, it is entirely transparent but just a visible side-effect. It is required to fix a bug with Safari 5.

### Is there a working demo?

- Sure is, give it a download and navigate to the demo directory in your browser :-)
- If you are after something a bit more adventurous than a end-user demo, open up the tests directory in your browser and editor - it'll rock your world and show all the vast use cases that History.js supports.

## Download & Installation

- Download History.js and upload it to your webserver. Download links: [tar.gz](https://github.com/browserstate/history.js/tarball/master) or [zip](https://github.com/browserstate/history.js/zipball/master)

- Include History.js

	- For [Dojo](http://dojotoolkit.org/) v1.8+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/dojo.history.js"></script>
		```
	
	- For [ExtJs](http://www.sencha.com/) v1.8+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/extjs.history.js"></script>
		```
	
	- For [jQuery](http://jquery.com/) v1.3+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/jquery.history.js"></script>
		```

	- For [Mootools](http://mootools.net/) v1.3+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/mootools.history.js"></script>
		```

	- For [Right.js](http://rightjs.org/) v2.2+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/right.history.js"></script>
		```

	- For [Zepto](http://zeptojs.com/) v0.5+

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/zepto.history.js"></script>
		```

	- For everything else

		``` html
		<script src="http://www.yourwebsite.com/history.js/scripts/bundled/html4+html5/native.history.js"></script>
		```

> Note: If you want to only support HTML5 Browsers and not HTML4 Browsers (so no hash fallback support) then just change the `/html4+html5/` part in the urls to just `/html5/`. See [Why supporting HTML4 browsers could be either good or bad based on my app's use cases](https://github.com/browserstate/history.js/wiki/Intelligent-State-Handling)


## Get Updates

- For Commit RSS/Atom Updates:
	- You can subscribe via the [GitHub Commit Atom Feed](http://feeds.feedburner.com/historyjs)
- For GitHub News Feed Updates:
	- You can click the "watch" button up the top right of History.js's [GitHub Project Page](https://github.com/browserstate/history.js)


## Get Support

- History.js is maintained by people like you. If you find a bug, report it to the [GitHub Issue Tracker](https://github.com/browserstate/history.js/issues). If you've fixed a bug submit a [Pull Request](https://github.com/browserstate/history.js/pulls) and add your fork to the [Network Wiki Page](https://github.com/browserstate/history.js/wiki/Network).

- If you would like paid support and trainings, or have job offers, then refer to the [Network Wiki Page](https://github.com/browserstate/history.js/wiki/Network). If you are qualified with History.js, then be sure to add your details to that page too.

- If your company uses History.js on your projects, and would like to see it grow and prosper (better documentation, bugfixes, upgrades, maintenance, etc.) and would love to become a corporate sponsor then do email sponsor@bevry.me

- If you would like free support for History.js, then [post your question](http://stackoverflow.com/questions/ask) on [Stackoverflow](http://stackoverflow.com/about) and be sure to use the `history.js` tag when asking your question.

- If you've created a website that uses History.js, or know of one, be sure to add it to the [Showcase Wiki Page](https://github.com/browserstate/history.js/wiki/Showcase).

- If you'd love to +1 or like this project, then be sure to tweet about it and click the "watch" button up the top of its [Project Page](https://github.com/browserstate/history.js).

- For anything else, refer to the [History.js GitHub Wiki Site](https://github.com/browserstate/history.js/wiki).

Thanks! every bit of help really does make a difference!


## Browsers: Tested and Working In

### HTML5 Browsers

- Firefox 4+
- Chrome 8+
- Opera 11.5+
- Safari 5.0+
- Safari iOS 4.3+

### HTML4 Browsers

- IE 6, 7, 8, 9, (10)
- Firefox 3
- Opera 10, 11.0
- Safari 4
- Safari iOS 4.2, 4.1, 4.0, 3.2


## Exposed API

### Functions

#### States
- `History.pushState(data,title,url)` <br/> Pushes a new state to the browser; `data` can be null or an object, `title` can be null or a string, `url` must be a string
- `History.replaceState(data,title,url)` <br/> Replaces the existing state with a new state to the browser; `data` can be null or an object, `title` can be null or a string, `url` must be a string
- `History.getState()` <br/> Gets the current state of the browser, returns an object with `data`, `title` and `url`
- `History.getStateByIndex` <br/> Gets a state by the index
- `History.getCurrentIndex` <br/> Gets the current index
- `History.getHash()` <br/> Gets the current hash of the browser

#### Adapter
- `History.Adapter.bind(element,event,callback)` <br/> A framework independent event binder, you may either use this or your framework's native event binder.
- `History.Adapter.trigger(element,event)` <br/> A framework independent event trigger, you may either use this or your framework's native event trigger.
- `History.Adapter.onDomLoad(callback)` <br/> A framework independent onDomLoad binder, you may either use this or your framework's native onDomLoad binder.

#### Navigation
- `History.back()` <br/> Go back once through the history (same as hitting the browser's back button)
- `History.forward()` <br/> Go forward once through the history (same as hitting the browser's forward button)
- `History.go(X)` <br/> If X is negative go back through history X times, if X is positive go forwards through history X times

#### Debug
- `History.log(...)` <br/> Logs messages to the console, the log element, and fallbacks to alert if neither of those two exist
- `History.debug(...)` <br/> Same as `History.log` but only runs if `History.debug.enable === true`



### Options

- `History.options.hashChangeInterval` <br/> How long should the interval be before hashchange checks
- `History.options.safariPollInterval` <br/> How long should the interval be before safari poll checks
- `History.options.doubleCheckInterval` <br/> How long should the interval be before we perform a double check
- `History.options.disableSuid` <br/> Force History not to append suid
- `History.options.storeInterval` <br/> How long should we wait between store calls
- `History.options.busyDelay` <br/> How long should we wait between busy events
- `History.options.debug` <br/> If true will enable debug messages to be logged
- `History.options.initialTitle` <br/> What is the title of the initial state
- `History.options.html4Mode` <br/> If true, will force HTMl4 mode (hashtags)
- `History.options.delayInit` <br/> Want to override default options and call init manually.

### Events

- `window.onstatechange` <br/> Fired when the state of the page changes (does not include hash changes)
- `window.onanchorchange` <br/> Fired when the anchor of the page changes (does not include state hashes)


## Known Issues
- Opera 11 fails to create history entries when under stressful loads (events fire perfectly, just the history events fail) - there is nothing we can do about this
- Mercury iOS fails to apply url changes (hashes and HTML5 History API states) - there is nothing we can do about this


## Notes on Compatibility

- History.js **solves** the following browser bugs:
	- HTML5 Browsers
		- Chrome 8 sometimes does not contain the correct state data when traversing back to the initial state
		- Safari 5, Safari iOS 4 and Firefox 3 and 4 do not fire the `onhashchange` event when the page is loaded with a hash
		- Safari 5 and Safari iOS 4 do not fire the `onpopstate` event when the hash has changed unlike the other browsers
		- Safari 5 and Safari iOS 4 fail to return to the correct state once a hash is replaced by a `replaceState` call / [bug report](https://bugs.webkit.org/show_bug.cgi?id=56249)
		- Safari 5 and Safari iOS 4 sometimes fail to apply the state change under busy conditions / [bug report](https://bugs.webkit.org/show_bug.cgi?id=42940)
		- Google Chrome 8,9,10 and Firefox 4 prior to the RC will always fire `onpopstate` once the page has loaded / [change recommendation](http://hacks.mozilla.org/2011/03/history-api-changes-in-firefox-4/)
		- Safari iOS 4.0, 4.1, 4.2 have a working HTML5 History API - although the actual back buttons of the browsers do not work, therefore we treat them as HTML4 browsers
		- None of the HTML5 browsers actually utilise the `title` argument to the `pushState` and `replaceState` calls
	- HTML4 Browsers
		- Old browsers like MSIE 6,7 and Firefox 2 do not have a `onhashchange` event
		- MSIE 6 and 7 sometimes do not apply a hash even it was told to (requiring a second call to the apply function)
		- Non-Opera HTML4 browsers sometimes do not apply the hash when the hash is not `urlencoded`
	- All Browsers
		- State data and titles do not persist once the site is left and then returned (includes page refreshes)
		- State titles are never applied to the `document.title`
- ReplaceState functionality is emulated in HTML4 browsers by discarding the replaced state, so when the discarded state is accessed it is skipped using the appropriate `History.back()` / `History.forward()` call
- Data persistance and synchronisation works like so: Every second or so, the SUIDs and URLs of the states will synchronise between the store and the local session. When a new session opens a familiar state (via the SUID or the URL) and it is not found locally then it will attempt to load the last known stored state with that information.
- URLs will be unescaped to the maximum, so for instance the URL `?key=a%20b%252c` will become `?key=a b c`. This is to ensure consistency between browser url encodings.
- Changing the hash of the page causes `onpopstate` to fire (this is expected/standard functionality). To ensure correct compatibility between HTML5 and HTML4 browsers the following events have been created:
	- `window.onstatechange`: this is the same as the `onpopstate` event except it does not fire for traditional anchors
	- `window.onanchorchange`: this is the same as the `onhashchange` event except it does not fire for states


## History

You can discover the history inside the [History.md](https://github.com/browserstate/history.js/blob/master/History.md#files) file


## License

Licensed under the [New BSD License](http://opensource.org/licenses/BSD-3-Clause)
<br/>Copyright &copy;  2011+ [Benjamin Arthur Lupton](http://balupton.com)
