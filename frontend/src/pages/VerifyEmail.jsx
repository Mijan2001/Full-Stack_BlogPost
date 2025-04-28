import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing');
                return;
            }

            try {
                const response = await fetch(
                    `${
                        import.meta.env.VITE_API_URL ||
                        'http://localhost:5000/api'
                    }/auth/verify-email?token=${token}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage(data.message);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Email verification failed');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                setStatus('error');
                setMessage('An error occurred during email verification');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Email Verification
                        </CardTitle>
                        <CardDescription>
                            Verifying your email address...
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {status === 'loading' && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Loader2 className="h-12 w-12 text-blog-primary animate-spin mb-4" />
                                <p className="text-center text-gray-600">
                                    Verifying your email address...
                                </p>
                            </div>
                        )}

                        {status === 'success' && (
                            <Alert className="bg-green-50 border-green-200 text-green-800">
                                <CheckCircle className="h-4 w-4" />
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}

                        {status === 'error' && (
                            <Alert className="bg-red-50 border-red-200 text-red-800">
                                <XCircle className="h-4 w-4" />
                                <AlertDescription>{message}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        {status !== 'loading' && (
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full"
                            >
                                Go to Login
                            </Button>
                        )}

                        {status === 'error' && (
                            <div className="mt-4 text-center text-sm">
                                Need help?{' '}
                                <Link
                                    to="/"
                                    className="text-blog-primary hover:underline"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default VerifyEmail;
