import OpenAI from "openai";

export class DeepSeekProvider {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
  }

  async generateResponse(prompt: string): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    return (
      completion.choices[0]?.message?.content ??
      "No se obtuvo respuesta."
    );
  }
}