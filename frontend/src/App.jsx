// import { Toaster } from '@/components/ui/toaster';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
    Navigate
} from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import PostPage from './pages/PostPage';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';

import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';

const App = () => {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="post/:id" element={<PostPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route
                        path="/profile/:id"
                        element={
                            isAuthenticated ? (
                                <Profile />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />
                    <Route
                        path="forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route path="reset-password" element={<ResetPassword />} />

                    <Route path="verify-email" element={<VerifyEmail />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="new-post" element={<NewPost />} />
                    <Route path="edit-post/:id" element={<EditPost />} />
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="search" element={<SearchResults />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
