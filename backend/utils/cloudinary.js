const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.SECRET_KEY
});

// Upload image to Cloudinary
const uploadImage = async imagePath => {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'socialsphere'
        });

        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Image upload failed');
    }
};

// Delete image from Cloudinary
const deleteImage = async imageUrl => {
    if (!imageUrl) return;

    try {
        // Extract public_id from the URL
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];

        if (publicId) {
            await cloudinary.uploader.destroy(`socialsphere/${publicId}`);
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

module.exports = {
    uploadImage,
    deleteImage,
    cloudinary
};
