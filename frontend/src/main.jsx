import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserCommentProvider } from './contexts/UserCommentContext';
import { AuthProvider } from '@/contexts/AuthContext';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <UserCommentProvider>
                <TooltipProvider>
                    <Toaster />
                    <App />
                </TooltipProvider>
            </UserCommentProvider>
        </AuthProvider>
    </QueryClientProvider>
);
