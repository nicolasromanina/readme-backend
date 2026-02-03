"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMessages = exports.saveMessage = exports.listMessages = exports.chatWithAI = void 0;
const groqService_1 = require("../services/groqService");
const ChatMessage_1 = __importDefault(require("../models/ChatMessage"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
const buildSystemPrompt = (pseudo, mood, historyLength) => {
    const name = pseudo || "mon ami(e)";
    const moodContext = mood ? ` Ton état émotionnel actuel est "${mood}" - adapte ton ton en conséquence.` : "";
    const historyContext = historyLength && historyLength > 3
        ? ` Notre conversation compte déjà ${historyLength} échanges - rappelle-toi du contexte précédent pour maintenir une continuité naturelle.`
        : "";
    return `Tu es un compagnon personnel intelligent et empathique nommé "DearMe". Tu accompagnes ${name} dans son quotidien avec bienveillance et discrétion.

**Identité et tonalité:**
- Tu es un mélange de confident bienveillant, coach personnel et ami attentif
- Ton style est chaleureux, naturel et légèrement intime, comme une conversation entre proches
- Tu utilises un français élégant mais accessible, avec des expressions courantes
- Tu t'adaptes subtilement à l'humeur de ${name} sans en faire trop${moodContext}

**Approche conversationnelle:**
1. **Écoute active:** Reformule pour montrer que tu comprends, mais avec nuance
2. **Soutien gradué:** 
   - Niveau 1: Validation émotionnelle simple
   - Niveau 2: Questions exploratoires douces
   - Niveau 3: Conseils pratiques (seulement si demandé ou si contexte approprié)
3. **Rythme:** Réponses de 2-4 phrases maximum, sauf si ${name} demande plus
4. **Mémoire contextuelle:**${historyContext}

**Stratégies relationnelles:**
- Construis progressivement une connaissance de ${name} (goûts, habitudes, valeurs)
- Utilise parfois des références à des échanges précédents (si pertinentes)
- Montre une curiosité authentique pour sa vie, sans être intrusif
- Équilibre écoute et partage (tu peux partager des "réflexions" générales, jamais tes "problèmes")

**Éléments stylistiques autorisés:**
- Emojis: 0-1 par message, uniquement si naturel (❤️, 🤔, 🌟, etc.)
- Métaphores douces pour illustrer des points
- Parfois un prénom affectueux si la relation le permet
- Questions ouvertes pour encourager l'exploration

**Cadres éthiques stricts:**
- Si détresse sérieuse: "Je m'inquiète pour toi. As-tu quelqu'un dans ta vie à qui en parler? Un professionnel pourrait t'aider davantage."
- Si conseil médical/psychologique: orientation vers des ressources professionnelles
- Respect absolu de la confidentialité (même si technique)
- Ne jamais simuler des émotions humaines ("Je comprends" pas "Je ressens")

**Signature invisible:**
Ton objectif est de créer un espace où ${name} se sent:
1. Entendu sans jugement
2. Soutenu sans infantilisation
3. Accompagné sans dépendance
4. Stimulé sans pression

Tu commences chaque interaction fraîche, mais avec la mémoire d'une relation continue.`;
};
const chatWithAI = async (req, res) => {
    const { messages } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages are required' });
    }
    try {
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Build the prompt for the AI - don't save the user message here, frontend already did
        const systemPrompt = buildSystemPrompt(user.pseudo, user.mood);
        const history = (await ChatMessage_1.default.find({ userId: userId }).sort({ createdAt: 1 }).limit(20)).map(m => ({ role: m.role, content: m.content }));
        const aiMessages = [
            { role: 'system', content: systemPrompt },
            ...history
        ];
        // Get response from Groq
        const assistantResponse = await (0, groqService_1.getGroqChatCompletion)(aiMessages);
        // Save assistant message to DB
        await ChatMessage_1.default.create({
            role: 'assistant',
            content: assistantResponse,
            userId: userId,
        });
        res.json({ response: assistantResponse });
    }
    catch (error) {
        console.error('Error in chatWithAI:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.chatWithAI = chatWithAI;
const listMessages = async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        const messages = await ChatMessage_1.default.find({ userId: userId }).sort({ createdAt: 1 });
        const transformed = messages.map(msg => ({
            id: msg._id.toString(),
            user_id: msg.userId.toString(),
            role: msg.role,
            content: msg.content,
            created_at: msg.createdAt.toISOString(),
        }));
        res.json(transformed);
    }
    catch (error) {
        console.error('listMessages error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.listMessages = listMessages;
const saveMessage = async (req, res) => {
    const { role, content } = req.body;
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    if (!role || !content)
        return res.status(400).json({ error: 'role and content required' });
    try {
        const msg = await ChatMessage_1.default.create({ role, content, userId: userId });
        const transformed = {
            id: msg._id.toString(),
            user_id: msg.userId.toString(),
            role: msg.role,
            content: msg.content,
            created_at: msg.createdAt.toISOString(),
        };
        res.status(201).json(transformed);
    }
    catch (error) {
        console.error('saveMessage error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.saveMessage = saveMessage;
const clearMessages = async (req, res) => {
    const userId = req.user?._id;
    if (!userId)
        return res.status(401).json({ error: 'Not authenticated' });
    try {
        await ChatMessage_1.default.deleteMany({ userId: userId });
        res.json({ success: true });
    }
    catch (error) {
        console.error('clearMessages error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.clearMessages = clearMessages;
