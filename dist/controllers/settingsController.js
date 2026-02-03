"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = void 0;
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const updateSettings = async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    const allowed = ['pseudo', 'mood', 'email'];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined)
            updates[key] = req.body[key];
    }
    try {
        const user = await User_1.default.findByIdAndUpdate(userId, updates, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json(user);
    }
    catch (error) {
        console.error('updateSettings error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateSettings = updateSettings;
//# sourceMappingURL=settingsController.js.map