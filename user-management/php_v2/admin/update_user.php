<?php
// admin/update_user.php
session_start();
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    header('Location: login.php');
    exit;
}
require_once __DIR__ . '/../config/db.php';

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    header('Location: dashboard.php');
    exit;
}

$stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE id = :id LIMIT 1");
$stmt->execute([':id' => $id]);
$user = $stmt->fetch();
if (!$user) {
    header('Location: dashboard.php');
    exit;
}

$errors = [];
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $email === '') {
        $errors[] = 'Username and email are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Invalid email.';
    } else {
        // check uniqueness except current user
        $stmt = $pdo->prepare("SELECT id FROM users WHERE (username = :u OR email = :e) AND id != :id LIMIT 1");
        $stmt->execute([':u' => $username, ':e' => $email, ':id' => $id]);
        if ($stmt->fetch()) {
            $errors[] = 'Username or email already in use by another account.';
        } else {
            if ($password !== '') {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $upd = $pdo->prepare("UPDATE users SET username = :u, email = :e, password = :p WHERE id = :id");
                $upd->execute([':u'=>$username, ':e'=>$email, ':p'=>$hash, ':id'=>$id]);
            } else {
                $upd = $pdo->prepare("UPDATE users SET username = :u, email = :e WHERE id = :id");
                $upd->execute([':u'=>$username, ':e'=>$email, ':id'=>$id]);
            }
            $success = 'User updated.';
            // refresh user data
            $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE id = :id LIMIT 1");
            $stmt->execute([':id' => $id]);
            $user = $stmt->fetch();
        }
    }
}
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Edit User</title>
  <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Edit User</h1>
    <div><a href="dashboard.php">Back</a></div>
  </div>

  <?php if ($errors): ?>
    <div class="notice" style="background:#ffecec;color:#b00000;">
      <?php foreach ($errors as $e) echo '<div>' . htmlspecialchars($e) . '</div>'; ?>
    </div>
  <?php endif; ?>
  <?php if ($success): ?>
    <div class="notice"><?php echo htmlspecialchars($success); ?></div>
  <?php endif; ?>

  <form method="post">
    <label>Username</label>
    <input type="text" name="username" required value="<?php echo htmlspecialchars($user['username']); ?>">
    <label>Email</label>
    <input type="email" name="email" required value="<?php echo htmlspecialchars($user['email']); ?>">
    <label>New Password <span class="small">(leave blank to keep current)</span></label>
    <input type="password" name="password">
    <button class="btn-primary" type="submit">Save changes</button>
  </form>
</div>
</body>
</html>
