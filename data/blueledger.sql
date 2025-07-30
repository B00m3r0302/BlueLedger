-- BlueLedger Database Schema and Sample Data
-- Educational vulnerability demonstration - DO NOT USE IN PRODUCTION

CREATE DATABASE IF NOT EXISTS blueledger;
USE blueledger;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Precursor types table
CREATE TABLE precursor_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    chemical_formula VARCHAR(50),
    controlled_substance BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    country VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vendor_id INT,
    invoice_number VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL
);

-- Shipments table
CREATE TABLE shipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT,
    precursor_type_id INT,
    quantity DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) DEFAULT 'kg',
    unit_price DECIMAL(10,2) NOT NULL,
    origin_country VARCHAR(50),
    destination_country VARCHAR(50),
    shipment_date DATE,
    delivery_date DATE,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (precursor_type_id) REFERENCES precursor_types(id) ON DELETE SET NULL
);

-- Expenses table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    category ENUM('transport', 'storage', 'equipment', 'personnel', 'other') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    expense_date DATE NOT NULL,
    invoice_id INT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

-- Sample Data
INSERT INTO users (username, password_hash, role) VALUES
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('carlos', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('maria', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('pedermo', '$2y$10$0aGH4KOUwb7B5ayx3p50OOStNxhXbTAYoTtRONJGFGLq9Hz434292', 'user');

INSERT INTO precursor_types (name, chemical_formula, controlled_substance, notes) VALUES
('Pseudoephedrine', 'C10H15NO', TRUE, 'Schedule III controlled substance'),
('Ephedrine', 'C10H15NO', TRUE, 'Schedule III controlled substance'),
('Phenylacetic Acid', 'C8H8O2', TRUE, 'List I chemical'),
('Acetic Anhydride', 'C4H6O3', TRUE, 'List II chemical'),
('Methylamine', 'CH5N', TRUE, 'List I chemical'),
('Benzyl Methyl Ketone', 'C9H10O', TRUE, 'List I chemical'),
('Potassium Permanganate', 'KMnO4', TRUE, 'List II chemical'),
('Acetone', 'C3H6O', FALSE, 'Common solvent - monitored'),
('Toluene', 'C7H8', FALSE, 'Organic solvent - monitored'),
('Hydrochloric Acid', 'HCl', FALSE, 'Strong acid - monitored');

INSERT INTO vendors (name, contact_person, email, phone, address, country) VALUES
('Global Chemical Supply Ltd', 'Juan Rodriguez', 'j.rodriguez@globalchem.mx', '+52-555-123-4567', 'Av. Industrial 1234, Mexico City', 'Mexico'),
('European Fine Chemicals', 'Hans Mueller', 'h.mueller@efc-berlin.de', '+49-30-987-6543', 'Industriestraße 45, Berlin', 'Germany'),
('Asian Pacific Trading', 'Li Wei', 'l.wei@aptrading.cn', '+86-21-5555-1234', 'Shanghai Industrial Zone, Block 7', 'China'),
('South American Imports', 'Carlos Mendoza', 'c.mendoza@saimports.co', '+57-1-444-5678', 'Zona Franca, Bogotá', 'Colombia'),
('Mediterranean Chemicals', 'Giuseppe Romano', 'g.romano@medchem.it', '+39-02-333-4567', 'Via Industriale 89, Milan', 'Italy');

INSERT INTO invoices (vendor_id, invoice_number, invoice_date, total_amount, status, notes) VALUES
(1, 'GCS-2024-001', '2024-01-15', 45000.00, 'paid', 'Bulk pseudoephedrine shipment'),
(2, 'EFC-2024-012', '2024-01-22', 28000.00, 'paid', 'High purity ephedrine'),
(3, 'APT-2024-003', '2024-02-05', 67000.00, 'pending', 'Mixed precursor chemicals'),
(4, 'SAI-2024-007', '2024-02-10', 35000.00, 'paid', 'Phenylacetic acid compound'),
(5, 'MC-2024-015', '2024-02-18', 52000.00, 'overdue', 'Methylamine solution'),
(1, 'GCS-2024-008', '2024-03-01', 38000.00, 'paid', 'Acetic anhydride'),
(3, 'APT-2024-011', '2024-03-15', 71000.00, 'pending', 'Large scale precursor order');

INSERT INTO shipments (invoice_id, precursor_type_id, quantity, unit_price, origin_country, destination_country, shipment_date, delivery_date, tracking_number) VALUES
(1, 1, 500.000, 90.00, 'Mexico', 'USA', '2024-01-20', '2024-01-25', 'GCS-PSE-240120-001'),
(2, 2, 300.000, 93.33, 'Germany', 'USA', '2024-01-28', '2024-02-02', 'EFC-EPH-240128-012'),
(3, 3, 200.000, 150.00, 'China', 'USA', '2024-02-12', NULL, 'APT-PAA-240212-003'),
(3, 5, 150.000, 220.00, 'China', 'USA', '2024-02-12', NULL, 'APT-MET-240212-004'),
(4, 3, 233.333, 150.00, 'Colombia', 'USA', '2024-02-15', '2024-02-22', 'SAI-PAA-240215-007'),
(5, 5, 236.364, 220.00, 'Italy', 'USA', '2024-02-25', NULL, 'MC-MET-240225-015'),
(6, 4, 380.000, 100.00, 'Mexico', 'USA', '2024-03-05', '2024-03-12', 'GCS-AA-240305-008'),
(7, 1, 400.000, 90.00, 'China', 'USA', '2024-03-20', NULL, 'APT-PSE-240320-011'),
(7, 6, 177.500, 280.00, 'China', 'USA', '2024-03-20', NULL, 'APT-BMK-240320-012');

INSERT INTO expenses (description, category, amount, expense_date, invoice_id, notes) VALUES
('Customs clearance fees', 'transport', 2500.00, '2024-01-25', 1, 'Port of Long Beach'),
('Cold storage facility rental', 'storage', 5000.00, '2024-02-01', NULL, 'Monthly storage costs'),
('Security transport service', 'transport', 8000.00, '2024-02-02', 2, 'Armored vehicle service'),
('Laboratory equipment maintenance', 'equipment', 3500.00, '2024-02-10', NULL, 'Quarterly maintenance'),
('Personnel training', 'personnel', 4000.00, '2024-02-15', NULL, 'Safety and handling training'),
('Insurance premium', 'other', 12000.00, '2024-03-01', NULL, 'Quarterly insurance payment'),
('Freight forwarding', 'transport', 6500.00, '2024-03-12', 6, 'Express shipping'),
('Quality testing', 'other', 2800.00, '2024-03-15', NULL, 'Third-party lab analysis');
