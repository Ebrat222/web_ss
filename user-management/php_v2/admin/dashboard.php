<?php
// admin/dashboard.php
session_start();
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    header('Location: login.php');
    exit;
}
require_once __DIR__ . '/../config/db.php';

$q = trim($_GET['q'] ?? '');

if ($q !== '') {
    $stmt = $pdo->prepare("SELECT id, username, email, created_at FROM users WHERE username LIKE :q OR email LIKE :q ORDER BY id DESC");
    $stmt->execute([':q' => "%$q%"]);
} else {
    $stmt = $pdo->query("SELECT id, username, email, created_at FROM users ORDER BY id DESC");
}
$users = $stmt->fetchAll();
?>
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Admin Dashboard</title>
  <link rel="stylesheet" href="../assets/css/style.css">
  <script src="../assets/js/script.js"></script>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Admin Dashboard</h1>
    <div>
      <a href="create_user.php" class="btn-primary">Create User</a>
      <a href="logout.php" class="btn-secondary">Logout</a>
    </div>
  </div>

  <div class="search-bar">
    <form method="get" style="display:flex; width:100%; gap:8px;">
      <input type="search" name="q" placeholder="Search username or email" value="<?php echo htmlspecialchars($q); ?>">
      <button type="submit" class="btn-primary">Search</button>
      <a href="dashboard.php" class="btn-secondary">Reset</a>
    </form>
  </div>

  <table class="table">
    <thead>
      <tr><th>#</th><th>Username</th><th>Email</th><th>Created</th><th>Actions</th></tr>
    </thead>
    <tbody>
      <?php if (!$users): ?>
        <tr><td colspan="5">No users found.</td></tr>
      <?php else: ?>
        <?php foreach ($users as $u): ?>
          <tr>
            <td><?php echo (int)$u['id']; ?></td>
            <td><?php echo htmlspecialchars($u['username']); ?></td>
            <td><?php echo htmlspecialchars($u['email']); ?></td>
            <td><?php echo htmlspecialchars($u['created_at']); ?></td>
            <td class="actions">
              <a href="update_user.php?id=<?php echo $u['id']; ?>">Edit</a>
              <a href="delete_user.php?id=<?php echo $u['id']; ?>&username=<?php echo urlencode($u['username']); ?>"
                 onclick="return confirmDelete('<?php echo htmlspecialchars($u['username']); ?>')" style="color:#e04b4b;">Delete</a>
            </td>
          </tr>
        <?php endforeach; ?>
      <?php endif; ?>
    </tbody>
  </table>

</div>
</body>
</html>
