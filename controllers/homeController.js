const cloudinary = require('../config/cloudinaryConfig');
const https = require('https');
const path = require('path');
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

            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const streamifier = require('streamifier');
            const bufferStream = streamifier.createReadStream(req.file.buffer);

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'home_images',
                        public_id: image_title,
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

            const newImage = new Homeimg({
                image_title,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });

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

            if (req.file) {
                const streamifier = require('streamifier');
                const bufferStream = streamifier.createReadStream(req.file.buffer);

                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'home_images',
                            public_id: image_title,
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

                updates.image_url = uploadResult.secure_url;
                updates.public_id = uploadResult.public_id;
                updates.updatedAt = Date.now();

                await Homeimg.findByIdAndUpdate(id, updates, { new: true });

                return res.redirect('/admin/');
            } else {
                await Homeimg.findByIdAndUpdate(id, updates, { new: true });
                return res.redirect('/admin/');
            }
        } catch (err) {
            console.error(err);
            return res.status(500).send('Error updating home image');
        }
    },

    async deleteHomeImage(req, res) {
        try {
            const { id } = req.params;
            const homeImage = await Homeimg.findById(id);
            if (!homeImage) {
                return res.status(404).send('Home image not found');
            }

            const publicId = homeImage.public_id;

            await cloudinary.uploader.destroy(publicId);

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

            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const streamifier = require('streamifier');
            const bufferStream = streamifier.createReadStream(req.file.buffer);

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'home_images',
                        public_id: image_title,
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

            const newImage = new VisionMission({
                image_title,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });

            await newImage.save();

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

            if (req.file) {
                const streamifier = require('streamifier');
                const bufferStream = streamifier.createReadStream(req.file.buffer);

                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'home_images',
                            public_id: image_title,
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

                updates.image_url = uploadResult.secure_url;
                updates.public_id = uploadResult.public_id;
                updates.updatedAt = Date.now();

                await VisionMission.findByIdAndUpdate(id, updates, { new: true });

                return res.redirect('/admin/');
            } else {
                await VisionMission.findByIdAndUpdate(id, updates, { new: true });
                return res.redirect('/admin/');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating VisionMission item');
        }
    },

    async deleteVisionMission(req, res) {
        try {
            const { id } = req.params;
            const homeImage = await VisionMission.findById(id);
            if (!homeImage) {
                return res.status(404).send('VisionMission image not found');
            }

            const publicId = homeImage.public_id;

            await cloudinary.uploader.destroy(publicId);

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

            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }

            const streamifier = require('streamifier');
            const bufferStream = streamifier.createReadStream(req.file.buffer);

            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'home_images',
                        public_id: image_title,
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

            const newImage = new Environment({
                image_title,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });

            await newImage.save();

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

            if (req.file) {
                const streamifier = require('streamifier');
                const bufferStream = streamifier.createReadStream(req.file.buffer);

                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'home_images',
                            public_id: image_title,
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

                updates.image_url = uploadResult.secure_url;
                updates.public_id = uploadResult.public_id;
                updates.updatedAt = Date.now();

                await Environment.findByIdAndUpdate(id, updates, { new: true });

                return res.redirect('/admin/');
            } else {
                await Environment.findByIdAndUpdate(id, updates, { new: true });
                return res.redirect('/admin/');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating environment item');
        }
    },

    async deleteEnvironment(req, res) {
        try {
            const { id } = req.params;
            const homeImage = await Environment.findById(id);
            if (!homeImage) {
                return res.status(404).send('Envirement image not found');
            }

            const publicId = homeImage.public_id;

            await cloudinary.uploader.destroy(publicId);

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
            if (!req.file) {
                return res.status(400).send('No file uploaded');
            }
            const streamifier = require('streamifier');
            const bufferStream = streamifier.createReadStream(req.file.buffer);
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'home_images',
                        public_id: image_title,
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
            const newTeacher = new Teacher({
                name,
                designation,
                image_title,
                image_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            });
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
            if (req.file) {
                const streamifier = require('streamifier');
                const bufferStream = streamifier.createReadStream(req.file.buffer);

                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'home_images',
                            public_id: image_title,
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

                updates.image_url = uploadResult.secure_url;
                updates.public_id = uploadResult.public_id;
                updates.updatedAt = Date.now();

                await Teacher.findByIdAndUpdate(id, updates, { new: true });
                res.redirect('/admin/');
            } else {
                await Environment.findByIdAndUpdate(id, updates, { new: true });
                return res.redirect('/admin/');
            }
        } catch (err) {
            console.error(err);
            res.status(500).send('Error updating teacher');
        }
    },

    async deleteTeacher(req, res) {
        try {
            const { id } = req.params;
            const homeImage = await Teacher.findById(id);
            if (!homeImage) {
                return res.status(404).send('Teacher image not found');
            }

            const publicId = homeImage.public_id;

            await cloudinary.uploader.destroy(publicId);

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
    },
    async getHomeImageById(req, res) {
        try {
            const { id } = req.params;
            const homeImage = await Homeimg.findById(id).select('image_url');

            if (!homeImage || !homeImage.image_url) {
                return res.status(404).send("Home image not found");
            }

            const imageUrl = homeImage.image_url;

            https.get(imageUrl, (response) => {
                if (response.statusCode !== 200) {
                    console.log(`Error fetching image: ${response.statusCode}`);
                    return res.status(500).send('Error fetching image from Cloudinary');
                }
                const ext = path.extname(imageUrl);
                const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
                console.log(`Detected MIME type: ${mimeType}`);

                res.setHeader('Content-Type', mimeType);
                response.pipe(res);
                console.log('Piping image data to response');
            }).on('error', (err) => {
                console.error('Error during https request:', err);
                return res.status(500).send('Error fetching image from Cloudinary');
            });

        } catch (err) {
            console.error('Error retrieving home image:', err);
            res.status(500).send('Error retrieving home image test');
        }
    }
};