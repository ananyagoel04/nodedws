const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports = async function (req, res, next) {
    // Check if token exists in cookies
    if (!req.cookies.token) {
        return res.redirect("/login?errorMessage=You need to login first");
    }

    try {
        // Verify token
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        // Fetch user based on email decoded from token
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.redirect("/login?errorMessage=You need to login first");
        }

        // Attach user info to the request object
        req.user = user;

        // Proceed to the next middleware/handler
        next();
    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return res.redirect("/login?errorMessage=Your session has expired. Please log in again.");
        }

        return res.redirect("/login?errorMessage=You need to login first");
    }
};
