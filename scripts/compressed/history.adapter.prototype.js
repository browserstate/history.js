/**
 * History.js Prototype.js Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * Prototype.js currently does not support the following:
 * - The ability to easily work with custom events
 * - The ability to send data through event triggers
 * - The ability trigger events on the window element in IE6,7,8
 */

// Closure
(function(window,undefined){
	"use strict";

	// Localise Globals
	var
		History = window.History = window.History||{},
		Prototype = window.Prototype,
		Element = window.Element,
		Event = window.Event,
		$ = window.$;

	// Check Existence
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been loaded...');
	}

	// Prototype does not support event binding to the window element in IE6-8
	if ( typeof window.fireEvent === 'undefined' && typeof window.dispatchEvent === 'undefined' ) {
		History.enable = false;
		return;
	}

	/**
	 * Bind and Trigger custom and native events in Prototype
	 * @author Juriy Zaytsev (kangax)
	 * @author Benjamin Arthur Lupton <contact@balupton.com>
	 * @copyright MIT license <http://creativecommons.org/licenses/MIT/>
	 */
	(function(){
		// Prepare
		var
			eventMatchers = {
				'HTMLEvents': /^(?:load|unload|abort|error|select|hashchange|popstate|change|submit|reset|focus|blur|resize|scroll)$/,
				'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
			},
			defaultOptions = {
				pointerX: 0,
				pointerY: 0,
				button: 0,
				ctrlKey: false,
				altKey: false,
				shiftKey: false,
				metaKey: false,
				bubbles: true,
				cancelable: true
			};

		// Check for Native Event
		Event.hasNativeEvent = function(element, eventName) {
			// Prepare
			var
				eventType = null, result, name;

			// Fetch
			element = $(element);

			// Cycle
			for (name in eventMatchers) {
				if ( eventMatchers[name].test(eventName) ) {
					eventType = name;
					break;
				}
			}

			// Evaluate
			result = eventType ? true : false;

			// Return result
			return result;
		};

		// Bind a Native or Custom Event
		Event.bind = function(element, eventName, eventHandler) {
			// Prepare
			element = $(element);

			// Native Event?
			if ( Element.hasNativeEvent(element,eventName) ) {
				return Element.observe(element,eventName,eventHandler);
			}

			// Custom Event?
			else {
				return Element.observe(element,'custom:'+eventName,eventHandler);
			}

			// Return element
			return element;
		};

		// Trigger
		Event.trigger = function(element, eventName) {
			// Prepare
			var
				options = Object.extend(defaultOptions, arguments[2] || { }),
				oEvent, eventType = null, name;

			// Fetch
			element = $(element);

			// Check for Native Event
			for (name in eventMatchers) {
				if (eventMatchers[name].test(eventName)) { eventType = name; break; }
			}

			// Custom Event?
			if ( !eventType ) {
				return Element.fire(element,'custom:'+eventName);
			}

			// Create Event
			if ( document.createEvent ) {
				// Firefox + Others
				oEvent = document.createEvent(eventType);

				// Normal Event?
				if ( eventType === 'HTMLEvents' ) {
					oEvent.initEvent(eventName, options.bubbles, options.cancelable);
				}
				// Mouse Event?
				else if ( eventType ) {
					oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
						options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
						options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
				}
			}
			else if ( document.createEventObject ) {
        // Internet Explorer
				options.clientX = options.pointerX;
				options.clientY = options.pointerY;
				oEvent = Object.extend(document.createEventObject(), options);
			}

			// Fire Event
			if ( element.fireEvent ) {
				element.fireEvent('on'+eventName,oEvent);
			}
			else if ( element.dispatchEvent ) {
				element.dispatchEvent(oEvent);
			}
			else {
				throw new Error('Cannot dispatch the event');
			}

			// Return
			return element;
		};

		// Amend Element Prototype
		Element.addMethods({
			simulate: Event.trigger,
			trigger: Event.trigger,
			bind: Event.bind,
			hasNativeEvent: Event.hasNativeEvent
		});
	})();

	// Add the Adapter
	History.Adapter = {

		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {function} callback
		 * @return {void}
		 */
		bind: function(el,event,callback){
			Element.bind(el,event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @return {void}
		 */
		trigger: function(el,event){
			Element.trigger(el,event);
		},

		/**
		 * History.Adapter.extractEventData(key,event,extra)
		 * @param {string} key - key for the event data to extract
		 * @param {string} event - custom and standard events
		 * @return {mixed}
		 */
		extractEventData: function(key,event){
			// Prototype.js Native
			var result = (event && event[key]) || undefined;

			// Return
			return result;
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {function} callback
		 * @return {void}
		 */
		onDomLoad: function(callback) {
			Event.observe(window.document, 'dom:loaded', callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);
