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
			event = 'widget:'+event;
			return Element.observe(el,event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {element} el
		 * @param {string} event
		 * @return {element}
		 */
		trigger: function(el,event){
			event = 'widget:'+event;
			return Element.fire(el,event);
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
