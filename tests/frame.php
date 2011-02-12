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

	# Dir
	$dir = isset($_GET['dir']) ? $_GET['dir'] : null;
	if ( !in_array($dir,$dirs) ) {
		throw new Exception('Unknown dir ['.$dirs.']');
	}

	# Url
	$tests_full_url = $tests_url."/${dir}/${support}/${adapter}";

	# Titles
	$Support = strtoupper($support);
	$Adapter = ucwords($adapter);
	$Dir = ucwords($dir);
	$title = "History.js ${Dir} ${Support} ${Adapter} Test Suite";
?><!DOCTYPE html>
<html>
<head>
	<title><?=$title?></title>
	<!-- Check -->
	<script type="text/javascript">
		if ( document.location.href !== "<?=$tests_full_url?>" ) {
			document.location.href = "<?=$tests_full_url?>";
		}
	</script>
</head>
<body>
	<!-- FireBug Lite -->
	<script type="text/javascript">
		if ( typeof console === 'undefined' ) {
			var
				url = '<?=$base_url?>/vendor/firebug-lite.js',
				scriptEl = document.createElement('script');
			scriptEl.type = 'text/javascript';
			scriptEl.src = url;
			document.body.appendChild(scriptEl,document.body.firstChild);
		}
	</script>

	<!-- History.js -->
	<script type="text/javascript">
		if ( typeof JSON === 'undefined' ) {
			var
				url = '<?=$base_url?>/scripts/uncompressed/json2.js',
				scriptEl = document.createElement('script');
			scriptEl.type = 'text/javascript';
			scriptEl.src = url;
			document.body.appendChild(scriptEl,document.body.firstChild);
		}
	</script>
	<script type="text/javascript" src="<?=$base_url?>/vendor/<?=$adapter?>.js"></script>
	<script type="text/javascript" src="<?=$base_url?>/scripts/<?=$dir?>/history.adapter.<?=$adapter?>.js"></script>
	<script type="text/javascript" src="<?=$base_url?>/scripts/<?=$dir?>/history.js"></script>
	<?php if ( $support === 'html4' ) : ?>
	<script type="text/javascript" src="<?=$base_url?>/scripts/<?=$dir?>/history.html4.js"></script>
	<?php endif; ?>

	<!-- QUnit -->
	<link rel="stylesheet" href="<?=$base_url?>/vendor/qunit/qunit/qunit.css" type="text/css" media="screen">
	<script type="text/javascript" src="<?=$base_url?>/vendor/qunit/qunit/qunit.js"></script>

	<!-- Tests -->
	<script type="text/javascript" src="<?=$base_url?>/tests/tests.js"></script>

	<h1 id="qunit-header"><?=$title?></h1>
	<h2 id="qunit-banner"></h2>
	<div id="qunit-testrunner-toolbar"></div>
	<h2 id="qunit-userAgent"></h2>
	<ol id="qunit-tests"></ol>
	<div id="qunit-fixture">test markup</div>
	<div id="log"></div>
</body>
</html>
