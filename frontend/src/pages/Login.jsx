import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [verificationRequired, setVerificationRequired] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setVerificationRequired(false);

        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage =
                error instanceof Error ? error.message : 'Login failed';

            if (errorMessage.includes('verify your email')) {
                setVerificationRequired(true);
                toast.error('Please verify your email before logging in');
            } else {
                toast.error('Login failed. Please check your credentials.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Log In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {verificationRequired && (
                                <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                                    <Info className="h-4 w-4" />
                                    <AlertDescription>
                                        Your email address hasn't been verified.
                                        Please check your inbox for the
                                        verification email or
                                        <Button
                                            variant="link"
                                            className="p-0 h-auto ml-1 text-yellow-800 underline"
                                            onClick={() =>
                                                navigate('/register')
                                            }
                                        >
                                            register again
                                        </Button>
                                        .
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blog-primary hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col space-y-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Logging in...' : 'Log In'}
                            </Button>

                            <div className="text-center text-sm">
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-blog-primary hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Login;
