Welcome to History.js
==================

This project is the successor of jQuery History, it aims to:

	- Support HTML5's State Management
	- Provide a backwards compatible experience for Browsers which do not support HTML5's State Management
	- Provide a backwards campatible experience for Browsers which do not support HTML4's OnHashChange
	- Follow the original API's as much as possible
	- Support for traditional anchors
	- Support as many javascript frameworks as possible via adapters.

This is what has been done:

	- Working, but needs debugging.
	- jQuery Adapter

These are the current todos:

	- There is a double state issue in Opera
	- Chrome 8 and Firefox 4 only fire onpopstate when traversing through the history - need to test to see if this is a bug, or expected! May need to provide a new event.
	- Test in IE6, IE7, IE8, IE9.
	- Test in Firefox 3.
	- Test in Safari.
	- Support Dojo and Mootools

Licensed under the New BSD License, Copyright 2011 Benjamin Arthur Lupton
