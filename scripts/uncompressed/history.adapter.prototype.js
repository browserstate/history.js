// History.js Prototype Adapter
// New-BSD License, Copyright 2011 Benjamin Arthur Lupton <contact@balupton.com>

(function(Prototype,window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// History Object
	window.History = window.History||{};

	// Localise Globals
	var
		History = window.History,
		history = window.history;

	// Check Existence of Adapter
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been emulated...');
	}

	/**
	 * Bind and Trigger custom and native events in Prototype
	 * @author Juriy Zaytsev (kangax)
	 * @author Benjamin Lupton (balupton)
	 * @copyright MIT license
	 **/
	(function(){

		var eventMatchers = {
			'HTMLEvents': /^(?:load|unload|abort|error|select|hashchange|popstate|change|submit|reset|focus|blur|resize|scroll)$/,
			'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/
		};
		var defaultOptions = {
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

		Event.hasNativeEvent = function(element, eventName) {
			var eventType = null;
			element = $(element);
			for (var name in eventMatchers) {
				if ( eventMatchers[name].test(eventName) ) {
					eventType = name;
					break;
				}
			}
			return eventType ? true : false;
		};

		Event.bind = function(element, eventName, eventHandler) {
			element = $(element);

			if ( Element.hasNativeEvent(element,eventName) ) {
				return Element.observe(element,eventName,eventHandler);
			}
			else {
				return Element.observe(element,'custom:'+eventName,eventHandler);
			}
		};

		Event.simulate = function(element, eventName) {
			var options = Object.extend(defaultOptions, arguments[2] || { });
			var oEvent, eventType = null;

			element = $(element);

			for (var name in eventMatchers) {
				if (eventMatchers[name].test(eventName)) { eventType = name; break; }
			}

			if ( !eventType ) {
				return Element.fire(element,'custom:'+eventName);
			}

			if (document.createEvent) {
				oEvent = document.createEvent(eventType);
				if (eventType == 'HTMLEvents') {
					oEvent.initEvent(eventName, options.bubbles, options.cancelable);
				}
				else {
					oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
						options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
						options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
				}
				element.dispatchEvent(oEvent);
			}
			else {
				options.clientX = options.pointerX;
				options.clientY = options.pointerY;
				oEvent = Object.extend(document.createEventObject(), options);
				element.fireEvent('on' + eventName, oEvent);
			}
			return element;
		};

		Element.addMethods({
			simulate: Event.simulate,
			trigger: Event.simulate,
			bind: Event.bind,
			hasNativeEvent: Event.hasNativeEvent
		});
	})();

	// Add the Adapter
	History.Adapter = {

		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {element} el
		 * @param {string} event
		 * @param {Function} callback
		 * @return {element}
		 */
		bind: function(el,event,callback){
			Element.bind(el,event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {element} el
		 * @param {string} event
		 * @return {element}
		 */
		trigger: function(el,event){
			Element.trigger(el,event);
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {Function} callback
		 * @return {true}
		 */
		onDomLoad: function(callback) {
			Event.observe(window, 'load', callback);
		}
	};

	// Check Load Status
	if ( typeof History.init !== 'undefined' ) {
		// History.js loaded faster than the Adapter, Fire init
		History.init();
	}

})(Prototype,window);
