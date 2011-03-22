/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */// Closure
(function(a,b){var c=a.History=a.History||{},d=a.MooTools;if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");Object.append(Element.NativeEvents,{popstate:2,hashchange:2}),c.Adapter={bind:function(a,b,c){var d=typeof a=="string"?document.id(a):a;d.addEvent(b,c)},trigger:function(a,b){var c=typeof a=="string"?document.id(a):a;c.fireEvent(b)},onDomLoad:function(b){a.addEvent("domready",b)}},typeof c.init!="undefined"&&c.init()})(window)