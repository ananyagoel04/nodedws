const {
    Homeimg,
    VisionMission,
    Environment,
    Teacher,
    Program,
    Review
} = require('../models/home');
const userModel = require("../models/user");


const jwt = require('jsonwebtoken');

module.exports = {
    async getAllUsersData(req, res) {
        try {
            // Decode the JWT token from the cookies
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    
            // Get the email from the decoded token
            const email = decoded.email; 
            
            // Check if the email matches the allowed email
            if (email !== "ananyagoelps@gmail.com") {
                // If the email doesn't match, send a 403 Forbidden response
                return res.status(403).json({ message: "You are not authorized to access this page. Please go back to admin page" });
            }
    
            // Retrieve all users, excluding the password field using .select("-password")
            const users = await userModel.find().select("-password");
    
            // If no users are found, send a message
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found." });
            }
    
            // Render the view with the users data
            res.render('Admin/owner-login', { users });
        } catch (err) {
            console.error(err); // Log the error for debugging
            return res.status(500).json({ message: "An error occurred while fetching user data. Please try again." });
        }
    },


    // Homeimg CRUD Operations
    async getAllHomeData(req, res) {
        try {
            // Fetch all data from each collection
            const homeImages = await Homeimg.find();
            const visionMissions = await VisionMission.find();
            const environments = await Environment.find();
            const teachers = await Teacher.find();
            const programs = await Program.find();
            const reviews = await Review.find();
            // Pass all the data to the view
            res.render('Admin/homeadmin', {
                images: homeImages,
                visionMissions,
                environments,
                teachers,
                programs,
                reviews
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error loading home data');
        }
    },

    async createHomeImage(req, res) {
        try {
            const { image_title } = req.body;
            const image = req.file.buffer;
            const newImage = new Homeimg({ image_title, image });
            await newImage.save();
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating home image');
        }
    },

    async updateHomeImage(req, res) {
        try {
            const { id } = req.params;
            const { image_title } = req.body;
            const updates = { image_title };
            if (req.file) updates.image = req.file.buffer;
            await Homeimg.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating home image');
        }
    },

    async deleteHomeImage(req, res) {
        try {
            const { id } = req.params;
            await Homeimg.findByIdAndDelete(id);
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting home image');
        }
    },

    // VisionMission CRUD Operations
    async createVisionMission(req, res) {
        try {
            const { image_title } = req.body;
            const image = req.file.buffer;
            const newItem = new VisionMission({ image_title, image });
            await newItem.save();
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating VisionMission item');
        }
    },

    async updateVisionMission(req, res) {
        try {
            const { id } = req.params;
            const { image_title } = req.body;
            const updates = { image_title };
            if (req.file) updates.image = req.file.buffer;
            await VisionMission.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating VisionMission item');
        }
    },

    async deleteVisionMission(req, res) {
        try {
            const { id } = req.params;
            await VisionMission.findByIdAndDelete(id);
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting VisionMission item');
        }
    },

    // Environment CRUD Operations
    async createEnvironment(req, res) {
        try {
            const { image_title } = req.body;
            const image = req.file.buffer;
            const newItem = new Environment({ image_title, image });
            await newItem.save();
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating environment item');
        }
    },

    async updateEnvironment(req, res) {
        try {
            const { id } = req.params;
            const { image_title } = req.body;
            const updates = { image_title };
            if (req.file) updates.image = req.file.buffer;
            await Environment.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating environment item');
        }
    },

    async deleteEnvironment(req, res) {
        try {
            const { id } = req.params;
            await Environment.findByIdAndDelete(id);
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting environment item');
        }
    },

    // Teacher CRUD Operations
    async createTeacher(req, res) {
        try {
            const { name, designation, image_title } = req.body;
            const image = req.file.buffer;
            const newTeacher = new Teacher({ name, designation, image_title, image });
            await newTeacher.save();
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating teacher');
        }
    },

    async updateTeacher(req, res) {
        try {
            const { id } = req.params;
            const { name, designation, image_title } = req.body;
            const updates = { name, designation, image_title };
            if (req.file) updates.image = req.file.buffer;
            await Teacher.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating teacher');
        }
    },

    async deleteTeacher(req, res) {
        try {
            const { id } = req.params;
            await Teacher.findByIdAndDelete(id);
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting teacher');
        }
    },

    // Program CRUD Operations
    async createProgram(req, res) {
        try {
            const { image_title } = req.body;
            const image = req.file.buffer;
            const newProgram = new Program({ image_title, image });
            await newProgram.save();
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating program');
        }
    },

    async updateProgram(req, res) {
        try {
            const { id } = req.params;
            const { image_title } = req.body;
            const updates = { image_title };
            if (req.file) updates.image = req.file.buffer;
            await Program.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating program');
        }
    },

    async deleteProgram(req, res) {
        try {
            const { id } = req.params;
            await Program.findByIdAndDelete(id);
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting program');
        }
    },

    // Review CRUD Operations
    async createReview(req, res) {
        try {
            const { name, stars, review, image_title } = req.body;
            const image = req.file.buffer;
            const newReview = new Review({ name, stars, review, image_title, image });
            await newReview.save();
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating review');
        }
    },

    async updateReview(req, res) {
        try {
            const { id } = req.params;
            const { name, stars, review, image_title } = req.body;
            const updates = { name, stars, review, image_title };
            if (req.file) updates.image = req.file.buffer;
            await Review.findByIdAndUpdate(id, updates, { new: true });
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating review');
        }
    },

    async deleteReview(req, res) {
        try {
            const { id } = req.params;
            await Review.findByIdAndDelete(id);
            res.redirect('/admin/');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error deleting review');
        }
    }
};
