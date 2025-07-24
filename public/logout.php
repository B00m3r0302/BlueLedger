<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

setSecureHeaders();

$auth = new Auth();
$auth->logout();
redirect('https://blueledger.example.com/login.php');
?>
