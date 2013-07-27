<?php
	# Locations
	$dir = dirname(__FILE__);
	$out = "$dir/../tests";

	# Base URL
	$base_url = '/';
	$tests_url = $base_url.'tests';

	# Data
	$browsers = array(
		'html4+html5',
		'html5'
	);
	$adapters = array(
		'jquery',
		'mootools',
		'native',
		'right',
		'zepto'
	);

