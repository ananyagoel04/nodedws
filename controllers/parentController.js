const cloudinary = require('../config/cloudinaryConfig');
const Event = require('../models/event');
const News = require('../models/news');


async function uploadImageToCloudinary(file, public_id, folder = 'parent_images') {
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


exports.getAllParentItem = async (req, res) => {
    try {
        const EventItems = await Event.find();
        const NewsItems = await News.find();

        res.render('Admin/parentadmin', { EventItems, NewsItems });
    } catch (err) {
        console.error('Error loading About data:', err);
        res.status(500).send('Error loading About data');
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { heading, date, description } = req.body;
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        const uploadResult = await uploadImageToCloudinary(req.file, heading);

        const newEvent = new Event({
            heading,
            date: new Date(date),
            description,
            image_url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        });
        await newEvent.save();
        res.status(201).redirect("/admin/parent");
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).send('Failed to create event');
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, date, description } = req.body;
        const image = req.file ? req.file.buffer : null;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.heading = heading || event.heading;
        event.date = date || event.date;
        event.description = description || event.description;
        if (req.file) {
            const uploadResult = await uploadImageToCloudinary(req.file, heading);
            event.image_url = uploadResult.secure_url;
            event.public_id = uploadResult.public_id;
          }
        await event.save();
        res.status(200).redirect("/admin/parent");
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).send('Failed to update event');
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        await cloudinary.uploader.destroy(event.public_id);
        await Event.deleteOne({ _id: id });
        res.status(200).redirect("/admin/parent");
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).send('Failed to delete event');
    }
};

// Create a News Item
exports.createNews = async (req, res) => {
    try {
        const { heading, newsContent } = req.body;

        const newNews = new News({
            heading,
            newsContent,
        });

        await newNews.save();
        res.status(201).redirect("/admin/parent");
    } catch (err) {
        console.error('Error creating news:', err);
        res.status(500).send('Failed to create news');
    }
};

// Update a News Item
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { heading, newsContent } = req.body;

        const news = await News.findById(id);
        if (!news) return res.status(404).json({ message: 'News item not found' });

        news.heading = heading || news.heading;
        news.newsContent = newsContent || news.newsContent;

        await news.save();
        res.status(200).redirect("/admin/parent");
    } catch (err) {
        console.error('Error updating news:', err);
        res.status(500).send('Failed to update news');
    }
};

// Delete a News Item
exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await News.findById(id);
        if (!news) return res.status(404).json({ message: 'News item not found' });

        await News.deleteOne({ _id: id });

        res.status(200).redirect("/admin/parent");
    } catch (err) {
        console.error('Error deleting news:', err);
        res.status(500).send('Failed to delete news');
    }
};
