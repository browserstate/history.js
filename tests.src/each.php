<?php
	# Url
	$url = "${browser}.${adapter}.html";

	# Titles
	$Browser = strtoupper($browser);
	$Adapter = ucwords($adapter);
	$title = "History.js ${Browser} ${Adapter} Test Suite";
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
		var href = window.document.location.href,
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
	<script src="../scripts/bundled/<?=$browser?>/<?=$adapter?>.history.js"></script>

	<!-- Tests -->
	<script src="tests.js"></script>
</body>
</html>