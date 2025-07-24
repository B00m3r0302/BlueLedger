<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

$auth = new Auth();

// Redirect to dashboard if logged in, otherwise to login
if ($auth->isLoggedIn()) {
    redirect('https://blueledger.example.com/dashboard.php');
} else {
    redirect('https://blueledger.example.com/login.php');
}
?>
