"use client";

import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { HltvService } from "../services/hltv.service";

export default function StreamEmbed() {
  const [isLive, setIsLive] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        // Verifica se há partidas ao vivo da FURIA
        const matches = await HltvService.getLiveMatches();
        const hasLiveMatch = matches.some((match) => match.status === "live");

        if (hasLiveMatch) {
          // Se houver partida ao vivo, tenta obter o link da stream
          // Aqui você pode implementar a lógica para obter o link da Twitch/YouTube
          // Por enquanto, vamos usar um link mockado
          setStreamUrl("https://twitch.tv/furia");
          setIsLive(true);
        } else {
          setIsLive(false);
          setStreamUrl(null);
        }
      } catch (error) {
        console.error("Erro ao verificar status da stream:", error);
        setIsLive(false);
        setStreamUrl(null);
      } finally {
        setLoading(false);
      }
    };

    // Verifica inicialmente
    checkLiveStatus();

    // Atualiza a cada 5 minutos
    const interval = setInterval(checkLiveStatus, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full aspect-video bg-black border-2 border-furia-green rounded-lg flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-furia-green"></div>
      </div>
    );
  }

  if (!isLive || !streamUrl) {
    return (
      <div className="w-full aspect-video bg-black border-2 border-furia-green rounded-lg flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <div className="text-2xl mb-2">Sem transmissão</div>
          <div className="text-sm">A FURIA não está em live no momento</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black border-2 border-furia-green rounded-lg overflow-hidden">
      <ReactPlayer
        url={streamUrl}
        width="100%"
        height="100%"
        controls
        playing
        muted={false}
      />
    </div>
  );
}
