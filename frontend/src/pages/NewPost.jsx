import { useRef, useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Loader, Image, X } from 'lucide-react';

const NewPost = () => {
    const fileInputRef = useRef(null);
    const [postImage, setPostImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPostImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setPreviewUrl(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPostImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in both title and content');
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedImageUrl = '';

            if (postImage) {
                const formData = new FormData();
                formData.append('file', postImage);
                formData.append('upload_preset', 'first-project');
                formData.append('cloud_name', 'doezase1n');

                const cloudinaryResponse = await fetch(
                    `https://api.cloudinary.com/v1_1/doezase1n/image/upload`,
                    {
                        method: 'POST',
                        body: formData
                    }
                );

                const cloudinaryData = await cloudinaryResponse.json();
                uploadedImageUrl = cloudinaryData.secure_url;
            }

            const formattedContent = content
                .split('\n')
                .map(para => (para.trim() ? `<p>${para}</p>` : ''))
                .join('');

            const newPost = await createPost({
                title,
                content: formattedContent,
                imageUrl: uploadedImageUrl || undefined
            });

            setTitle('');
            setContent('');
            setPostImage(null);
            setPreviewUrl(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            toast.success('Post created successfully!');
            navigate(`/post/${newPost?._id}`);
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <Button
                    variant="ghost"
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-500"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                </Button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-6 text-gray-800">
                            Create New Post
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="title"
                                    className="text-gray-700"
                                >
                                    Title
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="Enter a compelling title"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    required
                                    className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {previewUrl && (
                                <div className="relative mb-4">
                                    <img
                                        src={previewUrl}
                                        alt="Post preview"
                                        className="w-full h-auto rounded-lg max-h-80 object-contain bg-gray-100 border border-gray-200 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                        disabled={isSubmitting}
                                    >
                                        <X className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <Image className="w-5 h-5 mr-1" />
                                    <span>Add Image</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept="image/*"
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="content"
                                    className="text-gray-700"
                                >
                                    Content
                                </Label>
                                <Textarea
                                    id="content"
                                    placeholder="Write your post content here..."
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="min-h-[300px] border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
                                    onClick={() => navigate(-1)}
                                    className="border-gray-300 text-gray-600 hover:bg-gray-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    {isSubmitting ? (
                                        <Loader className="animate-spin h-5 w-5" />
                                    ) : (
                                        'Publish Post'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewPost;
