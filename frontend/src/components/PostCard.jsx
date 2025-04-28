import {
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Clock, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fetchCommentsByPostId, fetchUserById } from '../services/api';
import { useEffect, useState } from 'react';

const PostCard = ({ post }) => {
    const [commentCount, setCommentCount] = useState(0);
    const [author, setAuthor] = useState('');

    useEffect(() => {
        const fetchCommentCount = async () => {
            if (post?._id) {
                const data = await fetchCommentsByPostId(post?._id);
                setCommentCount(data?.comments.length || 0);
            }
        };
        fetchCommentCount();
    }, [post?._id]);

    useEffect(() => {
        const fetchAuthor = async () => {
            const author = await fetchUserById(post?.author?._id);
            setAuthor(author);
        };
        fetchAuthor();
    }, [post?.author]);

    return (
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow rounded-lg border border-gray-200">
            {post?.imageUrl && (
                <Link to={`/post/${post?._id}`}>
                    <div className="h-48 overflow-hidden">
                        <img
                            src={post?.imageUrl}
                            alt={post?.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                        />
                    </div>
                </Link>
            )}

            <CardHeader className="pb-2 px-4">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-8 w-8">
                        {author?.profileImage ? (
                            <AvatarImage
                                src={author.profileImage}
                                alt={author.name}
                            />
                        ) : (
                            <AvatarFallback>
                                {author?.name?.charAt(0).toUpperCase() || 'A'}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                            {author.name}
                        </span>
                        <span className="text-gray-400 text-xs flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDistanceToNow(new Date(post?.createdAt), {
                                addSuffix: true
                            })}
                        </span>
                    </div>
                </div>

                <Link to={`/post/${post?._id}`}>
                    <h3 className="text-lg font-semibold hover:text-blog-primary transition-colors line-clamp-2">
                        {post?.title}
                    </h3>
                </Link>
            </CardHeader>

            <CardContent className="px-4 pb-4 flex-grow">
                <div
                    className="text-gray-600 text-sm line-clamp-3"
                    dangerouslySetInnerHTML={{
                        __html:
                            post?.content.substring(0, 150) +
                            (post.content.length > 150 ? '...' : '')
                    }}
                />
            </CardContent>

            <CardFooter className="pt-2 px-4 border-t flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4 text-gray-500" />
                        {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                        <ThumbsDown className="h-4 w-4 text-gray-500" />
                        {post.dislikes}
                    </span>
                </div>

                <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    {commentCount}
                </span>
            </CardFooter>
        </Card>
    );
};

export default PostCard;
