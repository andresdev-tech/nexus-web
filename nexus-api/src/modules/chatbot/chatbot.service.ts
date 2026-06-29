import { ChatbotRepository } from "./chatbot.repository";
import { GeminiProvider } from "./providers/gemini.provider";
import { DeepSeekProvider } from "./providers/deepseek.provider";
import { chatbotPrompt } from "./prompts/chatbot.prompt";
import { buildContext } from "./utils/context-builder.util";

export class ChatbotService {
  private repository: ChatbotRepository;
  private provider: GeminiProvider | DeepSeekProvider;

  constructor() {
    this.repository = new ChatbotRepository();

    this.provider =
      process.env.AI_PROVIDER === "deepseek"
        ? new DeepSeekProvider()
        : new GeminiProvider();
  }

  async askQuestion(
    usuarioId: number,
    question: string
  ) {
    const documents =
      await this.repository.searchDocuments(question);

    const context =
      buildContext(documents);

    const prompt = `
${chatbotPrompt}

CONTEXTO:

${context}

PREGUNTA:

${question}
`;

    const response =
      await this.provider.generateResponse(prompt);

    await this.repository.saveHistory({
      usuarioId,
      pregunta: question,
      respuesta: response,
    });

    return response;
  }

  async getHistory(usuarioId: number) {
    return this.repository.getHistory(usuarioId)
  }
}
