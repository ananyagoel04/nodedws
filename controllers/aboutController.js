const { AboutImage, Message } = require('../models/about'); // Assuming models are exported from a single file

module.exports = {
    // ---------------------- AboutImage CRUD Operations ----------------------

    // Get all About images data
    async getAllAboutData(req, res) {
        try {
            const aboutImages = await AboutImage.find();
            const messages = await Message.find();

            res.render('admin/aboutadmin', { aboutImages, messages });
        } catch (err) {
            console.error('Error loading About data:', err);
            res.status(500).send('Error loading About data');
        }
    },

    // Create new About image
    async createAboutImage(req, res) {
        try {
            const { image_title } = req.body;
            const image = req.file.buffer; // Get image buffer data from the uploaded file
            const newAboutImage = new AboutImage({ image_title, image });
            await newAboutImage.save();
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
            if (req.file) updates.image = req.file.buffer; // If a new image is uploaded
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
            const image = await AboutImage.findById(id);
            if (!image) {
                return res.status(404).send('Image not found');
            }
            res.send({
                imageTitle: image.image_title,
                imageData: image.image.toString('base64'),
            });
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
            const image = req.file ? req.file.buffer : null; // Check if image is uploaded
            const newMessage = new Message({ name, message, image });
            await newMessage.save();
            res.redirect('/admin/about'); // Redirect after saving
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
            if (req.file) updates.image = req.file.buffer; // If a new image is uploaded
            await Message.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/about'); // Redirect after updating
        } catch (err) {
            console.error('Error updating message:', err);
            res.status(500).send('Error updating message');
        }
    },

    // Delete Message
    async deleteMessage(req, res) {
        try {
            const { id } = req.params;
            await Message.findByIdAndDelete(id);
            res.redirect('/admin/messages'); // Redirect after deleting
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
                imageData: message.image ? message.image.toString('base64') : null,
            });
        } catch (err) {
            console.error('Error fetching message:', err);
            res.status(500).send('Error fetching message');
        }
    }
};
