import React from 'react';

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-96">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-600 border-r-teal-600 animate-spin"></div>
            </div>
            <span className="ml-4 text-gray-600 font-medium">Loading...</span>
        </div>
    );
}
