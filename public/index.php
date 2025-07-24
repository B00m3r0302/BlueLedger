<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

$auth = new Auth();

// Redirect to dashboard if logged in, otherwise to login
if ($auth->isLoggedIn()) {
    redirect(getSecureUrl('dashboard.php'));
} else {
    redirect(getSecureUrl('login.php'));
}
?>
