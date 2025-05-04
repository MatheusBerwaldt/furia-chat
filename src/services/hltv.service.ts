export interface MatchData {
  id: number;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  currentMap: string;
  topFragger: {
    name: string;
    kills: number;
  };
  status: "live" | "upcoming";
  event: string;
  date: string;
}

export class HltvService {
  private static readonly FURIA_TEAM_ID = 8297;
  private static readonly HLTV_URL = "https://www.hltv.org/team/8297/furia";

  static async getLiveMatches(): Promise<MatchData[]> {
    try {
      // Dados mockados para demonstração
      const mockMatches: MatchData[] = [
        {
          id: 1,
          team1: "FURIA",
          team2: "MIBR",
          score1: 12,
          score2: 8,
          currentMap: "Mirage",
          topFragger: {
            name: "KSCERATO",
            kills: 25,
          },
          status: "live",
          event: "ESL Pro League",
          date: new Date().toISOString(),
        },
        {
          id: 2,
          team1: "FURIA",
          team2: "Heroic",
          score1: 0,
          score2: 0,
          currentMap: "TBD",
          topFragger: {
            name: "N/A",
            kills: 0,
          },
          status: "upcoming",
          event: "ESL Pro League",
          date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
        },
      ];

      return mockMatches;
    } catch (error) {
      console.error("Erro ao buscar partidas da FURIA:", error);
      return [];
    }
  }
}
