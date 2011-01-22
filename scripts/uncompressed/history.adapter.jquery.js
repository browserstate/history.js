// History.js jQuery Adapter
// New-BSD License, Copyright 2011 Benjamin Arthur Lupton <contact@balupton.com>

(function($,window,undefined){

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
		 * History.Adapter.getBrowserFlag()
		 * @return [msie,webkit,mozilla,opera]
		 */
		getBrowserFlag: function(){
			var
				flags = ['msie','webkit','mozilla','opera'],
				result = null;

			$.each(flags,function(i,flag){
				if ( $.browser[flag]||false ) {
					result = flag;
					return false;
				}
			});

			return result;
		},

		/**
		 * History.Adapter.getBrowserMajorVersion()
		 * @return {integer}
		 */
		getBrowserMajorVersion: function(){
			var
				version = $.browser.version,
				result = parseInt(version,10);

			return result;
		},

		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {element} el
		 * @param {string} event
		 * @param {Function} callback
		 * @return {element}
		 */
		bind: function(el,event,callback){
			return $(el).bind(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {element} el
		 * @param {string} event
		 * @param {object} data
		 * @return {element}
		 */
		trigger: function(el,event,data){
			return $(el).trigger(event,data);
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {Function} callback
		 * @return {true}
		 */
		onDomLoad: function(callback) {
			jQuery(callback);
		}

	};

	// Check Load Status
	if ( typeof History.init !== 'undefined' ) {
		// History.js loaded faster than the Adapter, Fire init
		History.init();
	}

})(jQuery,window);
