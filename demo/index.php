<?

# Define our Pages
$pages = array('welcome','form','cool');

# Page Get
$page = empty($_GET['page']) ? $pages[0] : $_GET['page'];

# Page Secure
if ( !in_array($page, $pages) ) throw new Exception('Hacker!');

# Page Path
$page_path = dirname(__FILE__).DIRECTORY_SEPARATOR.'/pages/'.$page.'.php';


?><!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>
		History.js &lt; BrowserState Suite
	</title>
</head>
<body>
	<script type="text/javascript" src="scripts/jquery-1.4.4.min.js"></script>
	<script type="text/javascript" src="../scripts/uncompressed/history.js"></script>
	<script type="text/javascript" src="../scripts/uncompressed/history.adapter.jquery.js"></script>
	<script type="text/javascript" src="scripts/demo.js"></script>

	<div id="wrap">
		<ul id="menu" data-ajaxy-menu="page">
			<? foreach ( $pages as $page ) : ?>
				<li>
					<a href="?page=<?=$page?>"><?=ucwords($page)?></a>
				</li>
			<? endforeach; ?>
		</ul>
		<div id="content" data-ajaxy-element="page">
			<? require_once($page_path) ?>
		</div>
	</div>

</body>
</html>
