<?php
	# Header
	require_once(dirname(__FILE__).'/_header.php');
?><!DOCTYPE html>
<html>
<head>
	<title>History.js Test Suite</title>
	<style type="text/css">
		body,html,.test,iframe {
			padding:0;
			margin:0;
			outline:none;
			border:none;
		}
		.test,iframe {
			display:block;
			width:100%;
		}
		.test {
			float:left;
		}
		iframe {
			height:400px;
		}
	</style>
</head>
<body>
	<h1>History.js Test Suite</h1>
	<p>HTML5 Browsers - should pass the HTML4 and HTML5 tests</p>
	<p>HTML4 Browsers - should pass the HTML4 tests and fail the HTML5 tests</p>
	<?php
	foreach ( $dirs as $dir ) :
		foreach ( $supports as $support ) :
			foreach ( $adapters as $adapter ) :
				# Url
				$tests_full_url = $tests_url."/${dir}/${support}/${adapter}";

				# Titles
				$Support = strtoupper($support);
				$Adapter = ucwords($adapter);
				$Dir = ucwords($dir);
				$title = "History.js ${Dir} ${Support} ${Adapter} Test Suite";

				# Render
				?><div class="test"><a href="<?=$tests_full_url?>"><?=$title?></a></div><?php
			endforeach;
		endforeach;
	endforeach;
	?>
</body>
</html>
