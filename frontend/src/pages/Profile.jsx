import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById, updateUser } from '../services/api';

const Profile = () => {
    const { id } = useParams();
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        profileImage: '' // Always store URL here
    });
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // Only for new selected file

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token');

                const response = await fetchUserById(id);

                setUserData({
                    name: response?.name,
                    email: response?.email,
                    profileImage: response?.profileImage || ''
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error fetching user data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id]);

    const handleImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserData(prevData => ({
                    ...prevData,
                    profileImage: reader.result // Set preview base64 string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token');

            let uploadedImageUrl = userData.profileImage;

            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
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

            // Prepare data for API
            const updatedData = {
                name: userData.name,
                email: userData.email,
                password: userData.password,
                profileImage: uploadedImageUrl // send new or old URL
            };

            const response = await updateUser(id, updatedData);
            console.log('profile.jsx isUpdateUser==>', response);

            navigate(`/profile/${response?._id}`);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user profile:', error);
            setError('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-6 py-10 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                User Profile
            </h2>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            {!editMode ? (
                <div className="space-y-6">
                    <div className="flex flex-col items-center">
                        {userData.profileImage ? (
                            <img
                                src={userData.profileImage}
                                alt="Profile"
                                className="w-32 h-32 object-cover rounded-full border-4 border-blue-500"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                No Image
                            </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-800 mt-4">
                            {userData.name}
                        </h3>
                        <p className="text-gray-600">{userData.email}</p>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => setEditMode(true)}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-gray-50 p-6 rounded-md shadow-md"
                >
                    <h3 className="text-2xl font-semibold text-gray-800 text-center">
                        Edit Profile
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password (Leave blank to keep current)
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            ref={fileInputRef}
                            accept="image/*"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {userData.profileImage && (
                            <img
                                src={userData.profileImage}
                                alt="Profile Preview"
                                className="mt-4 w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                            />
                        )}
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
                        >
                            Update Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Profile;
