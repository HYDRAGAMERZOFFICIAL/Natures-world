import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Nature\'s World';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx', { eager: false }),
        ),
    setup({ el, App, props }) {
        const root = ReactDOM.createRoot(el);
        root.render(React.createElement(App, props));
    },
    progress: {
        color: '#4B5563',
        delay: 100,
    },
});
