import { MatchData } from "./hltv.service";

export interface Bet {
  id: number;
  matchId: number;
  team: string;
  valor: number;
  status: "aberta" | "ganhou" | "perdeu";
  match: MatchData;
}

const BETS_KEY = "furia_apostas";

export function getBetsLocal(): Bet[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BETS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setBetsLocal(bets: Bet[]) {
  localStorage.setItem(BETS_KEY, JSON.stringify(bets));
}

export function addBet(bet: Bet) {
  const bets = getBetsLocal();
  bets.push(bet);
  setBetsLocal(bets);
}

export function updateBetStatus(betId: number, status: "ganhou" | "perdeu") {
  const bets = getBetsLocal();
  const idx = bets.findIndex(b => b.id === betId);
  if (idx !== -1) {
    bets[idx].status = status;
    setBetsLocal(bets);
  }
}

export function clearBets() {
  setBetsLocal([]);
} 