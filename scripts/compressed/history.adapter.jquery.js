/**
 * History.js jQuery Adapter
 * @author Benjamin Arthur Lupton
 * @copyright 2010-2011 Benjamin Arthur Lupton
 * @license New BSD License - http://creativecommons.org/licenses/BSD/
 */(function(a,b,c){b.History=b.History||{};var d=b.History||{},e=b.history;if(typeof d.Adapter!=="undefined")throw new Error("History.js Adapter has already been loaded...");d.Adapter={bind:function(b,c,d){return a(b).bind(c,d)},trigger:function(b,c){return a(b).trigger(c)},onDomLoad:function(a){jQuery(a)}},typeof d.initHtml5!=="undefined"&&d.initHtml5(),typeof d.initHtml4!=="undefined"&&d.initHtml4()})(jQuery,window)