<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/BG/{file}', function ($file) {
    $path = base_path('BG/' . $file);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
})->where('file', '.*');

Route::get('/', function () {
    return Inertia::render('Landing');
});

Route::get('/shop', function () {
    return Inertia::render('Shop');
})->name('shop');

Route::get('/product/{id}', function ($id) {
    return Inertia::render('ProductDetail', ['productId' => $id]);
})->name('product.detail');

Route::get('/login', function () {
    return Inertia::render('Login');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('Register');
})->name('register');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/cart', function () {
        return Inertia::render('Cart');
    })->name('cart');

    Route::get('/orders', function () {
        return Inertia::render('Orders');
    })->name('orders');

    Route::get('/profile', function () {
        return Inertia::render('Profile');
    })->name('profile');
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::get('/products', function () {
        return Inertia::render('Admin/Products');
    })->name('admin.products');

    Route::get('/categories', function () {
        return Inertia::render('Admin/Categories');
    })->name('admin.categories');

    Route::get('/orders', function () {
        return Inertia::render('Admin/Orders');
    })->name('admin.orders');

    Route::get('/orders/{id}/details', function ($id) {
        return Inertia::render('Admin/OrderDetails', ['orderId' => $id]);
    })->name('admin.order.details');

    Route::get('/inventory', function () {
        return Inertia::render('Admin/Inventory');
    })->name('admin.inventory');
});
