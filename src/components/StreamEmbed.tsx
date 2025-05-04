"use client";

import ReactPlayer from "react-player";

// MOCK: Sempre exibe o vídeo de exemplo do YouTube
export default function StreamEmbed() {
  return (
    <div className="w-full aspect-video bg-black border-2 border-furia-green rounded-lg overflow-hidden">
      <ReactPlayer
        url="https://youtu.be/dxTUf9bw0SM"
        width="100%"
        height="100%"
        controls
        playing
        muted={false}
      />
    </div>
  );
}
