# Requires
buildr = require 'buildr'
util = require 'util'

# Options
options =
	watch: false
	compress: true

# Configs
configs =
	standard:
		# Options
		name: 'standard'
		watch: options.watch

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
		compressScripts: options.compress # Array or true or false
	
	other: [

		# -----------------------------
		# JQUERY

		{
			# Options
			name: 'html4+html5+jquery'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.jquery.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html4+html5/jquery.history.js'
		}
		{
			# Options
			name: 'html5+jquery'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.jquery.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html5/jquery.history.js'
		}


		# -----------------------------
		# MOOTOOLS

		{
			# Options
			name: 'html4+html5+mootools'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.mootools.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html4+html5/mootools.history.js'
		}
		{
			# Options
			name: 'html5+mootools'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.mootools.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html5/mootools.history.js'
		}


		# -----------------------------
		# NATIVE

		{
			# Options
			name: 'html4+html5+native'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.native.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html4+html5/native.history.js'
		}
		{
			# Options
			name: 'html5+native'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.native.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html5/native.history.js'
		}


		# -----------------------------
		# RIGHT.JS

		{
			# Options
			name: 'html4+html5+right'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.right.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html4+html5/right.history.js'
		}
		{
			# Options
			name: 'html5+right'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.right.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html5/right.history.js'
		}


		# -----------------------------
		# ZEPTO

		{
			# Options
			name: 'html4+html5+zepto'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.zepto.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html4+html5/zepto.history.js'
		}
		{
			# Options
			name: 'html5+zepto'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.zepto.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled/html5/zepto.history.js'
		}
	]

# Standard
standardConfig = configs.standard
standardConfig.successHandler = ->
	for config in configs.other
		buildrInstance = buildr.createInstance config
		buildrInstance.process()

# Process
standardBuildr = buildr.createInstance configs.standard
standardBuildr.process()
