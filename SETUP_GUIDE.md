# Nature's World - Setup Guide

## Initial Setup

Run these commands in order from the project root:

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Setup Environment
```bash
copy .env.example .env
# Or manually:
# - Edit .env and set APP_KEY (or run: php artisan key:generate)
# - Configure DB_CONNECTION (sqlite or mysql)
```

### 3. Database Setup

#### For SQLite (Default):
```bash
php artisan migrate:fresh --seed
```

#### For MySQL:
Update .env with:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=natures_world
DB_USERNAME=root
DB_PASSWORD=
```

Then run:
```bash
php artisan migrate:fresh --seed
```

### 4. Create Admin User

Run this command to create an admin user:
```bash
php artisan tinker
```

Then paste:
```php
$user = new App\Models\User([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'role' => 'admin',
]);
$user->save();
```

### 5. Run Development Servers

**Terminal 1 - PHP Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

## Access the Application

- **Frontend**: http://natures-world.test
- **Admin Panel**: http://natures-world.test/admin
  - Email: admin@example.com
  - Password: password

## Troubleshooting

### 500 Errors on API Calls
- Check `php artisan migrate:fresh` was run
- Verify database connection in .env
- Check Laravel logs: `storage/logs/laravel.log`

### Frontend Errors
- Make sure `npm run dev` is running
- Clear browser cache
- Check browser console for specific errors

### Database Issues
- For SQLite: Ensure `database.sqlite` file exists
- For MySQL: Create database first: `CREATE DATABASE natures_world;`
- Run migrations: `php artisan migrate:fresh`

## Key Endpoints

### Authentication
- POST `/api/login` - Login
- POST `/api/register` - Register
- POST `/api/logout` - Logout
- GET `/api/user` - Get current user

### Admin Routes
- GET `/admin` - Dashboard
- GET `/admin/products` - Products management
- GET `/admin/categories` - Categories management
- GET `/admin/orders` - Orders management
- GET `/admin/inventory` - Inventory management

## Features

✅ User Authentication with Sanctum Tokens
✅ Product Management (CRUD)
✅ Category Management (CRUD)
✅ Order Management with Status Tracking
✅ Inventory Management
✅ Order Slip Printing
✅ Admin Dashboard with Statistics
✅ Role-based Access Control
