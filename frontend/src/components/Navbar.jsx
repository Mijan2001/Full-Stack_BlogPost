import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchUserById } from './../services/api';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const [userProfile, setUserProfile] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearch = e => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(
                searchQuery
            )}`;
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (user?._id) {
                const response = await fetchUserById(user._id);
                setUserProfile(response);
            }
        };
        fetchUserProfile();
    }, [user?._id]);

    return (
        <nav className="bg-gray-900 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
                {/* Left Section */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-blue-500 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        BlogPost
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-gray-600 dark:text-gray-300 text-sm font-medium">
                        <Link
                            to="/"
                            className="hover:text-blue-500 text-white dark:hover:text-blue-400 transition-colors"
                        >
                            Home
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className="hover:text-blue-500 text-white dark:hover:text-blue-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="hover:text-blue-500 text-white dark:hover:text-blue-400 transition-colors"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="relative hidden md:block"
                    >
                        <Input
                            type="search"
                            placeholder="Search posts..."
                            className="w-52 pr-10 bg-gray-200 dark:bg-gray-700 placeholder-gray-600 dark:placeholder-gray-400 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link to="/new-post">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-500 dark:border-blue-400 text-blue-500 dark:text-blue-400 hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white"
                                    >
                                        Write
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="text-gray-100 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                >
                                    Logout
                                </Button>
                                <Link
                                    to={`/profile/${user?._id}`}
                                    className="flex items-center"
                                >
                                    {userProfile?.profileImage ? (
                                        <img
                                            src={userProfile.profileImage}
                                            alt={userProfile.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 hover:scale-105 transition-transform"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-blue-500 dark:border-blue-400">
                                            <User className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                        </div>
                                    )}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-gray-200 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        size="sm"
                                        className="bg-blue-500 dark:bg-blue-400 text-white hover:bg-blue-600 dark:hover:bg-blue-500"
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-200 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex flex-col items-start px-4 py-3 gap-3">
                        <Link
                            to="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            Home
                        </Link>
                        {isAuthenticated && (
                            <Link
                                to="/dashboard"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                        {user?.isAdmin && (
                            <Link
                                to="/admin"
                                className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
