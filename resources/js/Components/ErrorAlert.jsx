import React from 'react';

export default function ErrorAlert({ message, onDismiss }) {
    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm mb-6">
            <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div className="flex-1">
                    <p className="text-red-800 font-semibold">Error</p>
                    <p className="text-red-700 text-sm">{message}</p>
                </div>
                {onDismiss && (
                    <button onClick={onDismiss} className="text-red-500 hover:text-red-700">✕</button>
                )}
            </div>
        </div>
    );
}
