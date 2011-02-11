/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton
 * @copyright 2010-2011 Benjamin Arthur Lupton
 * @license New BSD License - http://creativecommons.org/licenses/BSD/
 */

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
		throw new Error('History.js Adapter has already been loaded...');
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
			return $(el).bind(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {element} el
		 * @param {string} event
		 * @return {element}
		 */
		trigger: function(el,event){
			return $(el).trigger(event);
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

	// Check Load Status of HTML5 Support
	if ( typeof History.initHtml5 !== 'undefined' ) {
		History.initHtml5();
	}

	// Check Load Status of HTML4 Support
	if ( typeof History.initHtml4 !== 'undefined' ) {
		History.initHtml4();
	}

})(jQuery,window);
