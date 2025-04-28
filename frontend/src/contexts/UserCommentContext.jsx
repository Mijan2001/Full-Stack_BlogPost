import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from 'react';
import axios from 'axios';

const UserCommentContext = createContext(undefined);

export const UserCommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadComments = useCallback(async postId => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/comments/${postId}`);
            setComments(res.data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleAddComment = async (postId, content) => {
        try {
            const res = await axios.post(`/api/comments/${postId}`, {
                content
            });
            setComments(prev => [...prev, res.data]);
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const handleDeleteComment = async commentId => {
        try {
            await axios.delete(`/api/comments/${commentId}`);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };

    return (
        <UserCommentContext.Provider
            value={{
                comments,
                isLoading,
                loadComments,
                handleAddComment,
                handleDeleteComment
            }}
        >
            {children}
        </UserCommentContext.Provider>
    );
};

export const useUserComments = () => {
    const context = useContext(UserCommentContext);
    if (context === undefined) {
        throw new Error(
            'useUserComments must be used within a UserCommentProvider'
        );
    }
    return context;
};
