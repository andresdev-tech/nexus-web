import { GoogleGenAI } from "@google/genai";

export class GeminiProvider {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }

    async generateResponse(prompt: string) {
        const result = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return result.text ?? 'Lo siento, no pude generar una respuesta en este momento.';
    }

}