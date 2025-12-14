<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateUser']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    
    Route::apiResource('orders', OrderController::class);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);
    
    Route::get('/products', [AdminController::class, 'listProducts']);
    Route::post('/products', [AdminController::class, 'createProduct']);
    Route::put('/products/{id}', [AdminController::class, 'updateProduct']);
    Route::delete('/products/{id}', [AdminController::class, 'deleteProduct']);
    
    Route::get('/categories', [AdminController::class, 'listCategories']);
    Route::post('/categories', [AdminController::class, 'createCategory']);
    Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);
    
    Route::get('/orders', [AdminController::class, 'listOrders']);
    Route::get('/orders/{id}', [AdminController::class, 'getOrder']);
    Route::put('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
    Route::get('/orders/{id}/slip', [AdminController::class, 'generateOrderSlip']);
    
    Route::get('/inventory', [AdminController::class, 'getInventory']);
    Route::put('/inventory/{id}', [AdminController::class, 'updateInventory']);
});
