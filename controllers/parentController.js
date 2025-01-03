const Event = require('../models/event');
const News = require('../models/news');


exports.getAllParentItem = async (req, res) => {
    try {
        const EventItems = await Event.find();
        const NewsItems = await News.find();
  
        res.render('admin/parentadmin', { EventItems, NewsItems });
    } catch (err) {
        console.error('Error loading About data:', err);
        res.status(500).send('Error loading About data');
    }
  };

// Create an Event
exports.createEvent = async (req, res) => {
    try {
        const { heading, date, description } = req.body;
        const image = req.file ? req.file.buffer : null;

        const newEvent = new Event({
            heading,
            date: new Date(date),
            description,
            image,
        });

        await newEvent.save();
        res.status(201).redirect("/admin/parent");
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).send('Failed to create event');
    }
};

// Update an Event
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
        event.image = image || event.image;

        await event.save();
        res.status(200).redirect("/admin/parent");
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).send('Failed to update event');
    }
};

// Delete an Event
exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

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
