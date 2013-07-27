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
	foreach ( $browsers as $browser )
	foreach ( $adapters as $adapter ) {
		ob_start();
		require($dir.'/each.php');
		$contents = ob_get_contents();
		ob_end_clean();
		file_put_contents($out."/${url}", $contents);
	}

	# Done
?><html><body><a href="../tests">Tests</a></body></html>
