<?php
session_start();

// Function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Function to check if user is admin
function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// Function to redirect to login page if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit();
    }
}

// Function to redirect to home page if already logged in
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        if (isAdmin()) {
            header('Location: pages/admin/dashboard.php');
        } else {
            header('Location: pages/user/profile.php');
        }
        exit();
    }
}

// Function to logout user
function logout() {
    session_destroy();
    header('Location: ../login.php');
    exit();
}
?>