Welcome to History.js
==================

This project is the successor of jQuery History, it aims to:

- Support HTML5's State Management
- Provide a backwards compatible experience for Browsers which do not support HTML5's State Management
- Provide a backwards compatible experience for Browsers which do not support HTML4's OnHashChange
- Follow the original API's as much as possible
- Support for traditional anchors *- yet to complete*
- Support as many javascript frameworks as possible via adapters.

Licensed under the New BSD License, Copyright 2011 Benjamin Arthur Lupton <contact@balupton.com>

## Usage

	(function(window,undefined){

		var History = window.History;

		History.Adapter.bind(window,'popstate',functon(){
			var State = History.getState();
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

### Unsupported

- Dojo

## Browsers

### Supported

- Chrome 8
- Opera 10, 11
- Safari 5
- Firefox 4 Beta 9
- IE 6
- Firefox 3

### Yet to Test

- IE 7,8,9
