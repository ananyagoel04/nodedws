const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        req.flash("errorMessage", "You need to login first");
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("errorMessage", "You need to login first");
            return res.redirect("/login");
        }

        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            req.flash("errorMessage", "Your session has expired. Please log in again.");
        } else {
            req.flash("errorMessage", "You need to login first");
        }
        return res.redirect("/login");
    }
};
