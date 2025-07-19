// lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

// Initialize the client with the key from the environment variable
export const gemini = new GoogleGenerativeAI(apiKey);