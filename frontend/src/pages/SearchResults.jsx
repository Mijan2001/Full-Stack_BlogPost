import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPosts } from '@/services/api';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';

const SearchResults = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q') || '';

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                setIsLoading(true);
                const data = await fetchPosts();
                setPosts(data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setIsLoading(false);
            }
        };

        loadPosts();
    }, []);

    useEffect(() => {
        if (searchQuery && posts.length > 0) {
            const query = searchQuery.toLowerCase();
            const results = posts.filter(
                post =>
                    post.title.toLowerCase().includes(query) ||
                    post.content.toLowerCase().includes(query)
            );
            setFilteredPosts(results);
        } else {
            setFilteredPosts([]);
        }
    }, [searchQuery, posts]);

    const resultCount = filteredPosts.length;

    return (
        <div className="container mx-auto px-4 py-12">
            <Button
                variant="ghost"
                className="mb-6"
                onClick={() => window.history.back()}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                    <p className="text-gray-600">
                        {isLoading ? (
                            'Searching...'
                        ) : (
                            <>
                                Found {resultCount} result
                                {resultCount !== 1 ? 's' : ''} for "
                                {searchQuery}"
                            </>
                        )}
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 rounded-lg h-64"
                        ></div>
                    ))}
                </div>
            ) : filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map(post => (
                        <PostCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                        No results found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        We couldn't find any posts matching your search query.
                    </p>
                    <Button onClick={() => (window.location.href = '/')}>
                        Back to Home
                    </Button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
