<?php
// admin/login.php
session_start();

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === 'admin' && $password === 'admin') {
        session_regenerate_id(true);
        $_SESSION['is_admin'] = true;
        $_SESSION['admin_username'] = 'admin';
        header('Location: dashboard.php');
        exit;
    } else {
        $errors[] = 'Invalid admin credentials.';
    }
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Login</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Admin Login</h1>
    <div><a href="../user/login.php">User</a></div>
  </div>

  <?php if ($errors): ?>
    <div class="notice" style="background:#ffecec;color:#b00000;">
      <?php foreach ($errors as $e) echo '<div>' . htmlspecialchars($e) . '</div>'; ?>
    </div>
  <?php endif; ?>

  <form method="post">
    <label>Username</label>
    <input type="text" name="username" required>
    <label>Password</label>
    <input type="password" name="password" required>
    <button class="btn-primary" type="submit">Login as admin</button>
  </form>
</div>
</body>
</html>
