# Requires
buildr = require 'buildr'

# Configs
configs =
	# Standard
	standard:
		# Paths
		srcPath: __dirname+'/scripts/uncompressed'
		outPath: __dirname+'/scripts/compressed'

		# Checking
		checkScripts: true
		jshintOptions:
			browser: true
			laxbreak: true
			boss: true
			undef: true
			onevar: true
			strict: true
			noarg: true

		# Compression (without outPath only the generated bundle files are compressed)
		compressScripts: true # Array or true or false

	'json2,native,html4,history.js':
		# Paths
		srcPath: __dirname+'/scripts/uncompressed'

		# Compression (without outPath only the generated bundle files are compressed)
		compressScripts: true # Array or true or false

		# Order
		scriptsOrder: [
			'json2.js'
			'history.adapter.native.js'
			'history.html4.js'
			'history.js'
		]

		# Bundling
		bundleScriptPath: __dirname+'/scripts/bundled/json2,native,html4,history.js'

	'native,history.js':
		# Paths
		srcPath: __dirname+'/scripts/uncompressed'

		# Compression (without outPath only the generated bundle files are compressed)
		compressScripts: true # Array or true or false

		# Order
		scriptsOrder: [
			'json2.js'
			'history.adapter.native.js'
			'history.html4.js'
			'history.js'
		]

		# Bundling
		bundleScriptPath: __dirname+'/scripts/bundled/native,history.js'

# Handle
for own name, config of configs
	# Defaults
	config.processHandler ?= (err) ->
		if err
			console.log err
		else
			console.log "Building #{name} completed\n"

	# Create
	buildrInstance = buildr.createInstance config

	# Process
	buildrInstance.process()
