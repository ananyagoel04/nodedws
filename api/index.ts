const express = require('express');
const app = express();
const path = require('path');
const db = require("../config/mongoose-connection");
const cookieParser = require('cookie-parser');
const upload = require('../config/multer');
const ownerRouter = require("../routes/ownerRouter");
const adminRouter = require('../routes/adminRouter');
const pageRouter = require('../routes/pageRouter');
const aboutRoutes = require('../routes/aboutRoutes');
const userRouter = require("../routes/userRouter");
const expressSession = require("express-session");
const flash = require("connect-flash");
const methodOverride = require('method-override');
const isLoggedin = require('../middlewares/isLoggedin');

app.use(expressSession({
    secret: 'DWS@2011',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.use(flash());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method'));

require('dotenv').config();

// Set the views folder and view engine
// Update the path to account for the 'api' directory
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the public directory
// Update the static file path to reflect the new directory structure
app.use(express.static(path.join(__dirname, '..', 'public')));

// Set up the route handlers
app.use("/owner", ownerRouter);
app.use('/admin', isLoggedin, adminRouter);
app.use('/', pageRouter);
app.use('/admin', isLoggedin, aboutRoutes);
app.use("/users", userRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;