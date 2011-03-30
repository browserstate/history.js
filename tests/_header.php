<?php
	# Base URL
	$relative_url = $_SERVER['REQUEST_URI'];
	$relative_url = substr($relative_url,0,strpos($relative_url,'/history.js')).'/history.js/';
	$base_url = 'http://'.$_SERVER['HTTP_HOST'].$relative_url;
	$tests_url = $base_url.'tests/';

	# Dirs
	$dirs = array('uncompressed','compressed');

	# Support
	$supports = array('html5','html4');

	# Persist
	$persists = array('persistant','non-persistant');

	# Adapter
	$adapters = array('jquery','mootools','prototype','zepto');
