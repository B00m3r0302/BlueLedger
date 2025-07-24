<?php
require_once 'database.php';

class Auth {
    private $db;
    
    public function __construct() {
        $this->db = (new Database())->getConnection();
    }
    
    public function login($username, $password) {
        $stmt = $this->db->prepare("SELECT id, username, password_hash, role FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password_hash'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            return true;
        }
        return false;
    }
    
    public function logout() {
        session_destroy();
    }
    
    public function isLoggedIn() {
        return isset($_SESSION['user_id']);
    }
    
    public function requireLogin() {
        if (!$this->isLoggedIn()) {
            header('Location: https://blueledger.example.com/login.php');
            exit;
        }
    }
    
    public function requireAdmin() {
        $this->requireLogin();
        if ($_SESSION['role'] !== 'admin') {
            header('Location: https://blueledger.example.com/dashboard.php');
            exit;
        }
    }
}
?>
