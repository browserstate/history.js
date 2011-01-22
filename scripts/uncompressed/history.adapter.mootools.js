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
		 * History.Adapter.getBrowserFlag()
		 * @return [msie,webkit,mozilla,opera]
		 */
		getBrowserFlag: function(){
			var
				flags_out = ['msie','mozilla','webkit','webkit','opera'],
				flags_in = ['ie','firefox','safari','chrome','opera'],
				result = null;

			flags_in.each(function(i,flag){
				if ( Browser[flag]||false ) {
					result = flags_out[i];
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
			var version = null;
			switch ( true ) {
				case Browser.ie6:
					version = 6;
					break;
				case Browser.ie7:
					version = 7;
					break;
				case Browser.ie8:
					version = 8;
					break;
				case Browser.ie:
					version = 9;
					break;
				case Browser.firefox2:
					version = 2;
					break;
				case Browser.firefox3:
					version = 3;
					break;
				case Browser.firefox:
					version = 4;
					break;
				case Browser.safari3:
					version = 3;
					break;
				case Browser.safari4:
					version = 4;
					break;
				case Browser.safari:
					version = 5;
					break;
				case Browser.chrome:
					version = 8;
					break;
				case Browser.opera:
					version = 10;
					break
			}

			return version;
		},

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
