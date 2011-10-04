<!DOCTYPE html>
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
		.browser {
			padding-top:1em;
		}
		.adapter {
			padding-top:1em;
		}
	</style>
</head>
<body>
	<h1>History.js Test Suite</h1>
	<p>HTML5 Browsers must pass the HTML4+HTML5 tests</p>
	<p>HTML4 Browsers must pass the HTML4 tests and should fail the HTML5 tests</p>
	<?php
	foreach ( $browsers as $browser ) :
		echo '<div class="browser">';
		foreach ( $adapters as $adapter ) :
			echo '<div class="adapter">';
			# Url
			$url = "${browser}.${adapter}.html";

			# Title
			$Browser = ucwords($browser);
			$Adapter = ucwords($adapter);
			$title = "History.js ${Browser} ${Adapter} Test Suite";

			# Render
			?><a href="<?=$url?>"><?=$title?></a><?php
			echo '</div>';
		endforeach;
		echo '</div>';
	endforeach;
	?>
</body>
</html>
