"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret)
                return res.status(500).json({ error: 'Server misconfigured' });
            try {
                const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
                if (decoded?.id) {
                    const user = await User_1.default.findById(decoded.id).select('-__v -password');
                    if (!user)
                        return res.status(401).json({ error: 'Not authorized, user not found' });
                    req.user = user;
                    return next();
                }
                return res.status(401).json({ error: 'Not authorized, token invalid' });
            }
            catch (err) {
                return res.status(401).json({ error: 'Not authorized, token failed' });
            }
        }
        catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }
    return res.status(401).json({ error: 'Not authorized, no token' });
};
exports.protect = protect;
//# sourceMappingURL=authMiddleware.js.map