/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
	// Localise Globals
	var
		History = window.History = window.History||{},
		MooTools = window.MooTools;

	// Check Existence
	if ( typeof History.Adapter !== 'undefined' ) {
		throw new Error('History.js Adapter has already been loaded...');
	}

	// Make MooTools aware of History.js Events
	Object.append(Element.NativeEvents,{
		'popstate':2,
		'hashchange':2
	});

	// Add the Adapter
	History.Adapter = {
		/**
		 * History.Adapter.bind(el,event,callback)
		 * @param {Element|Selector} el
		 * @param {String} event - custom and standard events
		 * @param {Function} callback
		 * @return
		 */
		bind: function(el,event,callback){
			var El = typeof el === 'string' ? document.id(el) : el;
			El.addEvent(event,callback);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Element|Selector} el
		 * @param {String} event - custom and standard events
		 * @return
		 */
		trigger: function(el,event){
			var El = typeof el === 'string' ? document.id(el) : el;
			El.fireEvent(event);
		},

		/**
		 * History.Adapter.trigger(el,event)
		 * @param {Function} callback
		 * @return
		 */
		onDomLoad: function(callback) {
			window.addEvent('domready',callback);
		}
	};

	// Try and Initialise History
	if ( typeof History.init !== 'undefined' ) {
		History.init();
	}

})(window);
