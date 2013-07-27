# The DocPad Configuration File
# http://docpad.org/docs/config

docpadConfig =

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:

		# Specify some site properties
		site:
			# The production url of our website
			url: "http://historyjs.net"

			# The default title of our website
			title: "History.js"

			# The website description (for SEO)
			description: """
				History.js gracefully supports the HTML5 History/State APIs (pushState, replaceState, onPopState) in all browsers. Including continued support for data, titles, replaceState. Supports jQuery, MooTools and Prototype.  For HTML5 browsers this means that you can modify the URL directly, without needing to use hashes anymore. For HTML4 browsers it will revert back to using the old onhashchange functionality.
				"""

			# The website keywords (for SEO) separated by commas
			keywords: """
				history.js, historyjs, stateful, web apps, web applications, single page, ajax, pushtate, replacestate, hashchange, fragement identifier, html5, history api
				"""

			# The website's styles
			styles: []

			# The website's scripts
			scripts: []


		# -----------------------------
		# Helper Functions

		# Get the prepared site/document title
		# Often we would like to specify particular formatting to our page's title
		# we can apply that formatting here
		getPreparedTitle: ->
			# if we have a document title, then we should use that and suffix the site's title onto it
			if @document.title
				"#{@document.title} | #{@site.title}"
			# if our document does not have it's own title, then we should just use the site's title
			else
				@site.title

		# Get the prepared site/document description
		getPreparedDescription: ->
			# if we have a document description, then we should use that, otherwise use the site's description
			@document.description or @site.description

		# Get the prepared site/document keywords
		getPreparedKeywords: ->
			# Merge the document keywords with the site keywords
			@site.keywords.concat(@document.keywords or []).join(', ')


# Export our DocPad Configuration
module.exports = docpadConfig