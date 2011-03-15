/**
 * History.js YUI Adapter [NOT WORKING]
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
	// Localise Globals
	var
		History = window.History = window.History||{},
		YUI = window.YUI;

	// Check Existence
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been loaded...');
	}

	// Add the Adapter
	History.Adapter = {
		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {Element|Selector} el
		 * @param {String} event - custom and standard events
		 * @param {Function} callback
		 * @return {element}
		 */
		bind: function(el,event,callback){
			YUI().use('node-base', function(Y){
				Y.one(el).on(event,callback);
			});
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|Selector} el
		 * @param {String} event - custom and standard events
		 * @return {element}
		 */
		trigger: function(el,event){
			YUI().use('node-event-simulate', function(Y){
				Y.one(el).simulate(event);
			});
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {Function} callback
		 * @return {true}
		 */
		onDomLoad: function(callback) {
			YUI().use('event', function(Y){
				Y.on('domready', callback);
			});
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);
