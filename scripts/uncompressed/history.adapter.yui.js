/**
 * History.js YUI Adapter [NOT WORKING]
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

/**
 * YUI requires the following features in order to be suitable for History.js:
 * - The ability to bind and trigger custom events such as 'statechange'
 */
alert('The History.js YUI Adapter is not yet finished.');

window.YUI().use('node-base node-event-simulate event', function(Y){
	// Localise Globals
	var
		History = window.History = window.History||{};

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
			// node-base
			Y.one(el).on(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|Selector} el
		 * @param {String} event - custom and standard events
		 * @return {element}
		 */
		trigger: function(el,event){
			// node-event-simulate
			Y.one(el).simulate(event);
		},

		/**
		 * History.Adapter.trigger(el,event,data)
		 * @param {Function} callback
		 * @return {true}
		 */
		onDomLoad: function(callback) {
			// event
			Y.on('domready', callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);
