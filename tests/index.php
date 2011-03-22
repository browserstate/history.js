<?php
	# Header
	require_once(dirname(__FILE__).'/_header.php');
?><!DOCTYPE html>
<html>
<head>
	<title>History.js Test Suite</title>
	<style type="text/css">
		body,html,iframe {
			padding:0;
			margin:0;
			outline:none;
			border:none;
		}
		.dir {
			padding-top:1em;
		}
		.support {
			padding-top:1em;
		}
	</style>
</head>
<body>
	<h1>History.js Test Suite</h1>
	<p>HTML5 Browsers - should pass the HTML4 and HTML5 tests</p>
	<p>HTML4 Browsers - should pass the HTML4 tests and fail the HTML5 tests</p>
	<?php
	foreach ( $dirs as $dir ) :
		echo '<div class="dir">';
		foreach ( $supports as $support ) :
			echo '<div class="support">';
			foreach ( $adapters as $adapter ) :
				echo '<div class="adapter">';

				# Url
				$tests_full_url = $tests_url."${dir}/${support}/${adapter}";

				# Titles
				$Support = strtoupper($support);
				$Adapter = ucwords($adapter);
				$Dir = ucwords($dir);
				$title = "History.js ${Dir} ${Support} ${Adapter} Test Suite";

				# Render
				?><a href="<?=$tests_full_url?>"><?=$title?></a><?php

				echo '</div>';
			endforeach;
			echo '</div>';
		endforeach;
		echo '</div>';
	endforeach;
	?>
</body>
</html>
