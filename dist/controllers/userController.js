"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id.toString() }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    const { pseudo, email, password } = req.body;
    if (!pseudo || !email || !password) {
        return res.status(400).json({ error: 'Please provide pseudo, email and password' });
    }
    try {
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            pseudo,
            email,
            password: hashed,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                pseudo: user.pseudo,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }
    try {
        const user = await User_1.default.findOne({ email });
        if (user && user.password && (await bcryptjs_1.default.compare(password, user.password))) {
            res.json({
                _id: user._id,
                pseudo: user.pseudo,
                email: user.email,
                token: generateToken(user._id),
            });
        }
        else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.loginUser = loginUser;
const getProfile = async (req, res) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: 'Not authorized' });
    res.json({ _id: user._id, pseudo: user.pseudo, email: user.email });
};
exports.getProfile = getProfile;
