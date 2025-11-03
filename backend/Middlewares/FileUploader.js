// Import 'multer' — middleware used for handling multipart/form-data (file uploads)
const multer = require('multer');

// Import 'CloudinaryStorage' — a storage engine for multer that uploads files directly to Cloudinary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Import Cloudinary SDK (v2 version)
const cloudinary = require('cloudinary').v2;

// ------------------ Cloudinary Configuration ------------------
// Configure Cloudinary with your credentials stored in environment variables
// (These should be defined in your .env file for security)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,        // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,        // Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET   // Cloudinary API secret
});

// ------------------ Multer Storage Setup ------------------
// Create a new Cloudinary storage engine for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Connects the storage engine to your configured Cloudinary account

    // 'params' defines additional upload options for each file
    params: {
        folder: 'uploads',  // All uploaded files will go inside a folder named 'uploads' on Cloudinary

        // Format specifies the file type you want to store — here, always 'png'
        // (Can also return different formats dynamically based on the uploaded file)
        format: async (req, file) => 'png',

        // 'public_id' determines the filename on Cloudinary
        // Here, it uses the original filename (without extension) as the public ID
        // e.g. "photo.jpg" → public_id: "photo"
        public_id: (req, file) => file.originalname.split('.')[0] + ""
    },
});

// ------------------ Multer Middleware ------------------
// Create a Multer instance that uses the above Cloudinary storage engine
// This means uploaded files will be automatically stored in Cloudinary (not on your local server)
const cloudinaryFileUploader = multer({ storage: storage });

// Export the uploader middleware so it can be used in routes
module.exports = {
    cloudinaryFileUploader
};
