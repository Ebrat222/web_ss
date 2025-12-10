<?php
// user/login.php
session_start();
require_once __DIR__ . '/../config/db.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $identifier = trim($_POST['identifier'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($identifier === '' || $password === '') {
        $errors[] = 'All fields are required.';
    } else {
        $stmt = $pdo->prepare("SELECT id, username, email, password FROM users WHERE username = :id OR email = :id LIMIT 1");
        $stmt->execute([':id' => $identifier]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            // Login success
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            header('Location: welcome.php');
            exit;
        } else {
            $errors[] = 'Invalid credentials.';
        }
    }
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>User Login</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Login</h1>
    <div><a href="signup.php">Sign up</a> · <a href="../admin/login.php">Admin</a></div>
  </div>

  <?php if ($errors): ?>
    <div class="notice" style="background:#ffecec;color:#b00000;">
      <?php foreach ($errors as $e) echo '<div>' . htmlspecialchars($e) . '</div>'; ?>
    </div>
  <?php endif; ?>

  <form method="post" novalidate>
    <label>Username or Email</label>
    <input type="text" name="identifier" required value="<?php echo htmlspecialchars($_POST['identifier'] ?? '') ?>">
    <label>Password</label>
    <input type="password" name="password" required>
    <button class="btn-primary" type="submit">Login</button>
  </form>
</div>
</body>
</html>
