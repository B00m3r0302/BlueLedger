<?php
require_once '../../includes/config.php';
require_once '../../includes/database.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

setSecureHeaders();

$auth = new Auth();
$auth->requireLogin();

$db = (new Database())->getConnection();

$stmt = $db->query("SELECT * FROM vendors ORDER BY name");
$vendors = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vendors - <?php echo SITE_NAME; ?></title>
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Vendors</h1>
            <a href="add.php" class="btn btn-primary">Add New Vendor</a>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact Person</th>
                        <th>Email</th>
                        <th>Country</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($vendors as $vendor): ?>
                        <tr>
                            <td><?php echo sanitizeOutput($vendor['name']); ?></td>
                            <td><?php echo sanitizeOutput($vendor['contact_person']); ?></td>
                            <td><?php echo sanitizeOutput($vendor['email']); ?></td>
                            <td><?php echo sanitizeOutput($vendor['country']); ?></td>
                            <td class="actions">
                                <a href="edit.php?id=<?php echo $vendor['id']; ?>" class="btn btn-sm">Edit</a>
                                <a href="delete.php?id=<?php echo $vendor['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
