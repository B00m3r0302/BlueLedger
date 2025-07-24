<?php
require_once '../includes/config.php';
require_once '../includes/database.php';
require_once '../includes/auth.php';
require_once '../includes/functions.php';

setSecureHeaders(); // Set HSTS header for authenticated pages

$auth = new Auth();
$auth->requireLogin();

$db = (new Database())->getConnection();

// Get summary statistics
$stats = [];

// Total invoices
$stmt = $db->query("SELECT COUNT(*) as count, SUM(total_amount) as total FROM invoices");
$invoice_stats = $stmt->fetch(PDO::FETCH_ASSOC);
$stats['invoices'] = $invoice_stats;

// Total shipments
$stmt = $db->query("SELECT COUNT(*) as count, SUM(quantity * unit_price) as total FROM shipments");
$shipment_stats = $stmt->fetch(PDO::FETCH_ASSOC);
$stats['shipments'] = $shipment_stats;

// Total expenses
$stmt = $db->query("SELECT COUNT(*) as count, SUM(amount) as total FROM expenses");
$expense_stats = $stmt->fetch(PDO::FETCH_ASSOC);
$stats['expenses'] = $expense_stats;

// Recent activity
$stmt = $db->query("
    SELECT 'invoice' as type, invoice_number as title, total_amount as amount, created_at 
    FROM invoices 
    UNION ALL
    SELECT 'expense' as type, description as title, amount, created_at 
    FROM expenses
    ORDER BY created_at DESC 
    LIMIT 10
");
$recent_activity = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Monthly revenue data for chart
$stmt = $db->query("
    SELECT 
        DATE_FORMAT(invoice_date, '%Y-%m') as month,
        SUM(total_amount) as revenue
    FROM invoices 
    WHERE invoice_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY month
    ORDER BY month
");
$monthly_revenue = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - <?php echo SITE_NAME; ?></title>
    <link href="assets/css/style.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
</head>
<body>
    <?php include 'includes/header.php'; ?>
    
    <div class="container">
        <h1>Dashboard</h1>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Invoices</h3>
                <div class="stat-value"><?php echo $stats['invoices']['count']; ?></div>
                <div class="stat-amount"><?php echo formatCurrency($stats['invoices']['total']); ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Total Shipments</h3>
                <div class="stat-value"><?php echo $stats['shipments']['count']; ?></div>
                <div class="stat-amount"><?php echo formatCurrency($stats['shipments']['total']); ?></div>
            </div>
            
            <div class="stat-card">
                <h3>Total Expenses</h3>
                <div class="stat-value"><?php echo $stats['expenses']['count']; ?></div>
                <div class="stat-amount"><?php echo formatCurrency($stats['expenses']['total']); ?></div>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="dashboard-section">
                <h2>Monthly Revenue Trend</h2>
                <canvas id="revenueChart" width="400" height="200"></canvas>
            </div>
            
            <div class="dashboard-section">
                <h2>Recent Activity</h2>
                <div class="activity-list">
                    <?php foreach ($recent_activity as $activity): ?>
                        <div class="activity-item">
                            <span class="activity-type"><?php echo ucfirst($activity['type']); ?></span>
                            <span class="activity-title"><?php echo sanitizeOutput($activity['title']); ?></span>
                            <span class="activity-amount"><?php echo formatCurrency($activity['amount']); ?></span>
                            <span class="activity-date"><?php echo formatDate($activity['created_at']); ?></span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Revenue chart data
        const revenueData = <?php echo json_encode($monthly_revenue); ?>;
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: revenueData.map(item => item.month),
                datasets: [{
                    label: 'Monthly Revenue',
                    data: revenueData.map(item => item.revenue),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    </script>
</body>
</html>
