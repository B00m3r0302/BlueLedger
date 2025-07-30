<?php
require_once '../includes/config.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

$auth = new Auth();
$error = '';

// Handle form submission - VULNERABLE: accepts HTTP POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if ($auth->login($username, $password)) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        redirect(getSecureUrl('dashboard.php'));
    } else {
        $error = 'Invalid username or password.';
    }
}

// If already logged in, redirect to dashboard
if ($auth->isLoggedIn()) {
    redirect(getSecureUrl('dashboard.php'));
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo SITE_NAME; ?></title>
    <link href="assets/css/style.css" rel="stylesheet">
</head>
<body class="login-page">
    <div class="login-container">
        <div class="login-form">
            <h1><?php echo SITE_NAME; ?></h1>
            <h2>Secure Login</h2>
            
            <?php if ($error): ?>
                <div class="error"><?php echo sanitizeOutput($error); ?></div>
            <?php endif; ?>
            
            <!-- VULNERABILITY: Form action posts to HTTP, no HSTS, no secure cookie -->
            <form method="POST" action="<?php echo HTTP_BASE_URL; ?>/login.php">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn btn-primary">Login</button>
            </form>
            
        </div>
    </div>
</body>
</html>
