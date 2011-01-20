(function($,window,undefined){

	// Prepare Globals
	var
		History = window.History,
		debug = true;

	// DomReady
	$(function(){

		// Add State Functionality
		$('#menu a').bind('click',function(event){
			if(debug)console.info('Demo.click',this,arguments);
			// Prepare
			var
				$this = $(this),
				title = $this.attr('title') || $this.text(),
				href = $this.attr('href'),
				data = {
					'title': title,
					'href': href
				};

			// Update State
			History.pushStateAndTrigger(data, title, href);

			// Prevent link follow through
			event.preventDefault();
			return false;
		});

		// Handle State Functionality
		$(window).bind('popstate',function(event,extra){
			if(debug)console.info('Demo.popstate',this,arguments);

			// Prepare
			var
				state = History.getState(),
				data = state.data;

			// Check for initial popstate
			if ( typeof data === 'undefined' ) {
				return false;
			}

			// Fetch URL
			var
				url = data.href;

			// Perform AJAX Request
			$.get(url, function(data){
				var $newContent = $(data).find('#content');
				$('#content').html($newContent.html());
			});

		});

	}); // DomReady

})(jQuery,window);

