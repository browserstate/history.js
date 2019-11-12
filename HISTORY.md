## History

- v1.8b2 - June 22 2013
    - Introduced uncompressed bundled files #287
    - Copied component.json to bower.json #291 and used right tag #286
    - Fixed wrong argument passed to History.getHash() #305, #297, #292 (@Izkata)

- v1.8b1 - May 31 2013
    - Fixed "encoded string automatically unencoded on html5 browsers" #282, #236, #272

- v1.8a4 - February 13 2013
    - Fixed coffee script warnings (ExtJS & Dojo adapter, IE 6 iFrame)
    - Updated qUnit to release 1.11.0, jQuery to release 1.9.1

- v1.8a3 - February 5 2013
	- Added tests for Dojo and ExtJS
	- Changed setting of title and url
	- Testing status
		- All HTML5 Native Adapter fail in all browsers on Test 10
		- All other HTML5 tests work fine
		- All other HTML4 tests fail in Test 4 (in IE)

- v1.8a2 - January 21 2013
	- Fixed hashchange / statechange triggers: e.g. if a user in a HTML5 browser clicks a link, statechange is fired, in a HTML4 browser only hashchange, but state has also changed
	- UTF8 / url encoding / decoding tested and so resolved: #64, #107, #108, #162, #177, #187, #205, #207, #210, #228, #251
	- Fixed #244

- v1.8a1 - January 19 2013
	- Pass options to `init()` as json is now supported
	- Added unicode demo
	- Introduced `getCurrentIndex()`, so you can get previous state by `History.getStateByIndex(getCurrentIndex()-1)`
	- Fixed HTML4 endless loop when url starts with a slash (e.g. /welcome/hello) #239, #232, #185
	- Bundled and compressed all scripts
	- Responsed (and therefore solved) or old issues from balupton repository: #250, #242, #238, #234, #224, #213, #206, #195, #183, #181, #180, #179, #175, #168
	- Fixed (or merged and therefore fixed) old issues from balupton repository: #248, #239, #236, #235, #229, #221, #220, #218, #215, #214, #212, #203, #191, #189, #172, #171, #166  
	- Feedback for UTF8 / url encode issues necessary, related problems (thanks to riyad)
		- #64, #107, #108, #162, #177, #187, #205, #207, #210, #228

- v1.7.2 - January 18 2013
	- Updated project README
	- Integrated ExtJS Adapter (thanks to @seanadkinson!)
	- Merged from forks
		- added option to force no suid (@hrunting, @sbearcsiro)
		- provide a consistent URI-encoded document.location.href (@hrunting, @sbearcsiro)
		- Change History.getHash to return consistent hash, ala History.getLocationHref (@sbearcsiro)
		- Fix an issue where HTML4 replaceState wasn't firing when SUIDs were disabled and the url didn't change (@sbearcsiro)
		- Make extractId ignore the fragment if one is present (normally the hash is passed without an fragment) (@sbearcsiro)
		- Remove all encoding / decoding of URLs except when creating or extracting a fragment, based on the assumption that all inputs to replaceState / pushState are appropriately encoded (@sbearcsiro)
		- Change escapeHash/unescapeHash methods to use encodeURI/decodeURI instead of window.escape/unescape (@sbearcsiro)
		- Fixed issue #158 (@sbearcsiro)
		- isEmptyObject should use hasOwnProperty: prevents from always returning true if the Object.prototype is extended (@Alexander Johansson)
		- Add potential fix for IE8 not returning full hashed url from getLocationHref when hash contains encoded characters (@sbearcsiro)
		- Match current W3C popState event semantics for HTML4 (@STRML)
		- Added History.options.html4Mode for easier debugging (@gigafied)
		- Added History.options.delayInit (Boolean). (@gigafied)
		- Added error testing and quota relief for sessionStorage.setItem (@jamie-pate)
		- Fix IE 6 HTTPS warning (@Daniel15)
		- Fixed bug in html4 pushState function which left History in a busy state (@joelarson4)
		- Disable session storage if it's present but not working, thanks to @paulschreiber (@sbearcsiro)
		- Add Lakin Wecker's dojo adapter (@sbearcsiro)
		- Add dojo 1.8 tests (@sbearcsiro)
		- Change dojo adapter to not use dojo events, it seems to break other parts of dojo (@sbearcsiro)
		- Removes stray spaces so that the build script can run. (@billmag)
		- fixed an issue in Safari's Private Browsing mode where setItem throws an exception (@billmag)
		- Adds better error handling for the quota exceeded problem seen with the iPad. (@billmag)
		- Consolidated var in sessionStorage to the top of the function. Re-build compressed and bundled. (@billmag)

- v1.7.1 - October 4 2011
	- Added a new native adapter which is framework agnostic (can be used with, or without any framework)
	- Provided bundled files
	- Added RightJS adapter
	- Updated supported browser listing
	- Added sessionStorage support in core instead of optional Amplify.js Store support
	- Fixed issue with state id generation growing slower over time
	- Closes #104, #95, #102, #92, #81, #90, #94, #93, #91, #67, #83, #54, #45

- v1.7.0 - April 1 2011
	- Added `History.enabled` property (refer to usage section). This reflects whether or not History.js is enabled for our particular browser. For instance, if we have not included support for a HTML4 browser and we are accessing through a HTML4 browser then `History.enabled` will be `false`.
	- Added (optional but recommended) Data Persistance and Synchronisation Support thanks to [AppendTo's](http://appendto.com/) [Amplify.js](http://amplifyjs.com/) (refer to installation and compatibility sections for details)
	- Made HTML5 SUIDs more transparent - [Reported](https://github.com/balupton/history.js/issues#issue/34) by [azago](https://github.com/azago) and [Mark Jaquith](http://markjaquith.com/)
	- Fixed Session Storage Issue - Reported by a whole bunch of different people; [one](https://github.com/balupton/history.js/issues#issue/36), [two](https://github.com/balupton/history.js/issues#issue/37), [three](http://getsatisfaction.com/balupton/topics/history_js_1_6_losing_state_after_manual_page_reload)
	- Fixed URL Encoding Issue - [Reported](https://github.com/balupton/history.js/issues/#issue/33) by [Rob Madole](http://robmadole.com/)
	- Disabled support for IE6,7,8 when using the Prototype Adapter (there is nothing we can do about this, it is due to a bug in the prototype library) - [Reported](https://github.com/balupton/history.js/issues#issue/39) by [Sindre Wimberger](http://sindre.at/)
	- URLs in the State Hashes for HTML4 Browsers are now even shorter - [Discussion](https://github.com/balupton/history.js/issues#issue/28)
	- Fixed a issue with the MooTools Adapter and JSON with IE7 and IE8

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

- v1.3.1 - February 4 2011
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

