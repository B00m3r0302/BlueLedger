<?php
// BlueLedger Configuration
// EDUCATIONAL VULNERABILITY DEMO - DO NOT USE IN PRODUCTION

define('DB_HOST', 'localhost');
define('DB_NAME', 'blueledger');
define('DB_USER', 'root');
define('DB_PASS', '');

define('SITE_NAME', 'BlueLedger');
define('BASE_URL', 'https://blueledger.example.com');
define('HTTP_BASE_URL', 'http://blueledger.example.com');

// Session configuration - deliberately insecure for demo
ini_set('session.cookie_httponly', 1);
// DELIBERATELY NOT setting session.cookie_secure for SSLStrip demo
// ini_set('session.cookie_secure', 1); // COMMENTED OUT FOR VULNERABILITY

session_start();
?>
