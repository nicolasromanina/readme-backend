"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MoodSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    level: { type: Number, required: true, min: 1, max: 5 },
    notes: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Mood', MoodSchema);
