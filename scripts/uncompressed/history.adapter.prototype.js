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
		 * History.Adapter.getBrowserFlag()
		 * @return [msie,webkit,mozilla,opera]
		 */
		getBrowserFlag: function(){
			var
				flags_out = ['msie','webkit','webkit','mozilla','opera'],
				flags_in = ['IE','Opera','WebKit','MobileSafari','Gecko'],
				result = null;

			flags_in.each(function(i,flag){
				if ( Prototype.Browser[flag]||false ) {
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
			var
				version = parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE")+5)),
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
			event = 'widget:'+event;
			console.log('bind:',el,event,callback);
			return Element.observe(el,event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {element} el
		 * @param {string} event
		 * @param {object} data
		 * @return {element}
		 */
		trigger: function(el,event,data){
			event = 'widget:'+event;
			console.log('trigger:',el,event,data);
			return Element.fire(el,event,data);
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
