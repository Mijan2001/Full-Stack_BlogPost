import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    fetchPostById,
    likePost,
    dislikePost,
    deletePost
} from '@/services/api';

import { useAuth } from '@/contexts/AuthContext';
import CommentSection from '@/components/CommentSection';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
    ThumbsUp,
    ThumbsDown,
    Edit,
    Trash2,
    Clock,
    ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import Spinner from '../components/ui/Spinner';

const PostHeader = ({ post, canEditDelete, isAuthor, setDeleteDialogOpen }) => (
    <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <Avatar>
                <AvatarFallback>{post?.author?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-medium">{post?.author?.name}</p>
                <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(post.createdAt), {
                        addSuffix: true
                    })}
                </div>
            </div>
        </div>

        {canEditDelete && (
            <div className="flex gap-2">
                {isAuthor && (
                    <Link to={`/edit-post/${post._id}`}>
                        <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                    </Link>
                )}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
            </div>
        )}
    </div>
);

const PostActions = ({ post, handleLike, handleDislike }) => (
    <div className="flex items-center gap-6 border-t border-b py-4 my-6">
        <Button
            variant="ghost"
            onClick={handleLike}
            className="flex items-center gap-2"
        >
            <ThumbsUp className="h-5 w-5" />
            <span>{post.likes}</span>
        </Button>
        <Button
            variant="ghost"
            onClick={handleDislike}
            className="flex items-center gap-2"
        >
            <ThumbsDown className="h-5 w-5" />
            <span>{post.dislikes}</span>
        </Button>
    </div>
);

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadPost = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await fetchPostById(id);
                setPost(data);
                setError(null);
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(
                    "Failed to load the post. It may have been removed or doesn't exist."
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadPost();
    }, [id, post?._id]);

    const handleLike = async () => {
        if (!isAuthenticated || !post) {
            toast.error('Please login to like this post');
            return;
        }

        try {
            const updatedPost = await likePost(post?._id);
            setPost(prevPost => ({
                ...prevPost,
                likes: updatedPost.likes,
                dislikes: updatedPost.dislikes
            }));
            toast.success('Post liked!');
        } catch (err) {
            console.error('Error liking post:', err);
            toast.error('Failed to like the post');
        }
    };

    const handleDislike = async () => {
        if (!isAuthenticated || !post) {
            toast.error('Please login to dislike this post');
            return;
        }

        try {
            const updatedPost = await dislikePost(post._id);
            setPost(prevPost => ({
                ...prevPost,
                likes: updatedPost.likes,
                dislikes: updatedPost.dislikes
            }));
            toast.success('Post disliked!');
        } catch (err) {
            console.error('Error disliking post:', err);
            toast.error('Failed to dislike the post');
        }
    };

    const handleDelete = async () => {
        if (!post) return;

        try {
            await deletePost(post?._id);
            toast.success('Post deleted successfully');
            navigate('/');
        } catch (err) {
            console.error('Error deleting post:', err);
            toast.error('Failed to delete the post');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">
                    Post Not Found
                </h2>
                <p className="mb-6">
                    {error || "This post doesn't exist or has been removed."}
                </p>
                <Link to="/">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                    </Button>
                </Link>
            </div>
        );
    }

    const isAuthor = user && post.author?._id === user?._id;
    const canEditDelete = isAuthor || (user && user.isAdmin);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center text-blog-primary mb-6 hover:underline"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to all posts
                </Link>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {post.title}
                </h1>

                <PostHeader
                    post={post}
                    canEditDelete={canEditDelete}
                    isAuthor={isAuthor}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                />

                {post.imageUrl && (
                    <div className="mb-8 rounded-lg overflow-hidden">
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-auto max-h-96 object-cover"
                        />
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none mb-8 text-gray-800"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <PostActions
                    post={post}
                    handleLike={handleLike}
                    handleDislike={handleDislike}
                />

                <CommentSection postId={post?._id} />
            </div>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this post?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. The post will be
                            permanently deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default PostPage;
