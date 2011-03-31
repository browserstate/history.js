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
		.compress {
			padding-bottom:1em;
		}
		.support {
			padding-bottom:1em;
		}
		.persist {
			padding-bottom:1em;
		}
	</style>
</head>
<body>
	<h1>History.js Test Suite</h1>
	<p>HTML5 Browsers - should pass the HTML4 and HTML5 tests</p>
	<p>HTML4 Browsers - should pass the HTML4 tests and fail the HTML5 tests</p>
	<?php
	foreach ( $compress as $compression ) :
		echo '<div class="compress">';
		foreach ( $supports as $support ) :
			echo '<div class="support">';
			foreach ( $persists as $persist ) :
				echo '<div class="persist">';
				foreach ( $adapters as $adapter ) :
					echo '<div class="adapter">';

					# Url
					$filename = "${compression}-${support}-${persist}-${adapter}.html";

					# Title
					$Support = strtoupper($support);
					$Adapter = ucwords($adapter);
					$Persist = ucwords($persist);
					$Compression = ucwords($compression);
					$title = "History.js ${Compression} ${Support} ${Persist} ${Adapter} Test Suite";

					# Render
					?><a href="<?=$filename?>"><?=$title?></a><?php
					echo '</div>';
				endforeach;
				echo '</div>';
			endforeach;
			echo '</div>';
		endforeach;
		echo '</div>';
	endforeach;
	?>
</body>
</html>
