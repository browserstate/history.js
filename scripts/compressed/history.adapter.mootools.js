/*
 New BSD License <http://creativecommons.org/licenses/BSD/>
*/
(function(f,c){c.History=c.History||{};var b=c.History||{};if(typeof b.Adapter!=="undefined")throw Error("History.js Adapter has already been loaded...");Object.append(Element.NativeEvents,{popstate:2,hashchange:2});b.Adapter={bind:function(a,d,e){return(typeof a==="string"?document.id(a):a).addEvent(d,e)},trigger:function(a,d){return(typeof a==="string"?document.id(a):a).fireEvent(d)},onDomLoad:function(a){c.addEvent("domready",a)}};typeof b.initHtml5!=="undefined"&&b.initHtml5();typeof b.initHtml4!==
"undefined"&&b.initHtml4()})(MooTools,window);
