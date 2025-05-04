import { HltvService } from "./hltv.service";

export class StreamEmbedService {
  static async getLiveStreamUrl(): Promise<string | null> {
    const matches = await HltvService.getLiveMatches();
    const hasLiveMatch = matches.some((match) => match.status === "live");
    if (hasLiveMatch) {
      return "https://twitch.tv/furia";
    }
    return null;
  }
}
