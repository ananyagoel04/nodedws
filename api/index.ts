const express = require('express');
const path = require('path');
const db = require("../config/mongoose-connection");
const cookieParser = require('cookie-parser');
const upload = require('../config/multer');
const adminRouter = require('../routes/adminRouter');
const pageRouter = require('../routes/pageRouter');
const aboutRoutes = require('../routes/aboutRouter');
const userRouter = require("../routes/userRouter");
const studentRoutes = require('../routes/studentRouter');




const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require('method-override');
const isLoggedin = require('../middlewares/isLoggedin');
app.use(methodOverride('_method'));



require('dotenv').config();

// Set the views folder and view engine
app.set('views', path.join(__dirname, '..','views'));

app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.) from the public directory
app.use(express.static(path.join(__dirname, '..','public')));


app.use('/admin',isLoggedin, adminRouter);
app.use('/', pageRouter);
app.use('/admin/about',isLoggedin,aboutRoutes);
app.use("/users", userRouter);
app.use('/admin/tc',isLoggedin, studentRoutes);



// Route to render the admin page (optional - You can link this to your actual admin dashboard)
// app.get('/', (req, res) => {
//     res.render('Admin/home'); // Render admin.ejs from the views folder
// });


const PORT = process.env.PORT || 2011;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


module.exports = app;