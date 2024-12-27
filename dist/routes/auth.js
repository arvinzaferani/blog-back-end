"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../utils/jwt");
const Users_1 = __importDefault(require("../models/Users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.post('/register', (async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await Users_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const salt = await bcrypt_1.default.genSalt(10);
        const hashedPass = await bcrypt_1.default.hash(password, salt);
        const newUser = new Users_1.default({ username, email, password: hashedPass });
        await newUser.save();
        res.status(201).json({ message: 'Hoora! User registered successfully!' });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
}));
router.post('/login', (async (req, res) => {
    const { username, password, email } = req.body;
    console.log(username, password, email);
    try {
        const user = await Users_1.default.findOne({ email });
        if (!user) {
            console.log('invalid credentials');
            return res.status(401).json({ message: 'invalid credentials' });
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'invalid password' });
        }
        const token = (0, jwt_1.generateToken)(user._id);
        res.status(200).json({ token: token, user_id: user._id });
    }
    catch (err) {
        res.status(500).json('internal server error');
    }
}));
exports.default = router;
