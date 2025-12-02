<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::with('children')->whereNull('parent_id')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:categories',
        ]);

        $category = Category::create($request->all());
        return response()->json($category, 201);
    }

    public function show($id)
    {
        return Category::with('children')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->json(null, 204);
    }
}
