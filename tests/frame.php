<?php
	# Header
	require_once(dirname(__FILE__).'/_header.php');

	# Support
	$support = isset($_GET['support']) ? $_GET['support'] : null;
	if ( !in_array($support,$supports) ) {
		throw new Exception('Unknown support ['.$support.']');
	}

	# Adapter
	$adapter = isset($_GET['adapter']) ? $_GET['adapter'] : null;
	if ( !in_array($adapter,$adapters) ) {
		throw new Exception('Unknown adapter ['.$adapter.']');
	}

	# Persist
	$persist = isset($_GET['persist']) ? $_GET['persist'] : null;
	if ( !in_array($persist,$persists) ) {
		throw new Exception('Unknown persist ['.$persist.']');
	}

	# Dir
	$dir = isset($_GET['dir']) ? $_GET['dir'] : null;
	if ( !in_array($dir,$dirs) ) {
		throw new Exception('Unknown dir ['.$dirs.']');
	}

	# Url
	$tests_full_url = $tests_url."${dir}/${support}/${persist}/${adapter}/";

	# Titles
	$Support = strtoupper($support);
	$Adapter = ucwords($adapter);
	$Persist = ucwords($persist);
	$Dir = ucwords($dir);
	$title = "History.js ${Dir} ${Support} ${Persist} ${Adapter} Test Suite";

	# No Chache
	header("Cache-Control: no-store, no-cache, must-revalidate");
	header("Cache-Control: post-check=0, pre-check=0", false);
	header("Pragma: no-cache");
?><!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Expires" CONTENT="Mon, 06 Jan 1990 00:00:01 GMT" />
	<meta http-equiv="PRAGMA" CONTENT="NO-CACHE" />
	<meta http-equiv="CACHE-CONTROL" CONTENT="NO-CACHE" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<title><?=$title?></title>
	<base href="<?=$tests_url?>" />

	<!-- Check -->
	<script>
		if ( window.document.location.href !== "<?=$tests_full_url?>" ) {
			window.document.location.href = "<?=$tests_full_url?>";
		}
	</script>

	<!-- Framework -->
	<script src="../vendor/<?=$adapter?>.js"></script>

	<!-- QUnit -->
	<link rel="stylesheet" href="../vendor/qunit/qunit/qunit.css" type="text/css" media="screen">
	<script src="../vendor/qunit/qunit/qunit.js"></script>
</head>
<body>
	<!-- Elements -->
	<h1 id="qunit-header"><?=$title?></h1>
	<h2 id="qunit-banner"></h2>
	<div id="qunit-testrunner-toolbar"></div>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests"></ol>
	<div id="qunit-fixture">test markup</div>
	<button onclick="history.back()">back</button><button onclick="history.forward()">forward</button>
	<textarea id="log" style="width:100%;height:400px"></textarea>

	<!-- FireBug Lite -->
	<script>if ( typeof window.console === 'undefined' ) { document.write('<script src=".../vendor/firebug-lite.js"><\/script>'); }</script>

	<!-- JSON -->
	<script>if ( typeof window.JSON === 'undefined' ) { document.write('<script src="../scripts/<?=$dir?>/json2.js"><\/script>'); }</script>

	<!-- History.js -->
	<?php if ( $persist === 'persistant' ) : ?>
	<script src="../scripts/<?=$dir?>/amplify.store.js"></script>
	<?php endif; ?>
	<script src="../scripts/<?=$dir?>/history.adapter.<?=$adapter?>.js"></script>
	<script src="../scripts/<?=$dir?>/history.js"></script>
	<?php if ( $support === 'html4' ) : ?>
	<script src="../scripts/<?=$dir?>/history.html4.js"></script>
	<?php endif; ?>

	<!-- Tests -->
	<script src="tests.js"></script>
</body>
</html>
