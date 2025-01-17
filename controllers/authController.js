const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        const { email, password, fullname } = req.body;
        const foundUser = await userModel.findOne({ email });

        if (foundUser) {
            return res.render("/login", { errorMessage: "User already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await userModel.create({ email, password: hash, fullname });
        const token = generateToken(user);

        res.cookie("token", token);
        return res.redirect("/admin/about");
    } catch (err) {
        return res.render("register", { errorMessage: "Something went wrong. Please try again." });
    }
};


module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.render("login", { errorMessage: "Email not found." });
        }

        const result = await bcrypt.compare(password, user.password);
        if (result) {
            const token = generateToken(user);
            res.cookie("token", token);
            return res.redirect("/admin/");
        } else {
            return res.render("login", { errorMessage: "Incorrect password. Please try again." });
        }
    } catch (err) {
        return res.redirect("/login?errorMessage=An error occurred. Please try again.");
    }
};



module.exports.logoutUser = function (req, res) {
    try {
        res.clearCookie("token");
        return res.status(200).redirect("/login");
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: "Something went wrong during logout. Please try again!" });
    }
}



module.exports.changePassword = async function (req, res) {
    try {
        // Extract userId from URL parameters and password details from the body
        const { userId ,updatedPassword, confirmPassword } = req.body;

        // Ensure all required fields are present
        if (!updatedPassword || !confirmPassword) {
            return res.status(500).json({ message: "Both new password and confirm password are required." });
        }

        // Check if updatedPassword and confirmPassword match
        if (updatedPassword !== confirmPassword) {
            return res.status(500).json({ message: "New password and confirm password do not match." });
        }

        // Find the user by userId
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Hash the updated password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updatedPassword, salt);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        // Return a success message
        return res.redirect("/admin/users");
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: "An error occurred while changing the password. Please try again." });
    }
};
