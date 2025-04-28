import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { fetchPostById, updatePost } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Image } from 'lucide-react';

const EditPost = () => {
    const { id } = useParams();
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [form, setForm] = useState({
        title: '',
        content: '',
        imageUrl: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                const data = await fetchPostById(id);
                setPost(data);

                if (user && (user._id === data.author?._id || user.isAdmin)) {
                    const contentWithoutTags = data.content
                        .replace(/<p>/g, '')
                        .replace(/<\/p>/g, '\n')
                        .trim();

                    setForm({
                        title: data.title || '',
                        content: contentWithoutTags || '',
                        imageUrl: data.imageUrl || ''
                    });
                    setError(null);
                } else {
                    setError("You don't have permission to edit this post.");
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError(
                    "Failed to load the post. It may have been removed or doesn't exist."
                );
            } finally {
                setIsLoading(false);
            }
        };

        if (isAuthenticated) {
            loadPost();
        }
    }, [id, isAuthenticated, user]);

    const handleChange = e => {
        const { id, value } = e.target;
        setForm(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!id || !post) return;

        if (!form.title.trim() || !form.content.trim()) {
            toast.error('Please fill in both title and content.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedContent = form.content
                .split('\n')
                .map(para => (para.trim() ? `<p>${para}</p>` : ''))
                .join('');

            await updatePost(id, {
                title: form.title,
                content: formattedContent,
                imageUrl: form.imageUrl || undefined
            });

            toast.success('Post updated successfully!');
            navigate(`/post/${id}`);
        } catch (err) {
            console.error('Error updating post:', err);
            toast.error('Failed to update post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto animate-pulse">
                    {/* Skeleton loader */}
                    <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 space-y-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i}>
                                    <div className="h-4 bg-gray-200 w-1/6 mb-2"></div>
                                    <div className="h-10 bg-gray-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
                <p className="mb-6">{error}</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter a compelling title"
                                    value={form.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="imageUrl">
                                    Cover Image URL (optional)
                                </Label>
                                <div className="flex space-x-2">
                                    <Input
                                        id="imageUrl"
                                        placeholder="https://example.com/image.jpg"
                                        value={form.imageUrl}
                                        onChange={handleChange}
                                    />
                                    {form.imageUrl && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setForm(prev => ({
                                                    ...prev,
                                                    imageUrl: ''
                                                }))
                                            }
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>

                                <div className="mt-2 rounded-md overflow-hidden border h-40 flex items-center justify-center bg-gray-50">
                                    {form.imageUrl ? (
                                        <img
                                            src={form.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={e => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
                                            }}
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <Image className="mx-auto h-10 w-10 mb-2" />
                                            <p>No image selected</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your post content here..."
                                    value={form.content}
                                    onChange={handleChange}
                                    className="min-h-[300px]"
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Use new lines to separate paragraphs
                                </p>
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(`/post/${id}`)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? 'Updating...'
                                        : 'Update Post'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPost;

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, Navigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { fetchPostById, updatePost } from '@/services/api';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { ArrowLeft, Image } from 'lucide-react';

// const EditPost = () => {
//     //... your other states
//     const { id } = useParams();
//     const { isAuthenticated, user } = useAuth();
//     const navigate = useNavigate();
//     const [imageUrl, setImageUrl] = useState('');
//     const [post, setPost] = useState(null);
//     const [form, setForm] = useState({
//         title: '',
//         content: '',
//         imageUrl: ''
//     });
//     const [isLoading, setIsLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);

//     const [selectedImageFile, setSelectedImageFile] = useState(null); // NEW state

//     //... your useEffect
//     useEffect(() => {
//         const loadPost = async () => {
//             if (!id) return;

//             try {
//                 setIsLoading(true);
//                 const data = await fetchPostById(id);
//                 setPost(data);

//                 if (user && (user._id === data.author?._id || user.isAdmin)) {
//                     const contentWithoutTags = data.content
//                         .replace(/<p>/g, '')
//                         .replace(/<\/p>/g, '\n')
//                         .trim();

//                     setForm({
//                         title: String(data.title) || '',
//                         content: contentWithoutTags || '',
//                         imageUrl: data.imageUrl || ''
//                     });
//                     setError(null);
//                 } else {
//                     setError("You don't have permission to edit this post.");
//                 }
//             } catch (err) {
//                 console.error('Error fetching post:', err);
//                 setError(
//                     "Failed to load the post. It may have been removed or doesn't exist."
//                 );
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (isAuthenticated) {
//             loadPost();
//         }
//     }, [id, isAuthenticated, user]);

//     const handleImageChange = e => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedImageFile(file);
//             setImageUrl(URL.createObjectURL(file)); // show preview
//         }
//     };

//     const handleChange = e => {
//         const { id, value } = e.target;
//         setForm(prev => ({ ...prev, [id]: value }));
//     };

//     const handleSubmit = async e => {
//         e.preventDefault();

//         if (!id || !post) return;

//         if (!title.trim() || !content.trim()) {
//             toast.error('Please fill in both title and content');
//             return;
//         }

//         setIsSubmitting(true);

//         try {
//             const formattedContent = content
//                 .split('\n')
//                 .map(para => (para.trim() ? `<p>${para}</p>` : ''))
//                 .join('');

//             // Here, handle image upload if you want to upload to server/cloud
//             // For now, assuming imageUrl is ready

//             await updatePost(id, {
//                 title,
//                 content: formattedContent,
//                 imageUrl: imageUrl || undefined // still sending imageUrl
//             });

//             toast.success('Post updated successfully!');
//             navigate(`/post/${id}`);
//         } catch (error) {
//             console.error('Error updating post:', error);
//             toast.error('Failed to update post. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // ... rest code
//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     if (isLoading) {
//         return (
//             <div className="container mx-auto px-4 py-8">
//                 <div className="max-w-3xl mx-auto animate-pulse">
//                     {/* Skeleton loader */}
//                     <div className="h-8 bg-gray-200 w-1/4 mb-6"></div>
//                     <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                         <div className="p-6 space-y-6">
//                             {[...Array(3)].map((_, i) => (
//                                 <div key={i}>
//                                     <div className="h-4 bg-gray-200 w-1/6 mb-2"></div>
//                                     <div className="h-10 bg-gray-100 rounded"></div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="container mx-auto px-4 py-12 text-center">
//                 <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
//                 <p className="mb-6">{error}</p>
//                 <Button variant="outline" onClick={() => navigate(-1)}>
//                     <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
//                 </Button>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="max-w-3xl mx-auto">
//                 {/* ...Back Button */}
//                 <Button
//                     variant="ghost"
//                     className="mb-6"
//                     onClick={() => navigate(-1)}
//                 >
//                     <ArrowLeft className="mr-2 h-4 w-4" /> Back
//                 </Button>

//                 <div className="bg-white rounded-xl shadow-md overflow-hidden">
//                     <div className="p-6">
//                         <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* ...Title Input */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="title">Title</Label>
//                                 <Input
//                                     id="title"
//                                     placeholder="Enter a compelling title"
//                                     value={form.title}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>

//                             {/* IMAGE Upload */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="image">
//                                     Select Cover Image
//                                 </Label>
//                                 <Input
//                                     id="image"
//                                     type="file"
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                 />
//                                 {imageUrl && (
//                                     <div className="mt-2 rounded-md overflow-hidden border h-40">
//                                         <img
//                                             src={imageUrl}
//                                             alt="Preview"
//                                             className="w-full h-full object-cover"
//                                             onError={e => {
//                                                 const target = e.target;
//                                                 target.onerror = null;
//                                                 target.src =
//                                                     'https://via.placeholder.com/800x400?text=Invalid+Image+URL';
//                                             }}
//                                         />
//                                     </div>
//                                 )}
//                                 {!imageUrl && (
//                                     <div className="mt-2 rounded-md overflow-hidden border h-40 flex items-center justify-center bg-gray-50">
//                                         <div className="text-center text-gray-400">
//                                             <Image className="mx-auto h-10 w-10 mb-2" />
//                                             <p>No image selected</p>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* ...Content TextArea */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="content">Content</Label>
//                                 <Textarea
//                                     id="content"
//                                     placeholder="Write your post content here..."
//                                     value={form.content}
//                                     onChange={handleChange}
//                                     className="min-h-[300px]"
//                                     required
//                                 />
//                                 <p className="text-sm text-gray-500">
//                                     Use new lines to separate paragraphs
//                                 </p>
//                             </div>
//                             {/* Buttons */}
//                             <div className="flex justify-end gap-2">
//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     onClick={() => navigate(`/post/${id}`)}
//                                 >
//                                     Cancel
//                                 </Button>
//                                 <Button type="submit" disabled={isSubmitting}>
//                                     {isSubmitting
//                                         ? 'Updating...'
//                                         : 'Update Post'}
//                                 </Button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditPost;
