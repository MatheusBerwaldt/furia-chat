import OpenAI from "openai";

export class OpenAIService {
  private static readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  static async processSuggestion(suggestion: string): Promise<string> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especializado em CS:GO e FURIA. Analise sugestões e forneça feedback construtivo.",
          },
          {
            role: "user",
            content: suggestion,
          },
        ],
        model: "gpt-3.5-turbo",
      });

      return (
        completion.choices[0]?.message?.content ||
        "Não foi possível processar a sugestão."
      );
    } catch (error) {
      console.error("Erro ao processar sugestão:", error);
      return "Ocorreu um erro ao processar sua sugestão. Por favor, tente novamente mais tarde.";
    }
  }
}
