import { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axios';

const AuthContext = createContext({
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
    login: () => { },
    register: () => { },
    logout: () => { },
    csrf: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    };

    const csrf = async () => {
        await axiosClient.get('/sanctum/csrf-cookie');
    };

    const login = async ({ email, password }) => {
        await csrf();
        const response = await axiosClient.post('/auth/login', { email, password });
        setUser(response.data.user);
        setToken(response.data.access_token);
    };

    const register = async ({ name, email, password, password_confirmation }) => {
        await csrf();
        const response = await axiosClient.post('/auth/register', {
            name,
            email,
            password,
            password_confirmation,
        });
        setUser(response.data.user);
        setToken(response.data.access_token);
    };

    const logout = async () => {
        await axiosClient.post('/auth/logout');
        setUser(null);
        setToken(null);
    };

    useEffect(() => {
        if (token) {
            axiosClient.get('/auth/me')
                .then(({ data }) => {
                    setUser(data);
                })
                .catch(() => {
                    setToken(null);
                });
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            setUser,
            setToken,
            login,
            register,
            logout,
            csrf
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
