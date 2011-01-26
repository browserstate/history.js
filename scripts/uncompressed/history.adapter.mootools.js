// History.js MooTools Adapter
// New-BSD License, Copyright 2011 Benjamin Arthur Lupton <contact@balupton.com>

(function(MooTools,window,undefined){

	// --------------------------------------------------------------------------
	// Initialise

	// History Object
	window.History = window.History||{};

	// Localise Globals
	var
		History = window.History||{},
		history = window.history;

	// Check Existence of Adapter
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been emulated...');
	}

	// Make MooTools aware of History.js Events
	Object.append(Element.NativeEvents, {'popstate': 2, 'hashchange': 2});

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
			var El = typeof el === 'string' ? document.id(el) : el;
			return El.addEvent(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {element} el
		 * @param {string} event
		 * @return {element}
		 */
		trigger: function(el,event){
			var El = typeof el === 'string' ? document.id(el) : el;
			return El.fireEvent(event);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Function} callback
		 * @return {true}
		 */
		onDomLoad: function(callback) {
			window.addEvent('domready',callback);
		}
	};

	// Check Load Status
	if ( typeof History.init !== 'undefined' ) {
		// History.js loaded faster than the Adapter, Fire init
		History.init();
	}

})(MooTools,window);
