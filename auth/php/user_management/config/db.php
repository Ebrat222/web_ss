<?php
// config/db.php
// Edit these to match your local XAMPP MySQL settings
$DB_HOST = '127.0.0.1';
$DB_NAME = 'project_db';
$DB_USER = 'root';
$DB_PASS = ''; // XAMPP default: empty

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, $options);
} catch (Exception $e) {
    // In production, don't echo errors. This is for local dev.
    die('Database connection failed: ' . $e->getMessage());
}
