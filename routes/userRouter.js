const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/register', async (req, res) => {
    try {
        let {
            email,
            password,
            passwordCheck,
            displayName
        } = req.body;

        //Validation
        if (!email || !password || !passwordCheck) {
            return res.status(400).json({
                msg: "Missing Fields"
            });
        }
        const existingUser = await User.findOne({
            email: email
        });
        if (existingUser) {
            return res.status(400).json({
                msg: "A User with that email already exist..."
            });
        }

        if (password.length < 5) {
            return res.status(400).json({
                msg: "Password needs to be at least 6 characters"
            });
        }
        if (password !== passwordCheck) {
            return res.status(400).json({
                msg: "Passwords do not match"
            });
        }

        if (!displayName)
            displayName = email;

        // Encrypting Password
        const salt = await bcrypt.genSalt();
        const passwordHashed = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            password: passwordHashed,
            displayName
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            err
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const {
            email,
            password,
        } = req.body;

        //Validation
        if (!email || !password) {
            return res.status(400).json({
                msg: "Missing Fields"
            });
        }
        const user = await User.findOne({
            email: email
        });
        if (!user) {
            return res.status(400).json({
                msg: "Email is not registered"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Invalid Credentials..."
            });
        }

        // Creating JWT
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_TOKEN);

        // Everything was successful
        res.status(202).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                display: user.displayName
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            err
        });
    }
});

module.exports = router;