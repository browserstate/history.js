# Requires
buildr = require 'buildr'

# Includes
config = 
	srcPath: __dirname+'/scripts/uncompressed'
	outPath: __dirname+'/scripts/compressed'
	compressScripts: true
	checkScripts: true
	jshintOptions: {
		browser: true
		laxbreak: true
		boss: true
		undef: true
		onevar: true
		strict: true
		noarg: true
	}

# Build
mercuryBuildr = buildr.createInstance(config)
mercuryBuildr.process (err) ->
	throw err  if err
	console.log 'Building completed'
