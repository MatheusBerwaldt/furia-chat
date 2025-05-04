export class SuggestionService {
  static async sendSuggestion(
    text: string
  ): Promise<{ success: boolean; analysis?: string; error?: string }> {
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, analysis: data.analysis };
      } else {
        return { success: false, error: data.error || "Erro desconhecido" };
      }
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }
}
