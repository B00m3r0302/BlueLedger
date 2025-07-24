<?php
require_once '../../includes/config.php';
require_once '../../includes/database.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

setSecureHeaders();

$auth = new Auth();
$auth->requireLogin();

$db = (new Database())->getConnection();

$stmt = $db->query("
    SELECT i.*, v.name as vendor_name 
    FROM invoices i 
    LEFT JOIN vendors v ON i.vendor_id = v.id 
    ORDER BY i.invoice_date DESC
");
$invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoices - <?php echo SITE_NAME; ?></title>
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Invoices</h1>
            <a href="add.php" class="btn btn-primary">Add New Invoice</a>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Invoice #</th>
                        <th>Vendor</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($invoices as $invoice): ?>
                        <tr>
                            <td><?php echo sanitizeOutput($invoice['invoice_number']); ?></td>
                            <td><?php echo sanitizeOutput($invoice['vendor_name']); ?></td>
                            <td><?php echo formatDate($invoice['invoice_date']); ?></td>
                            <td><?php echo formatCurrency($invoice['total_amount'], $invoice['currency']); ?></td>
                            <td>
                                <span class="status status-<?php echo $invoice['status']; ?>">
                                    <?php echo ucfirst($invoice['status']); ?>
                                </span>
                            </td>
                            <td class="actions">
                                <a href="edit.php?id=<?php echo $invoice['id']; ?>" class="btn btn-sm">Edit</a>
                                <a href="delete.php?id=<?php echo $invoice['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
