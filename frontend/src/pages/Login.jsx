import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [errors, setErrors] = useState(null);

    const onSubmit = async (ev) => {
        ev.preventDefault();
        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };
        setErrors(null);
        try {
            await login(payload);
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setErrors(response.data.errors);
            }
        }
    };

    return (
        <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Or{' '}
                <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                    create a new account
                </Link>
            </p>
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
                {errors && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        {Object.keys(errors).map((key) => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                )}
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <input
                            ref={emailRef}
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <input
                            ref={passwordRef}
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Sign in
                    </button>
                </div>
            </form>
        </div>
    );
}
