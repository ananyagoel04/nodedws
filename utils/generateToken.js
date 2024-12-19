const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const secretKey = process.env.JWT_KEY;
    if (!secretKey) {
        throw new Error("JWT_KEY is not defined");
    }
    return jwt.sign({ email: user.email, id: user._id }, secretKey);
};

module.exports.generateToken = generateToken;
