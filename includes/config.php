<?php
// BlueLedger Configuration
// EDUCATIONAL VULNERABILITY DEMO - DO NOT USE IN PRODUCTION

define('DB_HOST', 'localhost');
define('DB_NAME', 'blueledger');
define('DB_USER', 'blueledger');
define('DB_PASS', 'password1');

// Get the actual server name dynamically
$server_name = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
$is_https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || $_SERVER['SERVER_PORT'] == 443;
$protocol = $is_https ? 'https' : 'http';

define('SITE_NAME', 'BlueLedger');
define('BASE_URL', $protocol . '://' . $server_name);
define('HTTP_BASE_URL', 'http://' . $server_name);

// Session configuration - deliberately insecure for demo
ini_set('session.cookie_httponly', 1);
// DELIBERATELY NOT setting session.cookie_secure for SSLStrip demo
// ini_set('session.cookie_secure', 1); // COMMENTED OUT FOR VULNERABILITY

session_start();
?>
