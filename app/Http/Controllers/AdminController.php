<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if ($request->user()->role !== 'admin') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            return $next($request);
        });
    }

    public function dashboard()
    {
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');
        $pendingOrders = Order::where('status', 'pending')->count();
        $processingOrders = Order::where('status', 'processing')->count();
        $completedOrders = Order::where('status', 'completed')->count();
        $lowStockProducts = Product::where('quantity', '<', 10)->count();

        return response()->json([
            'stats' => [
                'total_products' => Product::count(),
                'total_categories' => Category::count(),
                'total_orders' => Order::count(),
                'total_users' => User::count(),
                'total_revenue' => $totalRevenue,
                'pending_orders' => $pendingOrders,
                'processing_orders' => $processingOrders,
                'completed_orders' => $completedOrders,
                'low_stock_products' => $lowStockProducts,
            ],
            'recent_orders' => Order::with('user', 'items.product')->latest()->limit(5)->get(),
            'recent_products' => Product::with('category')->latest()->limit(5)->get(),
        ]);
    }

    public function listProducts(Request $request)
    {
        $search = $request->query('search', '');
        $category = $request->query('category');
        
        $query = Product::with('category');
        
        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
        }
        
        if ($category) {
            $query->where('category_id', $category);
        }
        
        return response()->json($query->paginate(15));
    }

    public function createProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|unique:products|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'image' => 'nullable|string',
        ]);

        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'string|max:255',
            'slug' => 'unique:products,slug,' . $id . '|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'quantity' => 'integer|min:0',
            'category_id' => 'exists:categories,id',
            'image' => 'nullable|string',
        ]);

        $product->update($request->all());
        return response()->json($product);
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }

    public function listCategories(Request $request)
    {
        $search = $request->query('search', '');
        
        $query = Category::with('products');
        
        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
        }
        
        return response()->json($query->paginate(15));
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:categories|max:255',
            'slug' => 'required|unique:categories|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $category = Category::create($request->all());
        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $request->validate([
            'name' => 'unique:categories,name,' . $id . '|max:255',
            'slug' => 'unique:categories,slug,' . $id . '|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $category->update($request->all());
        return response()->json($category);
    }

    public function deleteCategory($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }

    public function listOrders(Request $request)
    {
        $status = $request->query('status');
        $search = $request->query('search', '');
        
        $query = Order::with('user', 'items.product');
        
        if ($status) {
            $query->where('status', $status);
        }
        
        if ($search) {
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }
        
        return response()->json($query->latest()->paginate(15));
    }

    public function getOrder($id)
    {
        $order = Order::with('user', 'items.product')->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled,shipped',
        ]);

        $order->update(['status' => $request->status]);
        return response()->json($order);
    }

    public function getInventory(Request $request)
    {
        $search = $request->query('search', '');
        $category = $request->query('category');
        $lowStock = $request->query('low_stock', false);
        
        $query = Product::with('category');
        
        if ($search) {
            $query->where('name', 'like', "%$search%");
        }
        
        if ($category) {
            $query->where('category_id', $category);
        }
        
        if ($lowStock) {
            $query->where('quantity', '<', 10);
        }
        
        return response()->json($query->paginate(15));
    }

    public function updateInventory(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $request->validate([
            'quantity' => 'required|integer|min:0',
        ]);

        $product->update(['quantity' => $request->quantity]);
        return response()->json($product);
    }

    public function generateOrderSlip($id)
    {
        $order = Order::with('user', 'items.product')->find($id);
        if (!$order) {
            return response()->json(['error' => 'Order not found'], 404);
        }

        $slip = [
            'order_id' => str_pad($order->id, 8, '0', STR_PAD_LEFT),
            'order_date' => $order->created_at->format('Y-m-d H:i:s'),
            'customer' => [
                'name' => $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->user->phone,
                'address' => $order->shipping_address,
            ],
            'items' => $order->items->map(function($item) {
                return [
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'total' => $item->quantity * $item->unit_price,
                ];
            }),
            'totals' => [
                'subtotal' => $order->total_amount,
                'tax' => $order->total_amount * 0.1,
                'grand_total' => $order->total_amount * 1.1,
            ],
            'payment_method' => $order->payment_method,
            'status' => $order->status,
        ];

        return response()->json($slip);
    }

    public function getDashboardStats()
    {
        $today = now()->startOfDay();
        
        return response()->json([
            'sales_today' => Order::where('status', 'completed')
                ->whereDate('created_at', $today)
                ->sum('total_amount'),
            'orders_today' => Order::whereDate('created_at', $today)->count(),
            'orders_this_month' => Order::whereMonth('created_at', now()->month)->count(),
            'revenue_this_month' => Order::where('status', 'completed')
                ->whereMonth('created_at', now()->month)
                ->sum('total_amount'),
            'top_products' => Product::with('orderItems')
                ->withCount('orderItems as total_sold')
                ->orderBy('total_sold', 'desc')
                ->limit(10)
                ->get(),
        ]);
    }
}
