import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    fetchCommentsByPostId,
    createComment,
    deleteComment
} from '@/services/api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

const CommentSection = ({ postId }) => {
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const loadComments = async () => {
            setIsLoading(true);
            try {
                const data = await fetchCommentsByPostId(postId);

                setComments(data?.comments);
            } catch (error) {
                console.error('Error fetching comments:', error);
                toast.error('Failed to load comments');
            } finally {
                setIsLoading(false);
            }
        };

        loadComments();
    }, [postId]);

    const handleSubmitComment = async e => {
        e.preventDefault();

        if (!newComment.trim()) return;

        try {
            setIsLoading(true);
            const comment = await createComment({
                postId,
                content: newComment
            });
            setComments(prev => [comment, ...prev]);
            setNewComment('');
            toast.success('Comment added successfully');
        } catch (error) {
            console.error('Error creating comment:', error);
            toast.error('Failed to add comment');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteComment = async commentId => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
            toast.success('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            toast.error('Failed to delete comment');
        }
    };

    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
                Comments ({comments?.length})
            </h3>

            {isAuthenticated ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="mb-2"
                        required
                    />
                    <Button
                        type="submit"
                        className="mt-2"
                        disabled={isLoading || !newComment.trim()}
                    >
                        {isLoading ? 'Posting...' : 'Post Comment'}
                    </Button>
                </form>
            ) : (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <p className="text-gray-600">
                        Please{' '}
                        <a
                            href="/login"
                            className="text-blog-primary hover:underline"
                        >
                            login
                        </a>{' '}
                        to join the conversation.
                    </p>
                </div>
            )}

            {comments?.length > 0 ? (
                <div className="space-y-4">
                    {comments?.map(comment => (
                        <div
                            key={comment._id}
                            className="bg-gray-50 p-4 rounded-md"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>
                                            {comment.author.name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {comment.author.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(
                                                new Date(comment.createdAt),
                                                {
                                                    addSuffix: true
                                                }
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {(user?.isAdmin ||
                                    user?._id === comment.author._id) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteComment(comment._id)
                                        }
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    No comments yet. Be the first to share your thoughts!
                </div>
            )}
        </div>
    );
};

export default CommentSection;
