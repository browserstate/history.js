/**
 Created by Daniel Qian(chanjarster@gmail.com)

 Add two events to history.js: navigation-backward, navigation-forward. Currently only support jQuery Adapter.

 Examples:

 History.Adapter.bind(window, 'navigation-backward', function(event, prevState, currentState) {
   // code when navigation backward happends
 });

 History.Adapter.bind(window, 'navigation-forward', function(event, prevState, currentState) {
   // code when navigation forward happends
 });

 */
(function (window, undefined) {
    'use strict';

    if (window.History == undefined) {
        throw new Error('History.js is needed');
    }

    if (window.HistoryEnhance != undefined) {
        // won't initialize HistoryEnhance more than once.
        return;
    }
    var History = window.History;
    var HistoryEnhance = window.HistoryEnhance = window.HistoryEnhance || {};


    // previous history state
    var prevState = null;

    // navigation backwarded state stack, if navigation backward happens, push the backwarded state into it
    var backwardNavigationStack = [];

    var _oldPushState = History.pushState;
    var _oldReplaceState = History.replaceState;

    History.pushState = function (data, title, url, queue, mockpopstate) {
        _oldPushState(data, title, url, queue, mockpopstate);
        // when popstate triggered the current state is already changed,
        // so at that time, current state become previous state
        if(mockpopstate != true) {
            prevState = History.getState();
            //alert(JSON.stringify(prevState));
        }
    };

    History.replaceState = function (data, title, url, queue) {
        _oldReplaceState(data, title, url, queue);
        // when popstate triggered the current state is already changed,
        // so at that time, current state become previous state
        prevState = History.getState();
    };

    History.Adapter.bind(window, 'popstate', function (event) {
        var _prevState = prevState;
        if (_prevState == null) {
            // safari will trigger popstate on first page load
            return;
        }
        
        var currentState = prevState = History.getState();

        var backward = true;
        if (backwardNavigationStack.length > 0) {
            // compare with the last backwarded state, if the ids equals,
            // the operation is navigation forward, otherwise is navigation backward
            var lastBackwardState = backwardNavigationStack[backwardNavigationStack.length - 1];
            if (lastBackwardState.id == currentState.id) {
                backward = false;
            }
        }

        if (backward) {
            backwardNavigationStack.push(_prevState);
            History.Adapter.trigger(window, 'navigation-backward', [_prevState, currentState])
        } else {
            backwardNavigationStack.pop();
            History.Adapter.trigger(window, 'navigation-forward', [_prevState, currentState]);
        }
    });
})(window);

