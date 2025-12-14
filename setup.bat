@echo off
echo ======================================
echo Nature's World - Setup Script
echo ======================================

echo.
echo Step 1: Installing Composer Dependencies...
composer install

echo.
echo Step 2: Installing NPM Dependencies...
call npm install

echo.
echo Step 3: Generating APP_KEY...
php artisan key:generate

echo.
echo Step 4: Running Database Migrations...
php artisan migrate:fresh --seed

echo.
echo Step 5: Creating Admin User...
php artisan tinker << 'EOF'
$user = new App\Models\User([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin',
]);
$user->save();
echo "Admin user created!\n";
EOF

echo.
echo ======================================
echo Setup Complete!
echo ======================================
echo.
echo To start the development server:
echo   Terminal 1: php artisan serve
echo   Terminal 2: npm run dev
echo.
echo Access the application at:
echo   Frontend: http://natures-world.test
echo   Admin: http://natures-world.test/admin
echo.
echo Admin credentials:
echo   Email: admin@example.com
echo   Password: admin123
echo.
pause
