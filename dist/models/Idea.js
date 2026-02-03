"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IdeaSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['open', 'done'], default: 'open' },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Idea', IdeaSchema);
//# sourceMappingURL=Idea.js.map