/**
 * History.js YUI Adapter [NOT WORKING]
 * @author Benjamin Arthur Lupton <contact@balupton.com>
 * @copyright 2010-2011 Benjamin Arthur Lupton <contact@balupton.com>
 * @license New BSD License <http://creativecommons.org/licenses/BSD/>
 */// Closure
(function(a,b){var c=a.History=a.History||{},d=a.YUI;if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");c.Adapter={bind:function(a,b,c){d().use("node-base",function(d){d.one(a).on(b,c)})},trigger:function(a,b){d().use("node-event-simulate",function(c){c.one(a).simulate(b)})},onDomLoad:function(a){d().use("event",function(b){b.on("domready",a)})}},typeof c.init!="undefined"&&c.init()})(window)