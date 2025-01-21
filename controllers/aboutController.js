const cloudinary = require('../config/cloudinaryConfig');
const https = require('https');
const path = require('path');
const { AboutImage, Message } = require('../models/about');

// Helper function for Cloudinary upload
async function uploadImageToCloudinary(file, public_id, folder = 'about_images') {
    const streamifier = require('streamifier');
    const bufferStream = streamifier.createReadStream(file.buffer);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                public_id: public_id,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            }
        );
        bufferStream.pipe(uploadStream);
    });
}

module.exports = {
    // ---------------------- AboutImage CRUD Operations ----------------------

    // Get all About images data
    async getAllAboutData(req, res) {
        try {
            const [aboutImages, messages] = await Promise.all([
                AboutImage.find(),
                Message.find()
            ]);
            res.render('Admin/aboutadmin', { aboutImages, messages });
        } catch (err) {
            console.error('Error loading About data:', err);
            res.status(500).send('Error loading About data');
        }
    },

    // Create new About image
    async createAboutImage(req, res) {
        try {
            const { image_title } = req.body;
            if (!req.file) {
                return res.status(400).send('Image file is required');
            }

            const uploadResult = await uploadImageToCloudinary(req.file, image_title);
            const newImage = new AboutImage({
                image_title,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });
            await newImage.save();
            res.redirect('/admin/about');
        } catch (err) {
            console.error('Error creating About image:', err);
            res.status(500).send('Error creating About image');
        }
    },

    // Update existing About image
    async updateAboutImage(req, res) {
        try {
            const { id } = req.params;
            const { image_title } = req.body;
            const updates = { image_title };

            if (req.file) {
                const uploadResult = await uploadImageToCloudinary(req.file, image_title);
                updates.image_url = uploadResult.secure_url;
                updates.public_id = uploadResult.public_id;
            }

            await AboutImage.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/about');
        } catch (err) {
            console.error('Error updating About image:', err);
            res.status(500).send('Error updating About image');
        }
    },

    // Delete About image
    async deleteAboutImage(req, res) {
        try {
            const { id } = req.params;
            const aboutImage = await AboutImage.findById(id);
            if (!aboutImage) return res.status(404).send('About image not found');
            
            await cloudinary.uploader.destroy(aboutImage.public_id);
            await AboutImage.findByIdAndDelete(id);
            res.redirect('/admin/about');
        } catch (err) {
            console.error('Error deleting About image:', err);
            res.status(500).send('Error deleting About image');
        }
    },

    // Get a single About image by its ID
    async getAboutImageById(req, res) {
        try {
            const { id } = req.params;
            const aboutImage = await AboutImage.findById(id);
            if (!aboutImage) {
                return res.status(404).send('Image not found');
            }
            res.redirect(aboutImage.image_url);  // Redirect to the image URL or render it as needed
        } catch (err) {
            console.error('Error fetching About image:', err);
            res.status(500).send('Error fetching About image');
        }
    },

    // ---------------------- Message CRUD Operations ----------------------

    // Get all Messages data
    async getAllMessages(req, res) {
        try {
            const messages = await Message.find();
            res.render('admin/about', { messages });
        } catch (err) {
            console.error('Error loading messages data:', err);
            res.status(500).send('Error loading messages');
        }
    },

    // Create new Message
    async createMessage(req, res) {
        try {
            const { name, message } = req.body;
            if (!req.file) {
                return res.status(400).send('Image file is required');
            }

            const public_id = `${name}_${Date.now()}`; // Create unique public_id
            const uploadResult = await uploadImageToCloudinary(req.file, public_id);

            const newMessage = new Message({
                name,
                message,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });
            await newMessage.save();
            res.redirect('/admin/about');
        } catch (err) {
            console.error('Error creating message:', err);
            res.status(500).send('Error creating message');
        }
    },

    // Update existing Message
    async updateMessage(req, res) {
        try {
            const { id } = req.params;
            const { name, message } = req.body;
            const updates = { name, message };

            if (req.file) {
                const public_id = `${name}_${Date.now()}`; // Create unique public_id
                const uploadResult = await uploadImageToCloudinary(req.file, public_id);
                updates.image_url = uploadResult.secure_url;
                updates.public_id = uploadResult.public_id;
            }

            await Message.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/about');
        } catch (err) {
            console.error('Error updating message:', err);
            res.status(500).send('Error updating message');
        }
    },

    // Delete Message
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            const message = await Message.findById(id);
            if (!message) return res.status(404).send('Message not found');
            
            await cloudinary.uploader.destroy(message.public_id);
            await Message.findByIdAndDelete(id);
            res.redirect('/admin/messages');
        } catch (err) {
            console.error('Error deleting message:', err);
            res.status(500).send('Error deleting message');
        }
    },

    // Get a single Message by its ID
    async getMessageById(req, res) {
        try {
            const { id } = req.params;
            const message = await Message.findById(id);
            if (!message) {
                return res.status(404).send('Message not found');
            }
            res.send({
                name: message.name,
                message: message.message,
                imageData: message.image_url ? message.image_url : null, // Return image URL
            });
        } catch (err) {
            console.error('Error fetching message:', err);
            res.status(500).send('Error fetching message');
        }
    }
};
