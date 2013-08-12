# Requires
buildr = require 'buildr'
util = require 'util'

# Options
options =
	watch: false
	compress: false

# Configs
configs =
	standard:
		# Options
		name: 'standard'
		watch: options.watch

		# Paths
		srcPath: __dirname+'/scripts/uncompressed'

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
		# Dojo Toolkit

		{
			# Options
			name: 'html4+html5+dojo'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.dojo.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/dojo.history.js'
		}
		{
			# Options
			name: 'html5+dojo'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.dojo.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/dojo.history.js'
		}
		
		# -----------------------------
		# ExtJS

		{
			# Options
			name: 'html4+html5+extjs'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'json2.js'
				'history.adapter.extjs.js'
				'history.html4.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/extjs.history.js'
		}
		{
			# Options
			name: 'html5+extjs'
			watch: options.watch

			# Paths
			srcPath: __dirname+'/scripts/uncompressed'

			# Compression (without outPath only the generated bundle files are compressed)
			compressScripts: options.compress # Array or true or false

			# Order
			scriptsOrder: [
				'history.adapter.extjs.js'
				'history.js'
			]

			# Bundling
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/extjs.history.js'
		}

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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/jquery.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/jquery.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/mootools.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/mootools.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/native.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/native.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/right.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/right.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html4+html5/zepto.history.js'
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
			bundleScriptPath: __dirname+'/scripts/bundled-uncompressed/html5/zepto.history.js'
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
