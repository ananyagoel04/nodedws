const express = require('express');
const path = require('path');
const db = require("../config/mongoose-connection");
const cookieParser = require('cookie-parser');
const upload = require('../config/multer');
const session = require('express-session');

const adminRouter = require('../routes/adminRouter');
const pageRouter = require('../routes/pageRouter');
const aboutRoutes = require('../routes/aboutRouter');
const userRouter = require("../routes/userRouter");
const studentRoutes = require('../routes/studentRouter');
const galleryRoutes = require('../routes/galleryRoutes');
const parentRoutes = require('../routes/parentRoutes');
const adRouter = require('../routes/adRouter');
const imghomeRouter = require('../routes/imagehomeRouter');

const Ad = require('../models/ad');

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
const isLoggedin = require('../middlewares/isLoggedin');
app.use(methodOverride('_method'));

require('dotenv').config();


// Update the path to account for the 'api' directory
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the public directory
// Update the static file path to reflect the new directory structure
app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1d' }));

// Set up the route handlers
app.use('/admin', isLoggedin, adminRouter);
app.use('/', pageRouter);
app.use('/', imghomeRouter);
app.use('/admin', isLoggedin, aboutRoutes);
app.use("/users", userRouter);
app.use('/admin/tc',isLoggedin, studentRoutes);
app.use('/admin/parent',isLoggedin, parentRoutes);
app.use('/admin/ads',isLoggedin, adRouter);

app.use('/admin/gallery', galleryRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;