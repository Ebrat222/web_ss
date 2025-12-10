<?php
require_once 'includes/auth.php';

// Redirect based on login status
if (isLoggedIn()) {
    if (isAdmin()) {
        header('Location: pages/admin/dashboard.php');
    } else {
        header('Location: pages/user/profile.php');
    }
} else {
    header('Location: login.php');
}
exit();
?>