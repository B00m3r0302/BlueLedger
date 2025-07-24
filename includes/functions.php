<?php
function formatCurrency($amount, $currency = 'USD') {
    return $currency . ' ' . number_format($amount, 2);
}

function formatDate($date) {
    return date('M j, Y', strtotime($date));
}

function sanitizeOutput($string) {
    return htmlspecialchars($string, ENT_QUOTES, 'UTF-8');
}

function redirect($url) {
    header("Location: $url");
    exit;
}

function setSecureHeaders() {
    // Only set HSTS after login for HTTPS pages
    if (isset($_SESSION['user_id']) && $_SERVER['HTTPS'] == 'on') {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

function getSecureUrl($path = '') {
    $server_name = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
    return 'https://' . $server_name . '/' . ltrim($path, '/');
}

function getInsecureUrl($path = '') {
    $server_name = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? 'localhost';
    return 'http://' . $server_name . '/' . ltrim($path, '/');
}
?>
