<header class="main-header">
    <nav class="navbar">
        <div class="nav-brand">
            <a href="dashboard.php"><?php echo SITE_NAME; ?></a>
        </div>
        
        <ul class="nav-menu">
            <li><a href="dashboard.php">Dashboard</a></li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle">Manage</a>
                <ul class="dropdown-menu">
                    <li><a href="precursor_types/">Precursor Types</a></li>
                    <li><a href="vendors/">Vendors</a></li>
                    <li><a href="invoices/">Invoices</a></li>
                    <li><a href="shipments/">Shipments</a></li>
                    <li><a href="expenses/">Expenses</a></li>
                </ul>
            </li>
            <li><a href="reports/">Reports</a></li>
        </ul>
        
        <div class="nav-user">
            <span>Welcome, <?php echo sanitizeOutput($_SESSION['username']); ?></span>
            <a href="logout.php" class="btn btn-outline">Logout</a>
        </div>
    </nav>
</header>
