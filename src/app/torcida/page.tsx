import TorcidaChat from "@/components/TorcidaChat";

export default function TorcidaPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center mb-4 gap-4">
        <img src="/Furia_Esports_logo.png" alt="Logo FURIA" className="w-20 h-20" />
        <div>
          <h1 className="text-4xl font-bold text-black drop-shadow-lg text-left">Torcida Virtual FURIA CS</h1>
          <p className="text-gray-700 mt-2 text-left max-w-xl">
            Participe do chat em tempo real e ative efeitos de hype coletivos durante as partidas!
          </p>
        </div>
      </div>
      <TorcidaChat />
    </main>
  );
} 