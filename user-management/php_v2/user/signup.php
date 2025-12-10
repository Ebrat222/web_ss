<?php
// user/signup.php
session_start();
require_once __DIR__ . '/../config/db.php';

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $email === '' || $password === '') {
        $errors[] = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email address.';
    } else {
        // Check uniqueness
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :u OR email = :e LIMIT 1");
        $stmt->execute([':u' => $username, ':e' => $email]);
        if ($stmt->fetch()) {
            $errors[] = 'Username or email already exists.';
        } else {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            $ins = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (:u, :e, :p)");
            $ins->execute([':u' => $username, ':e' => $email, ':p' => $hash]);
            $success = 'Account created. You can now log in.';
        }
    }
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Sign up</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Sign up</h1>
    <div><a href="login.php">Login</a> · <a href="../admin/login.php">Admin</a></div>
  </div>

  <?php if ($errors): ?>
    <div class="notice" style="background:#ffecec;color:#b00000;">
      <?php foreach ($errors as $e) echo '<div>' . htmlspecialchars($e) . '</div>'; ?>
    </div>
  <?php endif; ?>

  <?php if ($success): ?>
    <div class="notice"><?php echo htmlspecialchars($success); ?></div>
  <?php endif; ?>

  <form method="post" novalidate>
    <label>Username</label>
    <input type="text" name="username" required value="<?php echo htmlspecialchars($_POST['username'] ?? '') ?>">
    <label>Email</label>
    <input type="email" name="email" required value="<?php echo htmlspecialchars($_POST['email'] ?? '') ?>">
    <label>Password</label>
    <input type="password" name="password" required>
    <button class="btn-primary" type="submit">Create account</button>
  </form>
</div>
</body>
</html>
