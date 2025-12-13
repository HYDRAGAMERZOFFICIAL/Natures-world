<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
