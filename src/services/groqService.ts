import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Models listed in order of preference
const AVAILABLE_MODELS = [
  'mixtral-8x7b-32768',
  'llama-3.1-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];

export const getGroqChatCompletion = async (messages: ChatMessage[]): Promise<string> => {
  let lastError: any = null;

  for (const model of AVAILABLE_MODELS) {
    try {
      console.log(`Attempting to use model: ${model}`);
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model,
      });

      console.log(`Successfully used model: ${model}`);
      return chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
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
