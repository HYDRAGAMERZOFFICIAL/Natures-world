import { useState, useEffect } from 'react';

const cache = new Map();
const cacheTTL = 5 * 60 * 1000;

export function useFetchCache(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cacheKey = url + JSON.stringify(options);
        const cachedData = cache.get(cacheKey);
        const now = Date.now();

        if (cachedData && now - cachedData.timestamp < cacheTTL) {
            setData(cachedData.value);
            setLoading(false);
            return;
        }

        let isMounted = true;

        const fetchData = async () => {
            try {
                const headers = options.headers || {};
                const token = localStorage.getItem('token');
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(url, { ...options, headers });
                const result = await response.json();

                if (!isMounted) return;

                if (response.ok) {
                    cache.set(cacheKey, { value: result, timestamp: Date.now() });
                    setData(result);
                    setError(null);
                } else {
                    setError(result.error || 'Failed to fetch');
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, options]);

    return { data, loading, error };
}
