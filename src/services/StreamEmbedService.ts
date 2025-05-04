import { HltvService } from "./hltv.service";

export class StreamEmbedService {
  static async getLiveStreamUrl(): Promise<string | null> {
    const matches = await HltvService.getLiveMatches();
    const hasLiveMatch = matches.some((match) => match.status === "live");
    if (hasLiveMatch) {
      // Aqui pode ser implementada lógica real para buscar a URL da stream
      return "https://twitch.tv/furia";
    }
    return null;
  }
}
