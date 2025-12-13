import React from 'react';
import { Link } from '@inertiajs/react';

export default function EmptyState({ icon = '📭', title = 'Nothing Here', description = 'No items found', actionText = 'Go Shopping', actionHref = '/shop' }) {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 rounded-2xl shadow-sm border border-gray-200 text-center">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            {actionHref && (
                <Link href={actionHref} className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition">
                    {actionText}
                </Link>
            )}
        </div>
    );
}
