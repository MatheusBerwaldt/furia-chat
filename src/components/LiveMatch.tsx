"use client";

import { useState, useEffect } from "react";
import { HltvService, MatchData } from "../services/hltv.service";

export default function LiveMatch() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const liveMatches = await HltvService.getLiveMatches();
        setMatches(liveMatches);
      } catch (error) {
        console.error("Erro ao buscar partidas:", error);
      } finally {
        setLoading(false);
      }
    };

    // Busca inicial
    fetchMatches();

    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchMatches, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furia-green"></div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Nenhuma partida encontrada
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-black border-2 border-furia-green rounded-lg p-4"
        >
          <div className="text-center text-furia-green mb-2">{match.event}</div>

          <div className="flex justify-between items-center mb-2">
            <div className="text-left">
              <div className="font-bold">{match.team1}</div>
              <div className="text-2xl font-bold text-furia-green">
                {match.score1}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-gray-400">VS</div>
              <div className="text-sm text-gray-400">{match.currentMap}</div>
            </div>

            <div className="text-right">
              <div className="font-bold">{match.team2}</div>
              <div className="text-2xl font-bold text-furia-green">
                {match.score2}
              </div>
            </div>
          </div>

          {match.status === "live" && match.topFragger && (
            <div className="text-center text-sm text-gray-400">
              Top Fragger: {match.topFragger.name} ({match.topFragger.kills}{" "}
              kills)
            </div>
          )}

          {match.status === "upcoming" && (
            <div className="text-center text-sm text-gray-400">
              Próxima partida: {new Date(match.date).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
