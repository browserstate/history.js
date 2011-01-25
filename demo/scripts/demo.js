(function($,window,undefined){

	// Prepare Globals
	var History = window.History;

	// DomReady
	$(function(){

		// Add State Functionality
		$('#menu a').bind('click',function(event){
			// Prepare
			var
				$this = $(this),
				title = $this.attr('title') || $this.text(),
				href = $this.attr('href'),
				data = {};

			// Update State
			History.pushState(data, title, href);

			// Prevent link follow through
			event.preventDefault();
			return false;
		});

	});

	// Handle State Functionality
	// We use History.Adapter.bind here, instead of $(window).bind as we may be running a History.js Adapter that isn't jQuery
	History.Adapter.bind(window,'statechange',function(event,extra){
		// Prepare
		var
			state = History.getState(),
			data = state.data,
			url = state.url;

		History.debug('Demo.popstate',this,arguments, state.title, state.url, data.href);

		// Check for initial popstate
		if ( typeof data === 'undefined' ) {
			History.log('Demo.popstate: nodata');
			return false;
		}

		// Perform AJAX Request
		$.get(state.url, function(data){
			var $newContent = $(data).find('#content');
			$('#content').html($newContent.html());
		});

	});

})(jQuery,window);

