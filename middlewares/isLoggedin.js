const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

module.exports = async function (req, res, next) {
    if (!req.cookies.token) {
        return res.redirect("/login?errorMessage=You need to login first");
    }

    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.redirect("/login?errorMessage=You need to login first");
        }

        req.user = user;
        next();
    } catch (err) {
        return res.redirect("/login?errorMessage=You need to login first");
    }
};
