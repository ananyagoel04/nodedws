const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owner");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        try {
            // Check if the owner already exists (use findOne or exists for better performance)
            let owner = await ownerModel.findOne({ email: req.body.email });
            
            // Check if the owner already exists
            if (owner) {
                return res.status(503).send("Owner already exists");
            }

            // Destructure the required fields from the request body
            let { fullname, email, password } = req.body;

            // Check if password and email are provided
            if (!email || !password || !fullname) {
                return res.status(400).json({ message: "All fields are required." });
            }

            // Hash the password using bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create the new owner
            let createdOwner = await ownerModel.create({
                fullname,
                email,
                password: hashedPassword,
            });

            const token = generateToken(createdOwner);

            // Set the token as a cookie
            res.cookie("token", token, { httpOnly: true });

            // Respond with the created owner
            res.status(201).send(createdOwner);
        } catch (error) {
            console.error(error); // Fix variable name to `error`
            return res.status(500).json({ message: error.message });
        }
    });
}

module.exports = router;
