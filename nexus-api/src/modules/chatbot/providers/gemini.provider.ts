import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider {
  private model;

  constructor() {
    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    this.model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });
  }

  async generateResponse(prompt: string) {
    const result = await this.model.generateContent(prompt);

    return result.response.text();
  }
}