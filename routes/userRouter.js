const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, changePassword } = require("../controllers/authController");
const isLoggedin = require('../middlewares/isLoggedin');

// Simple GET route
router.get("/", (req, res) => {
    res.status(200).send("users");
});

// POST /register route
router.post("/register", async (req, res) => {
    try {
        await registerUser(req, res);
        // No need to send a response here, as it's handled in registerUser
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// POST /login route
router.post("/login", async (req, res) => {
    try {
        await loginUser(req, res);
        // No need to send a response here, as it's handled in loginUser
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// POST /logout route
router.get("/logout", async (req, res) => {
    try {
        await logoutUser(req, res);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


router.post("/change-password/", isLoggedin, async (req, res) => {
    try {

        await changePassword(req, res);
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
module.exports = router;
