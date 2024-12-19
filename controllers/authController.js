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
        return res.render("login", { errorMessage: "An error occurred. Please try again." });
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
