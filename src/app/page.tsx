import ChatBot from "@/components/ChatBot";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-lg">
        FURIA CS Chatbot
      </h1>
      <p className="text-gray-700 mb-8 text-center max-w-xl">
        Converse com o bot oficial da FURIA, veja status de jogos, curiosidades,
        mande energia para o time e envie sugestões!
      </p>
      <ChatBot />
      <p className="text-xs text-gray-400 mt-4">
        Powered by FURIA • Feito para fãs 💚🖤
      </p>
    </main>
  );
}
