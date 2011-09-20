(function(a,b){"use strict";var c=a.document,d=a.setTimeout||d,e=a.clearTimeout||e,f=a.setInterval||f,g=a.History=a.History||{};if(typeof g.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");g.initHtml4=function(){if(typeof g.initHtml4.initialized!="undefined")return!1;g.initHtml4.initialized=!0,g.enabled=!0,g.savedHashes=[],g.isLastHash=function(a){var b=g.getHashByIndex(),c;c=a===b;return c},g.saveHash=function(a){if(g.isLastHash(a))return!1;g.savedHashes.push(a);return!0},g.getHashByIndex=function(a){var b=null;typeof a=="undefined"?b=g.savedHashes[g.savedHashes.length-1]:a<0?b=g.savedHashes[g.savedHashes.length+a]:b=g.savedHashes[a];return b},g.discardedHashes={},g.discardedStates={},g.discardState=function(a,b,c){var d=g.getHashByState(a),e;e={discardedState:a,backState:c,forwardState:b},g.discardedStates[d]=e},g.discardHash=function(a,b,c){var d={discardedHash:a,backState:c,forwardState:b};g.discardedHashes[a]=d},g.discardedState=function(a){var b=g.getHashByState(a),c;c=g.discardedStates[b]||!1;return c},g.discardedHash=function(a){var b=g.discardedHashes[a]||!1;return b},g.recycleState=function(a){var b=g.getHashByState(a);g.discardedState(a)&&delete g.discardedStates[b]},g.emulated.hashChange&&(g.hashChangeInit=function(){g.checkerFunction=null;var b="",d,e,h,i;g.isInternetExplorer()?(d="historyjs-iframe",e=c.createElement("iframe"),e.setAttribute("id",d),e.style.display="none",c.body.appendChild(e),e.contentWindow.document.open(),e.contentWindow.document.close(),h="",i=!1,g.checkerFunction=function(){var c,d;if(i)return!1;i=!0,c=g.getHash()||"",d=g.unescapeHash(e.contentWindow.document.location.hash)||"",c!==b?(b=c,d!==c&&(h=d=c,e.contentWindow.document.open(),e.contentWindow.document.close(),e.contentWindow.document.location.hash=g.escapeHash(c)),g.Adapter.trigger(a,"hashchange")):d!==h&&(h=d,g.setHash(d,!1)),i=!1;return!0}):g.checkerFunction=function(){var c=g.getHash();c!==b&&(b=c,g.Adapter.trigger(a,"hashchange"));return!0},g.intervalList.push(f(g.checkerFunction,g.options.hashChangeInterval));return!0},g.Adapter.onDomLoad(g.hashChangeInit)),g.emulated.pushState&&(g.onHashChange=function(b){var d=b&&b.newURL||c.location.href,e=g.getHashByUrl(d),f=null,h=null,i=null,j;if(g.isLastHash(e)){g.busy(!1);return!1}g.doubleCheckComplete(),g.saveHash(e);if(e&&g.isTraditionalAnchor(e)){g.Adapter.trigger(a,"anchorchange"),g.busy(!1);return!1}f=g.extractState(g.getFullUrl(e||c.location.href,!1),!0);if(g.isLastSavedState(f)){g.busy(!1);return!1}h=g.getHashByState(f),j=g.discardedState(f);if(j){g.getHashByIndex(-2)===g.getHashByState(j.forwardState)?g.back(!1):g.forward(!1);return!1}g.busy(!0),g.addState(f.data,f.title,f.url);return!0},g.Adapter.bind(a,"hashchange",g.onHashChange),g.addState=function(b,d,e,f){var h=g.createStateObject(b,d,e),i=g.getHashByState(h),j=g.getState(!1),k=g.getHashByState(j),l=g.getHash(),m;f==="replaceState"&&(m=g.getStateByIndex(-2),g.discardState(j,h,m)),g.storeState(h),g.expectedStateId=h.id,g.recycleState(h),g.setTitle(h);if(i===k)g.debug("History.pushState: no change",i),g.temp.same=!0;else{if(i!==l&&i!==g.getShortUrl(c.location.href)){g.debug("History.pushState: update hash",i,l),g.setHash(i,!1);return!1}g.saveState(h);if(g.temp.ignore){--g.temp.ignore,g.busy(!1);return!1}g.temp.same=!1}g.Adapter.trigger(a,"statechange"),g.busy(!1);return!0},g.pushState=function(a,b,c,d){if(d!==!1&&g.busy()){g.pushQueue({scope:g,callback:g.pushState,args:arguments,queue:d});return!1}g.busy(!0),g.temp.internal=d!==!1?"pushState":!1;return g.addState(a,b,c,"pushState")},g.replaceState=function(a,b,c,d){if(g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(d!==!1&&g.busy()){g.pushQueue({scope:g,callback:g.replaceState,args:arguments,queue:d});return!1}g.busy(!0),g.temp.internal=d!==!1?"replaceState":!1;return g.addState(a,b,c,"replaceState")},g.getHash()&&!g.emulated.hashChange&&g.Adapter.onDomLoad(function(){g.Adapter.trigger(a,"hashchange")}))},g.init()})(window)