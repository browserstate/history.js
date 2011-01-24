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
		 * History.Adapter.trigger(el,event,data)
		 * @param {element} el
		 * @param {string} event
		 * @param {object} data
		 * @return {element}
		 */
		trigger: function(el,event,data){
			var El = typeof el === 'string' ? document.id(el) : el;
			return El.fireEvent(event,data||{});
		},

		/**
		 * History.Adapter.trigger(el,event,data)
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
