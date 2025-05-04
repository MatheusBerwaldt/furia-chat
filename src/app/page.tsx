import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center mb-4 gap-4">
        <img src="/Furia_Esports_logo.png" alt="Logo FURIA" className="w-20 h-20" />
        <div>
          <h1 className="text-4xl font-bold text-black drop-shadow-lg text-left">FURIA CS Chatbot</h1>
          <p className="text-gray-700 mt-2 text-left max-w-xl">
            Converse com o bot oficial da FURIA, veja status de jogos, curiosidades,
            mande energia para o time e envie sugestões!
          </p>
        </div>
      </div>
      <ChatBot />
      <p className="text-xs text-gray-400 mt-4">
        Powered by FURIA • Feito para fãs 🖤
      </p>
    </main>
  );
}
