"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    pseudo: {
        type: String,
        required: true,
    },
    mood: {
        type: String,
    },
    email: {
        type: String,
        index: true,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
    },
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
