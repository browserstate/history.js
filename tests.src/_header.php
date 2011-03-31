<?php
	# Check
	if ( empty($_SERVER['REQUEST_URI']) ) {
		die('run this in your browser');
	}

	# Locations
	$dir = dirname(__FILE__);
	$out = "$dir/../tests";

	# Base URL
	$relative_url = $_SERVER['REQUEST_URI'];
	$relative_url = substr($relative_url,0,strpos($relative_url,'/history.js')).'/history.js/';
	$base_url = '/'.$relative_url;
	$tests_url = $base_url.'tests';

	# Compress
	$compress = array('uncompressed','compressed');

	# Persist
	$persists = array('persistant','nonpersistant');

	# Support
	$supports = array('html5','html4');

	# Adapter
	$adapters = array('jquery','mootools','prototype','zepto');

