import { HltvService, MatchData } from "./hltv.service";

export class LiveMatchService {
  static async getLiveMatches(): Promise<MatchData[]> {
    return await HltvService.getLiveMatches();
  }
}
