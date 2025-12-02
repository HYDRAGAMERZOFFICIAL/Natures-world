<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product')->latest()->paginate(10);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'total_amount' => 'required|numeric',
        ]);

        return DB::transaction(function () use ($request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_amount' => $request->total_amount,
                'shipping_address' => $request->shipping_address,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'], // Should verify price from DB in real app
                ]);
            }

            return response()->json($order->load('items'), 201);
        });
    }

    public function show(Request $request, $id)
    {
        return $request->user()->orders()->with('items.product')->findOrFail($id);
    }
}
