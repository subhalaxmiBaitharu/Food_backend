const express = require("express");
const router = express.Router();
const User = require("../schemas/user.schema")
const bcrypt = require("bcrypt");
const { isLoggedIn } = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User details fetched successfully", user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/signup", async (req, res) => {
    console.log("singnup called")
    try {
        const { email, password, name, phone } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            res.status(400).json({ message: "Email already taken" });
            return
        }
        else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await new User({ email, password: hashedPassword, name, phone }).save();
            const token = jwt.sign({ email }, process.env.JWT_SECRET);
            return res.status(200).json({ message: "User created successfully", token, id: newUser._id });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid email or password" });
            return
        }
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token, id: user._id });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;



