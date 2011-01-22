<?

# Define our Pages
$pages = array('welcome','form','cool');

# Page Get
$page = empty($_GET['page']) ? $pages[0] : $_GET['page'];

# Page Secure
if ( !in_array($page, $pages) ) throw new Exception('Hacker!');

# Page Path
$page_path = dirname(__FILE__).DIRECTORY_SEPARATOR.'/pages/'.$page.'.php';

# Adapter
$adapter = 'jquery';

?><!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>
		History.js &lt; BrowserState Suite
	</title>
</head>
<body>
	<script type="text/javascript">
		if ( typeof JSON === 'undefined' ) {
			var
				url = '../scripts/uncompressed/json2.js',
				scriptEl = document.createElement('script');
			scriptEl.type = 'text/javascript';
			scriptEl.src = url;
			document.body.appendChild(scriptEl);
		}
	</script>
	<script type="text/javascript" src="./scripts/jquery.js"></script>
	<script type="text/javascript">jQuery.noConflict()</script>

	<? switch ( $adapter ) :
		case 'jquery': ?>
			<script type="text/javascript" src="../scripts/uncompressed/history.adapter.jquery.js"></script>
			<? break;

		case 'dojo':
		case 'prototype':
		case 'mootools': ?>
			<script type="text/javascript" src="./scripts/<?=$adapter?>.js"></script>
			<script type="text/javascript" src="../scripts/uncompressed/history.adapter.<?=$adapter?>.js"></script>
			<? break;
	endswitch; ?>

	<script type="text/javascript" src="../scripts/uncompressed/history.js"></script>
	<script type="text/javascript" src="./scripts/demo.js"></script>

	<div id="wrap">
		<ul id="menu">
			<? foreach ( $pages as $page ) : ?>
				<li>
					<a href="?page=<?=$page?>"><?=ucwords($page)?></a>
				</li>
			<? endforeach; ?>
		</ul>
		<div id="content">
			<? require_once($page_path) ?>
		</div>
	</div>

</body>
</html>
