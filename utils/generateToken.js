const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    const secretKey = process.env.JWT_KEY;
    if (!secretKey) {
        throw new Error("JWT_KEY is not defined");
    }

    const token = jwt.sign(
        { email: user.email, id: user._id },
        secretKey,
        { expiresIn: '12h' }
    );

    return token;
};

module.exports.generateToken = generateToken;
