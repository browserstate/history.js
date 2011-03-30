<?php
	# Header
	require_once(dirname(__FILE__).'/_header.php');

	# Index
	ob_start();
	require($dir.'/all.php');
	$contents = ob_get_contents();
	ob_end_clean();
	file_put_contents($out.'/index.html', $contents);

	# Each
	foreach ( $compress as $compression )
	foreach ( $supports as $support )
	foreach ( $persists as $persist )
	foreach ( $adapters as $adapter ) {
		ob_start();
		require($dir.'/each.php');
		$contents = ob_get_contents();
		ob_end_clean();
		file_put_contents($out."/${filename}", $contents);
	}

	# Done
?><html><body><a href="../tests">Tests</a></body></html>
