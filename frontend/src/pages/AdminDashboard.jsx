import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchPosts, fetchUsers, deletePost, deleteUser } from '@/services/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Trash2,
    Eye,
    User as UserIcon,
    FileText,
    MessageSquare
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CommentsCount } from '@/utils/CommentsCount';

const AdminDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (isAuthenticated && user?.isAdmin) {
                try {
                    // Load posts
                    setIsLoadingPosts(true);
                    const postsData = await fetchPosts();
                    setPosts(postsData?.posts);
                    setIsLoadingPosts(false);

                    // Load users
                    setIsLoadingUsers(true);
                    const usersData = await fetchUsers();
                    setUsers(usersData?.users);
                    setIsLoadingUsers(false);
                } catch (error) {
                    console.error('Error loading admin data:', error);
                    toast.error('Failed to load data');
                    setIsLoadingPosts(false);
                    setIsLoadingUsers(false);
                }
            }
        };

        loadData();
    }, [isAuthenticated, user]);

    const handleDeletePost = async id => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost(id);
                setPosts(posts.filter(post => post._id !== id));
                toast.success('Post deleted successfully');
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post');
            }
        }
    };

    const handleDeleteUser = async id => {
        if (id === user?._id) {
            toast.error('You cannot delete your own account');
            return;
        }

        if (
            window.confirm(
                'Are you sure you want to delete this user? All their posts will be deleted as well.'
            )
        ) {
            try {
                await deleteUser(id);
                setUsers(users.filter(u => u._id !== id));
                // Also filter out posts by this user
                setPosts(posts.filter(post => post.author._id !== id));
                toast.success('User deleted successfully');
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Failed to delete user');
            }
        }
    };

    // Guard against non-admin access
    if (!isAuthenticated || !user?.isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-gray-600 mb-8">
                    Manage users, posts, and site settings
                </p>

                <Tabs defaultValue="posts" className="w-full">
                    <TabsList className="mb-8 grid w-full grid-cols-2">
                        <TabsTrigger
                            value="posts"
                            className="flex items-center"
                        >
                            <FileText className="h-4 w-4 mr-2" /> Posts
                            Management
                        </TabsTrigger>
                        <TabsTrigger
                            value="users"
                            className="flex items-center"
                        >
                            <UserIcon className="h-4 w-4 mr-2" /> Users
                            Management
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent
                        value="posts"
                        className="bg-white rounded-xl shadow-md"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                All Posts
                            </h2>

                            {isLoadingPosts ? (
                                <div className="animate-pulse space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-16 bg-gray-100 rounded"
                                        ></div>
                                    ))}
                                </div>
                            ) : posts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 text-left">
                                            <tr>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Stats
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {posts.map(post => (
                                                <tr
                                                    key={post?._id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-4">
                                                        <a
                                                            href={`/post/${post?._id}`}
                                                            className="font-medium text-gray-800 hover:text-blog-primary line-clamp-1"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {post?.title}
                                                        </a>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center">
                                                            <Avatar className="h-6 w-6 mr-2">
                                                                <AvatarFallback>
                                                                    {
                                                                        post
                                                                            .author
                                                                            .name[0]
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span>
                                                                {
                                                                    post.author
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-500">
                                                        {formatDistanceToNow(
                                                            new Date(
                                                                post.createdAt
                                                            ),
                                                            { addSuffix: true }
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center space-x-3 text-sm">
                                                            <span className="inline-flex items-center gap-1 text-gray-500">
                                                                <Eye className="h-3 w-3" />
                                                                {post?.likes}
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 text-gray-500">
                                                                <MessageSquare className="h-3 w-3" />
                                                                <CommentsCount
                                                                    post={post}
                                                                />
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    window.open(
                                                                        `/post/${post._id}`,
                                                                        '_blank'
                                                                    )
                                                                }
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    View
                                                                </span>
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        post._id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Delete
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No posts found.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent
                        value="users"
                        className="bg-white rounded-xl shadow-md"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-6">
                                All Users
                            </h2>

                            {isLoadingUsers ? (
                                <div className="animate-pulse space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-16 bg-gray-100 rounded"
                                        ></div>
                                    ))}
                                </div>
                            ) : users.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 text-left">
                                            <tr>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Posts
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Joined
                                                </th>
                                                <th className="px-4 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {users.map(user => {
                                                const userPostCount =
                                                    posts.filter(
                                                        post =>
                                                            post.author._id ===
                                                            user._id
                                                    ).length;
                                                return (
                                                    <tr
                                                        key={user._id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-4 py-4">
                                                            <div className="flex items-center">
                                                                <Avatar className="h-8 w-8 mr-3">
                                                                    <AvatarFallback>
                                                                        {
                                                                            user
                                                                                .name[0]
                                                                        }
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <span className="font-medium">
                                                                    {user.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <span
                                                                className={`px-2 py-1 text-xs rounded-full ${
                                                                    user.isAdmin
                                                                        ? 'bg-purple-100 text-purple-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}
                                                            >
                                                                {user.isAdmin
                                                                    ? 'Admin'
                                                                    : 'User'}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-4 text-center">
                                                            {userPostCount}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-500">
                                                            {formatDistanceToNow(
                                                                new Date(
                                                                    user.createdAt
                                                                ),
                                                                {
                                                                    addSuffix: true
                                                                }
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    user._id ===
                                                                    window
                                                                        .currentUser
                                                                        ?._id
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                                <span className="sr-only">
                                                                    Delete
                                                                </span>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No users found.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default AdminDashboard;
