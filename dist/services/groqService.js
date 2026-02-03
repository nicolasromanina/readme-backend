"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroqChatCompletion = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
// Models listed in order of preference
const AVAILABLE_MODELS = [
    'mixtral-8x7b-32768',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'gemma2-9b-it',
];
const getGroqChatCompletion = async (messages) => {
    let lastError = null;
    for (const model of AVAILABLE_MODELS) {
        try {
            console.log(`Attempting to use model: ${model}`);
            const chatCompletion = await groq.chat.completions.create({
                messages,
                model,
            });
            console.log(`Successfully used model: ${model}`);
            return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
        }
        catch (error) {
            lastError = error;
            console.error(`Model ${model} failed:`, error instanceof Error ? error.message : error);
            // Continue to next model
            continue;
        }
    }
    // All models failed
    console.error('All Groq models failed. Last error:', lastError);
    throw new Error('Failed to get chat completion from Groq - all models unavailable');
};
exports.getGroqChatCompletion = getGroqChatCompletion;
