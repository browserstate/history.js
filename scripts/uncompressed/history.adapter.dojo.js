/**
 * History.js Dojo Adapter
 * @author Lakin Wecker <lakin@structuredabstraction.com>
 * @copyright 2012-2012 Lakin Wecker <lakin@structuredabstraction.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

require(["dojo/on", "dojo/ready", "dojo/_base/lang"], function(on,ready, lang) {
	"use strict";

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
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {function} callback
		 * @return {void}
		 */
		bind: function(el,event,callback){
			on(el,event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|string} el
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {void}
		 */
		trigger: function(el,event,extra){
			extra = extra || {};
			lang.mixin(extra, {
				bubbles: true,
				cancelable: true
			});
			// hack for dojo 1.8 which assumes that target has an ownerDocument propery
			if (el === window)
				el.ownerDocument = el.document;

			on.emit(el,event,extra);

			if (el === window)
				delete el.ownerDocument;
		},

		/**
		 * History.Adapter.extractEventData(key,event,extra)
		 * @param {string} key - key for the event data to extract
		 * @param {string} event - custom and standard events
		 * @param {Object=} extra - a object of extra event data (optional)
		 * @return {mixed}
		 */
		extractEventData: function(key,event,extra){
			// dojo Native then dojo Custom
			var result = (event && event[key]) || (extra && extra[key]) || undefined;

			// Return
			return result;
		},

		/**
		 * History.Adapter.onDomLoad(callback)
		 * @param {function} callback
		 * @return {void}
		 */
		onDomLoad: function(callback) {
			ready(callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

});
