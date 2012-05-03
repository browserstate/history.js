/**
 * History.js Prototype Adapter
 * @author Ben Cates <ben.cates@gmail.com>
 * @copyright 2010-2011 Benjamin C Cates <ben.cates@gmail.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */

// Closure
(function(window,undefined){
    "use strict";

    // Localise Globals
    var History = window.History = window.History||{},
        Event = window.Event;
    
    // Check Existence
    if (!Object.isUndefined(History.Adapter)) {
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
        bind: function(el, eventName, callback){
            // Proxy native events to a namespaced custom event
            Event.observe(el, eventName, function(event) {
                Event.fire(el, 'historyjs:' + eventName, event);
            });
            Event.observe(el, 'historyjs:' + eventName, callback);
        },
        
        /**
         * History.Adapter.trigger(el,event)
         * @param {Element|string} el
         * @param {string} event - custom and standard events
         * @return {void}
         */
        trigger: function(element, eventName) {
            // Fire a namespaced event
            Event.fire(element, 'historyjs:' + eventName);
        },
        
        /**
         * History.Adapter.extractEventData(key,event,extra)
         * @param {string} key - key for the event data to extract
         * @param {string} event - custom and standard events
         * @return {mixed}
         */
        extractEventData: function(key, event) {
            // Check the proxied event, if there is one, then the actual event
            return (event && event.memo && event.memo[key]) || (event && event[key]) || undefined;
        },
        
        /**
         * History.Adapter.onDomLoad(callback)
         * @param {function} callback
         * @return {void}
         */
        onDomLoad: function(callback) {
            Event.observe(document, 'dom:loaded', callback);
        }
    };
    
    // Try and Initialise History
    if (Object.isFunction(History.init)) {
        History.init();
    }

})(window);
