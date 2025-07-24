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
    SELECT s.*, i.invoice_number, pt.name as precursor_name, v.name as vendor_name
    FROM shipments s
    LEFT JOIN invoices i ON s.invoice_id = i.id
    LEFT JOIN precursor_types pt ON s.precursor_type_id = pt.id
    LEFT JOIN vendors v ON i.vendor_id = v.id
    ORDER BY s.shipment_date DESC
");
$shipments = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipments - <?php echo SITE_NAME; ?></title>
    <link href="../assets/css/style.css" rel="stylesheet">
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Shipments</h1>
            <a href="add.php" class="btn btn-primary">Add New Shipment</a>
        </div>
        
        <div class="table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Precursor</th>
                        <th>Quantity</th>
                        <th>Origin</th>
                        <th>Destination</th>
                        <th>Ship Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($shipments as $shipment): ?>
                        <tr>
                            <td><?php echo sanitizeOutput($shipment['invoice_number']); ?></td>
                            <td><?php echo sanitizeOutput($shipment['precursor_name']); ?></td>
                            <td><?php echo number_format($shipment['quantity'], 3) . ' ' . $shipment['unit']; ?></td>
                            <td><?php echo sanitizeOutput($shipment['origin_country']); ?></td>
                            <td><?php echo sanitizeOutput($shipment['destination_country']); ?></td>
                            <td><?php echo formatDate($shipment['shipment_date']); ?></td>
                            <td>
                                <?php if ($shipment['delivery_date']): ?>
                                    <span class="status status-delivered">Delivered</span>
                                <?php else: ?>
                                    <span class="status status-transit">In Transit</span>
                                <?php endif; ?>
                            </td>
                            <td class="actions">
                                <a href="edit.php?id=<?php echo $shipment['id']; ?>" class="btn btn-sm">Edit</a>
                                <a href="delete.php?id=<?php echo $shipment['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
