/*
 New BSD License - http://creativecommons.org/licenses/BSD/
*/
(function(e,c){c.History=c.History||{};var a=c.History||{};if(typeof a.Adapter!=="undefined")throw Error("History.js Adapter has already been loaded...");a.Adapter={bind:function(b,d,f){return e(b).bind(d,f)},trigger:function(b,d){return e(b).trigger(d)},onDomLoad:function(b){jQuery(b)}};typeof a.initHtml5!=="undefined"&&a.initHtml5();typeof a.initHtml4!=="undefined"&&a.initHtml4()})(jQuery,window);
