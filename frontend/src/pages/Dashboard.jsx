import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchPosts, deletePost, fetchCommentsByPostId } from '@/services/api';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PenLine, Trash2, Clock, ThumbsUp, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CommentsCount } from '@/utils/CommentsCount';

const Dashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setIsLoading(true);
                const allPosts = await fetchPosts();

                console.log('dashboard allPosts==', allPosts);

                // Filter for the user's posts only
                const userPosts = allPosts?.posts?.filter(
                    post => post?.author?._id === user?._id || user?.isAdmin
                );

                setPosts(userPosts);
            } catch (error) {
                console.error('Error fetching user posts:', error);
                toast.error('Failed to load your posts');
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            loadPosts();
        }
        const fetchCommentCount = async () => {};
        fetchCommentCount();
    }, [isAuthenticated, user, posts?._id]);

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

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Dashboard
                        </h1>
                        <p className="text-gray-600">
                            Manage your blog posts and account
                        </p>
                    </div>

                    <Link to="/new-post">
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                            <PenLine className="mr-2 h-4 w-4" /> Create New Post
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800">
                            Your Posts
                        </h2>

                        {isLoading ? (
                            <div className="animate-pulse space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-gray-100 rounded"
                                    ></div>
                                ))}
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-100 text-left">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                                Stats
                                            </th>
                                            <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {posts.map(post => {
                                            return (
                                                <tr
                                                    key={post?._id}
                                                    className="hover:bg-gray-50 transition-colors"
                                                >
                                                    <td className="px-4 py-3">
                                                        <Link
                                                            to={`/post/${post._id}`}
                                                            className="font-medium text-blue-600 hover:text-blue-800 transition-colors line-clamp-1"
                                                        >
                                                            {post?.title}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Clock className="h-3 w-3 mr-1 text-gray-400" />
                                                            {formatDistanceToNow(
                                                                new Date(
                                                                    post.createdAt
                                                                ),
                                                                {
                                                                    addSuffix: true
                                                                }
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <span className="flex items-center text-gray-500">
                                                                <ThumbsUp className="h-3 w-3 mr-1 text-gray-400" />
                                                                {post?.likes}
                                                            </span>
                                                            <span className="flex items-center text-gray-500">
                                                                <Eye className="h-3 w-3 mr-1 text-gray-400" />
                                                                <CommentsCount
                                                                    post={post}
                                                                />
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex space-x-2">
                                                            <Link
                                                                to={`/edit-post/${post._id}`}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-colors"
                                                                >
                                                                    <PenLine className="h-4 w-4" />
                                                                    <span className="sr-only">
                                                                        Edit
                                                                    </span>
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="border-gray-300 text-red-500 hover:border-red-600 hover:text-red-600 transition-colors"
                                                                onClick={() =>
                                                                    handleDeletePost(
                                                                        post?._id
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
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">
                                    You don't have any posts yet.
                                </p>
                                <Link to="/new-post">
                                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                        Create Your First Post
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
