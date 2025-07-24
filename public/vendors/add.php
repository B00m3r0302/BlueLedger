<?php
require_once '../../includes/config.php';
require_once '../../includes/database.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

setSecureHeaders();

$auth = new Auth();
$auth->requireLogin();

$db = (new Database())->getConnection();
$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = $_POST['name'] ?? '';
    $contact_person = $_POST['contact_person'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $address = $_POST['address'] ?? '';
    $country = $_POST['country'] ?? '';
    
    if (empty($name)) {
        $error = 'Vendor name is required.';
    } else {
        $stmt = $db->prepare("INSERT INTO vendors (name, contact_person, email, phone, address, country) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt->execute([$name, $contact_person, $email, $phone, $address, $country])) {
            redirect('index.php?success=1');
        } else {
            $error = 'Failed to add vendor.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Vendor - <?php echo SITE_NAME; ?></title>
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Add New Vendor</h1>
            <a href="index.php" class="btn btn-outline">Back to Vendors</a>
        </div>
        
        <?php if ($error): ?>
            <div class="error"><?php echo sanitizeOutput($error); ?></div>
        <?php endif; ?>
        
        <form method="POST" class="form">
            <div class="form-group">
                <label for="name">Vendor Name *</label>
                <input type="text" id="name" name="name" required value="<?php echo sanitizeOutput($_POST['name'] ?? ''); ?>">
            </div>
            
            <div class="form-group">
                <label for="contact_person">Contact Person</label>
                <input type="text" id="contact_person" name="contact_person" value="<?php echo sanitizeOutput($_POST['contact_person'] ?? ''); ?>">
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?php echo sanitizeOutput($_POST['email'] ?? ''); ?>">
            </div>
            
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" id="phone" name="phone" value="<?php echo sanitizeOutput($_POST['phone'] ?? ''); ?>">
            </div>
            
            <div class="form-group">
                <label for="address">Address</label>
                <textarea id="address" name="address" rows="3"><?php echo sanitizeOutput($_POST['address'] ?? ''); ?></textarea>
            </div>
            
            <div class="form-group">
                <label for="country">Country</label>
                <input type="text" id="country" name="country" value="<?php echo sanitizeOutput($_POST['country'] ?? ''); ?>">
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Add Vendor</button>
                <a href="index.php" class="btn btn-outline">Cancel</a>
            </div>
        </form>
    </div>
</body>
</html>
