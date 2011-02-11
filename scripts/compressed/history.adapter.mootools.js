/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */(function(a,b,c){b.History=b.History||{};var d=b.History||{},e=b.history;if(typeof d.Adapter!=="undefined")throw new Error("History.js Adapter has already been loaded...");Object.append(Element.NativeEvents,{popstate:2,hashchange:2}),d.Adapter={bind:function(a,b,c){var d=typeof a==="string"?document.id(a):a;return d.addEvent(b,c)},trigger:function(a,b){var c=typeof a==="string"?document.id(a):a;return c.fireEvent(b)},onDomLoad:function(a){b.addEvent("domready",a)}},typeof d.initHtml5!=="undefined"&&d.initHtml5(),typeof d.initHtml4!=="undefined"&&d.initHtml4()})(MooTools,window)