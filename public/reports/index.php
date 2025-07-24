<?php
require_once '../../includes/config.php';
require_once '../../includes/database.php';
require_once '../../includes/auth.php';
require_once '../../includes/functions.php';

setSecureHeaders();

$auth = new Auth();
$auth->requireLogin();

$db = (new Database())->getConnection();

// Monthly financial summary
$stmt = $db->query("
    SELECT 
        DATE_FORMAT(invoice_date, '%Y-%m') as month,
        COUNT(*) as invoice_count,
        SUM(total_amount) as total_revenue
    FROM invoices 
    WHERE invoice_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY month
    ORDER BY month DESC
");
$monthly_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Top precursors by volume
$stmt = $db->query("
    SELECT 
        pt.name,
        pt.chemical_formula,
        SUM(s.quantity) as total_quantity,
        SUM(s.quantity * s.unit_price) as total_value,
        COUNT(s.id) as shipment_count
    FROM precursor_types pt
    JOIN shipments s ON pt.id = s.precursor_type_id
    WHERE s.shipment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY pt.id
    ORDER BY total_value DESC
    LIMIT 10
");
$top_precursors = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Vendor performance
$stmt = $db->query("
    SELECT 
        v.name,
        v.country,
        COUNT(DISTINCT i.id) as invoice_count,
        SUM(i.total_amount) as total_business,
        AVG(DATEDIFF(s.delivery_date, s.shipment_date)) as avg_delivery_days
    FROM vendors v
    JOIN invoices i ON v.id = i.vendor_id
    LEFT JOIN shipments s ON i.id = s.invoice_id
    WHERE i.invoice_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY v.id
    ORDER BY total_business DESC
");
$vendor_performance = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Expense breakdown
$stmt = $db->query("
    SELECT 
        category,
        COUNT(*) as expense_count,
        SUM(amount) as total_amount
    FROM expenses
    WHERE expense_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY category
    ORDER BY total_amount DESC
");
$expense_breakdown = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports - <?php echo SITE_NAME; ?></title>
    <link href="../assets/css/style.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js"></script>
</head>
<body>
    <?php include '../includes/header.php'; ?>
    
    <div class="container">
        <div class="page-header">
            <h1>Financial Reports</h1>
        </div>
        
        <div class="reports-grid">
            <!-- Monthly Revenue Chart -->
            <div class="report-section">
                <h2>Monthly Revenue Trend (Last 12 Months)</h2>
                <canvas id="monthlyRevenueChart" width="400" height="200"></canvas>
            </div>
            
            <!-- Expense Breakdown -->
            <div class="report-section">
                <h2>Expense Breakdown (Last 6 Months)</h2>
                <canvas id="expenseChart" width="400" height="200"></canvas>
            </div>
            
            <!-- Top Precursors Table -->
            <div class="report-section">
                <h2>Top Precursor Chemicals by Value (Last 6 Months)</h2>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Chemical Name</th>
                                <th>Formula</th>
                                <th>Total Quantity (kg)</th>
                                <th>Total Value</th>
                                <th>Shipments</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($top_precursors as $precursor): ?>
                                <tr>
                                    <td><?php echo sanitizeOutput($precursor['name']); ?></td>
                                    <td><?php echo sanitizeOutput($precursor['chemical_formula']); ?></td>
                                    <td><?php echo number_format($precursor['total_quantity'], 2); ?></td>
                                    <td><?php echo formatCurrency($precursor['total_value']); ?></td>
                                    <td><?php echo $precursor['shipment_count']; ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Vendor Performance -->
            <div class="report-section">
                <h2>Vendor Performance (Last 12 Months)</h2>
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Vendor</th>
                                <th>Country</th>
                                <th>Invoices</th>
                                <th>Total Business</th>
                                <th>Avg Delivery (Days)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($vendor_performance as $vendor): ?>
                                <tr>
                                    <td><?php echo sanitizeOutput($vendor['name']); ?></td>
                                    <td><?php echo sanitizeOutput($vendor['country']); ?></td>
                                    <td><?php echo $vendor['invoice_count']; ?></td>
                                    <td><?php echo formatCurrency($vendor['total_business']); ?></td>
                                    <td><?php echo $vendor['avg_delivery_days'] ? round($vendor['avg_delivery_days'], 1) : 'N/A'; ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // Monthly Revenue Chart
        const monthlyData = <?php echo json_encode($monthly_data); ?>;
        const monthlyCtx = document.getElementById('monthlyRevenueChart').getContext('2d');
        
        new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: monthlyData.map(item => item.month),
                datasets: [{
                    label: 'Monthly Revenue',
                    data: monthlyData.map(item => item.total_revenue),
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: '#2563eb',
                    borderWidth: 1
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
                                return ' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
        
        // Expense Breakdown Chart
        const expenseData = <?php echo json_encode($expense_breakdown); ?>;
        const expenseCtx = document.getElementById('expenseChart').getContext('2d');
        
        new Chart(expenseCtx, {
            type: 'doughnut',
            data: {
                labels: expenseData.map(item => item.category.charAt(0).toUpperCase() + item.category.slice(1)),
                datasets: [{
                    data: expenseData.map(item => item.total_amount),
                    backgroundColor: [
                        '#ef4444',
                        '#f97316',
                        '#eab308',
                        '#22c55e',
                        '#3b82f6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    </script>
</body>
</html>
