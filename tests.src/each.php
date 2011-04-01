<?php
	# Url
	$filename = "${compression}-${support}-${persist}-${adapter}.html";

	# Titles
	$Support = strtoupper($support);
	$Adapter = ucwords($adapter);
	$Persist = ucwords($persist);
	$Compression = ucwords($compression);
	$title = "History.js ${Compression} ${Support} ${Persist} ${Adapter} Test Suite";
?><!DOCTYPE html>
<html debug="true">
<head>
	<meta http-equiv="Expires" CONTENT="Mon, 06 Jan 1990 00:00:01 GMT" />
	<meta http-equiv="PRAGMA" CONTENT="NO-CACHE" />
	<meta http-equiv="CACHE-CONTROL" CONTENT="NO-CACHE" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<title><?=$title?></title>

	<!-- Check -->
	<script>
		var
			href = window.document.location.href,
			test_url = href.replace(/(history\.js\/tests\/[^\/\?\#]+).*/,'$1');
		if ( test_url !== href ) {
			window.document.location.href = test_url;
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

	<!-- History.js -->
	<script>if ( typeof window.JSON === 'undefined' ) { document.write('<script src="../scripts/<?=$compression?>/json2.js"><\/script>'); }</script>
	<?php if ( $persist === 'persistant' ) : ?>
	<script src="../scripts/<?=$compression?>/amplify.store.js"></script>
	<?php endif; ?>
	<script src="../scripts/<?=$compression?>/history.adapter.<?=$adapter?>.js"></script>
	<script src="../scripts/<?=$compression?>/history.js"></script>
	<?php if ( $support === 'html4' ) : ?>
	<script src="../scripts/<?=$compression?>/history.html4.js"></script>
	<?php endif; ?>

	<!-- Tests -->
	<script src="tests.js"></script>
</body>
</html>
