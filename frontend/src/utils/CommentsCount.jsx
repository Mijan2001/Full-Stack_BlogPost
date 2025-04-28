import { fetchCommentsByPostId } from '@/services/api';

import { useEffect, useState } from 'react';

export const CommentsCount = ({ post }) => {
    const [commentCount, setCommentCount] = useState(0);

    console.log('comments count post ==>', post);

    useEffect(() => {
        const fetchCommentCount = async () => {
            if (post?._id) {
                const data = await fetchCommentsByPostId(post?._id);

                setCommentCount(data?.comments.length || 0);
            }
        };
        fetchCommentCount();
    }, [post?._id]);

    return commentCount;
};
