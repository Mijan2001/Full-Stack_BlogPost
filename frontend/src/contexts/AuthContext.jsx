import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('blogToken');
        const storedUser = localStorage.getItem('blogUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    const register = async (name, email, password) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                }/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                const errorMsg = data.message || 'Registration failed';
                throw new Error(errorMsg);
            }

            return data;
        } catch (error) {
            console.error('Registration error:', error);

            if (
                error instanceof Error &&
                (error.message.includes('email') ||
                    error.message.includes('Failed to send') ||
                    error.message.includes('Invalid login'))
            ) {
                throw new Error(
                    'Registration submitted, but there was an issue sending the verification email. ' +
                        'Please contact the administrator to verify your account.'
                );
            }

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                }/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('blogToken', data.token);
            localStorage.setItem('blogUser', JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            toast.success('Login successful!');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('blogToken');
        localStorage.removeItem('blogUser');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    // FORGOT PASSWORD
    const forgotPassword = async email => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset email');
            }

            toast.success('Password reset email sent!');
        } catch (error) {
            console.error('Forgot Password Error:', error);
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (newPassword, token) => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/auth/reset-password?token=${token}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password: newPassword })
                }
            );

            const data = await response.json();
            console.log('Reset Password API Response ==>', data);

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to reset password');
            }

            return true; // ✅ Success
        } catch (error) {
            console.error('Reset Password Error:', error);
            return false; // ✅ Failure
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        token,
        isLoading,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!token,
        isAdmin: user?.isAdmin || false
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
