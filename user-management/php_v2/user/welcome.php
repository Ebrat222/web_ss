<?php
// user/welcome.php
session_start();
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
$username = $_SESSION['username'];
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Welcome</h1>
    <div><a href="logout.php" class="btn-secondary">Logout</a></div>
  </div>

  <div class="notice">Hi <?php echo htmlspecialchars($username); ?> 👋</div>
  <p class="small">This is the welcome page. Add more content here (profile, portfolio, etc.).</p>
</div>
</body>
</html>
