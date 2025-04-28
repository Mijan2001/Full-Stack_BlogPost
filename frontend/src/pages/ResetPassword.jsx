import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { resetPassword, isLoading } = useAuth();
    const [password, setPassword] = useState('');
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async e => {
        e.preventDefault();

        if (!token) {
            toast.error('Invalid or expired token. Please try again.');
            return;
        }

        try {
            const success = await resetPassword(password, token);
            console.log('Password reset success==>', success);

            if (success) {
                toast.success('Password reset successful!');
                navigate('/login');
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Reset Password
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-700"
                        >
                            New Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
