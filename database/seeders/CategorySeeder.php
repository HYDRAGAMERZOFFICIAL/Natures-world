<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Skincare - Face Care',
                'slug' => 'skincare-face-care',
                'description' => 'Premium herbal face cleansers, masks, exfoliators, and serums for all skin types',
                'image' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
            ],
            [
                'name' => 'Lip Care',
                'slug' => 'lip-care',
                'description' => 'Natural lip balms, scrubs, and tints with organic ingredients',
                'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
            ],
            [
                'name' => 'Eye Makeup',
                'slug' => 'eye-makeup',
                'description' => 'Natural eyeliners, mascaras, and eyebrow products with herbal ingredients',
                'image' => 'https://images.unsplash.com/photo-1516672511211-a5437a6fc4ef?w=500',
            ],
            [
                'name' => 'Face Makeup',
                'slug' => 'face-makeup',
                'description' => 'Organic foundations, powders, blush, and highlighters',
                'image' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
            ],
            [
                'name' => 'Body Care',
                'slug' => 'body-care',
                'description' => 'Body butters, scrubs, and bath products with natural formulations',
                'image' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
            ],
            [
                'name' => 'Hair Care',
                'slug' => 'hair-care',
                'description' => 'Herbal hair masks, nourishing oils, and natural styling products',
                'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
            ],
            [
                'name' => 'Wellness & Aromatherapy',
                'slug' => 'wellness-aromatherapy',
                'description' => 'Therapeutic roll-ons, essential oil perfumes, and healing balms',
                'image' => 'https://images.unsplash.com/photo-1600857062241-98e5dba7214e?w=500',
            ],
            [
                'name' => 'Freeze-Dried Specialty',
                'slug' => 'freeze-dried-specialty',
                'description' => 'Premium freeze-dried powders for long shelf life and potency',
                'image' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
            ],
            [
                'name' => 'DIY Skincare Kits',
                'slug' => 'diy-skincare-kits',
                'description' => 'Create your own skincare with our DIY kits and ingredient packs',
                'image' => 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500',
            ],
            [
                'name' => 'Combo Packs',
                'slug' => 'combo-packs',
                'description' => 'Complete skincare routines, gift boxes, and starter kits',
                'image' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
