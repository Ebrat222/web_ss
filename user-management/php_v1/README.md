# User Management System

A complete user management system built with PHP and MySQL, featuring:

- User authentication (login/register)
- Admin panel with dashboard
- Full CRUD operations for user management
- Search functionality
- Security features
- Responsive design with Bootstrap

## Features

1. **User Authentication**
   - Secure login/logout system
   - User registration with validation
   - Password hashing for security

2. **Admin Panel**
   - Admin dashboard
   - User management (Create, Read, Update, Delete)
   - Search functionality

3. **Security Features**
   - SQL injection prevention
   - XSS protection
   - CSRF protection
   - Secure password storage
   - Session management

## Installation

1. **Prerequisites**
   - PHP 7.4 or higher
   - MySQL 5.7 or higher
   - Web server (Apache, Nginx) or PHP built-in server

2. **Database Setup**
   - Create a MySQL database named `user_management`
   - Execute the SQL commands from `config/database.sql` to create tables and sample data

3. **Configuration**
   - Update database credentials in `config/db.php` if needed

4. **Running the Application**
   - Place the project files in your web server's document root
   - Or use PHP's built-in server: `php -S localhost:8000`
   - Access the application through your browser

## Default Accounts

- **Admin**: 
  - Username: admin
  - Password: admin123

- **Regular User**:
  - Username: user1
  - Password: user123

## File Structure

```
user-management-system/
├── config/
│   ├── db.php          # Database configuration
│   └── database.sql    # Database schema
├── includes/
│   ├── auth.php        # Authentication functions
│   └── security.php    # Security functions
├── pages/
│   ├── admin/
│   │   ├── dashboard.php  # Admin dashboard
│   │   └── edit_user.php  # Edit user page
│   ├── user/
│   │   └── profile.php    # User profile page
│   └── logout.php         # Logout script
├── assets/                # Static assets (CSS, JS, images)
├── index.php              # Entry point
├── login.php              # Login page
└── register.php           # Registration page
```

## Security Measures Implemented

- Prepared statements to prevent SQL injection
- Password hashing with PHP's `password_hash()` function
- XSS prevention with `htmlspecialchars()`
- Session management for authentication
- Secure HTTP headers
- Input validation and sanitization

## Testing

To test the application locally:

1. Start the PHP development server:
   ```
   php -S localhost:8000
   ```

2. Navigate to `http://localhost:8000` in your browser

3. Login with the default admin credentials or register a new account