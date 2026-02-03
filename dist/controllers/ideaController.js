"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteIdea = exports.updateIdea = exports.listIdeas = exports.createIdea = void 0;
const Idea_1 = __importDefault(require("../models/Idea"));
const createIdea = async (req, res) => {
    const { title, description, tags } = req.body;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    if (!title)
        return res.status(400).json({ error: 'title is required' });
    try {
        const idea = await Idea_1.default.create({
            userId: userId,
            title,
            description,
            tags
        });
        res.status(201).json(idea);
    }
    catch (error) {
        console.error('createIdea error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createIdea = createIdea;
const listIdeas = async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const ideas = await Idea_1.default.find({ userId: userId }).sort({ createdAt: -1 });
        res.json(ideas);
    }
    catch (error) {
        console.error('listIdeas error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.listIdeas = listIdeas;
const updateIdea = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const updated = await Idea_1.default.findOneAndUpdate({
            _id: id,
            userId: userId
        }, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Not found' });
        res.json(updated);
    }
    catch (error) {
        console.error('updateIdea error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateIdea = updateIdea;
const deleteIdea = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const deleted = await Idea_1.default.findOneAndDelete({
            _id: id,
            userId: userId
        });
        if (!deleted)
            return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    }
    catch (error) {
        console.error('deleteIdea error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteIdea = deleteIdea;
//# sourceMappingURL=ideaController.js.map