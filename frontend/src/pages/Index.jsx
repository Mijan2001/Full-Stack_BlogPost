import { useState, useEffect } from 'react';
import { fetchPosts } from '@/services/api';
import PostCard from '@/components/PostCard';
import { Button } from '@/components/ui/button';

const Index = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts();
                setPosts(data?.posts);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        loadPosts();
    }, []);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 animate-pulse">
                <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3 mb-10"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 h-72 shadow-inner"
                        ></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold text-red-500 mb-6">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    const featuredPost = posts[0];
    const regularPosts = posts.slice(1);

    return (
        <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-14 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-16 rounded-lg shadow-lg">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Welcome to <span className="text-yellow-300">BlogPost</span>
                </h1>
                <p className="text-lg">
                    Your daily dose of knowledge, news, and stories.
                </p>
            </div>

            {/* Featured Post */}
            {featuredPost && (
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 border-l-4 border-blog-primary pl-4">
                        Featured Post
                    </h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                        <div className="md:flex">
                            {featuredPost.imageUrl && (
                                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                                    <img
                                        src={featuredPost.imageUrl}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-8 md:w-1/2 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-3xl font-bold mb-4 text-gray-800 hover:text-blog-primary transition-colors">
                                        <a href={`/post/${featuredPost?._id}`}>
                                            {featuredPost.title}
                                        </a>
                                    </h3>
                                    <div
                                        className="text-gray-600 mb-6 line-clamp-4 text-justify"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                featuredPost?.content.substring(
                                                    0,
                                                    300
                                                ) + '...'
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between items-center mt-6">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-gray-300 rounded-full w-10 h-10 flex items-center justify-center font-semibold text-gray-700 uppercase">
                                            {featuredPost?.author?.name[0]}
                                        </div>
                                        <span className="text-gray-700 font-medium">
                                            {featuredPost?.author?.name}
                                        </span>
                                    </div>
                                    <a
                                        href={`/post/${featuredPost?._id}`}
                                        className="text-blog-primary hover:underline font-semibold"
                                    >
                                        Read More →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Posts */}
            <section>
                <h2 className="text-2xl font-bold mb-6 border-l-4 border-blog-primary pl-4">
                    Latest Posts
                </h2>
                {regularPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map(post => (
                            <PostCard key={post?._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        No posts found. Come back later for fresh content!
                    </div>
                )}
            </section>
        </div>
    );
};

export default Index;
