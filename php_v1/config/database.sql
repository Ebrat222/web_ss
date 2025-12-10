-- Database: user_management
-- Table structure for table `users`

CREATE DATABASE IF NOT EXISTS user_management;
USE user_management;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- Insert sample admin user (password is 'admin123' hashed with password_hash())
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@example.com', '$2y$10$4J3NtU/.Ea6E5SN.E.0.7uOvQbAD.W.Q.QQ9.Li/R3n.V/P4WbR7G', 'admin');

-- Insert sample regular user (password is 'user123' hashed with password_hash())
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('user1', 'user1@example.com', '$2y$10$DzJfLCJ8c6/IYDtbPDVYeeBQfZh.HrOMd5oLqzH/L/LAalhdx6b5.', 'user');