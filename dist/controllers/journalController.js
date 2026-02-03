"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEntry = exports.updateEntry = exports.getEntry = exports.listEntries = exports.createEntry = void 0;
const JournalEntry_1 = __importDefault(require("../models/JournalEntry"));
const createEntry = async (req, res) => {
    const { title, content, mood } = req.body;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    if (!content)
        return res.status(400).json({ error: 'content is required' });
    try {
        const entry = await JournalEntry_1.default.create({
            userId: userId,
            title,
            content,
            mood
        });
        const transformed = {
            id: entry._id.toString(),
            user_id: entry.userId.toString(),
            title: entry.title,
            content: entry.content,
            mood_at_writing: entry.mood,
            created_at: entry.createdAt.toISOString(),
            updated_at: entry.updatedAt.toISOString(),
        };
        res.status(201).json(transformed);
    }
    catch (error) {
        console.error('createEntry error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createEntry = createEntry;
const listEntries = async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const entries = await JournalEntry_1.default.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(100);
        const transformed = entries.map(entry => ({
            id: entry._id.toString(),
            user_id: entry.userId.toString(),
            title: entry.title,
            content: entry.content,
            mood_at_writing: entry.mood,
            created_at: entry.createdAt.toISOString(),
            updated_at: entry.updatedAt.toISOString(),
        }));
        res.json(transformed);
    }
    catch (error) {
        console.error('listEntries error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.listEntries = listEntries;
const getEntry = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const entry = await JournalEntry_1.default.findOne({
            _id: id,
            userId: userId
        });
        if (!entry)
            return res.status(404).json({ error: 'Not found' });
        const transformed = {
            id: entry._id.toString(),
            user_id: entry.userId.toString(),
            title: entry.title,
            content: entry.content,
            mood_at_writing: entry.mood,
            created_at: entry.createdAt.toISOString(),
            updated_at: entry.updatedAt.toISOString(),
        };
        res.json(transformed);
    }
    catch (error) {
        console.error('getEntry error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getEntry = getEntry;
const updateEntry = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const updated = await JournalEntry_1.default.findOneAndUpdate({
            _id: id,
            userId: userId
        }, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Not found' });
        const transformed = {
            id: updated._id.toString(),
            user_id: updated.userId.toString(),
            title: updated.title,
            content: updated.content,
            mood_at_writing: updated.mood,
            created_at: updated.createdAt.toISOString(),
            updated_at: updated.updatedAt.toISOString(),
        };
        res.json(transformed);
    }
    catch (error) {
        console.error('updateEntry error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.updateEntry = updateEntry;
const deleteEntry = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const deleted = await JournalEntry_1.default.findOneAndDelete({
            _id: id,
            userId: userId
        });
        if (!deleted)
            return res.status(404).json({ error: 'Not found' });
        res.json({ success: true });
    }
    catch (error) {
        console.error('deleteEntry error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.deleteEntry = deleteEntry;
