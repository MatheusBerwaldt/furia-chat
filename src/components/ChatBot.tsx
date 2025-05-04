"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const BOT_AVATAR = "/furia-bot.png"; // Coloque um avatar do jaguar ou logo da FURIA em public/
const USER_AVATAR = "/user.png"; // Opcional: avatar genérico para usuário

const SUGESTOES = [
  { comando: "/jogos", label: "Ver jogos ao vivo" },
  { comando: "/curiosidade", label: "Curiosidade FURIA" },
  { comando: "/torcida", label: "Mandar energia!" },
  { comando: "/sugestao", label: "Enviar sugestão" },
];

const CURIOSIDADES = [
  "A FURIA foi fundada em 2017 e rapidamente se tornou referência no CS brasileiro!",
  "O mascote da FURIA é uma onça, símbolo de força e agilidade.",
  "A torcida da FURIA é conhecida por ser uma das mais apaixonadas do cenário!",
  "FURIA já representou o Brasil em diversos Majors internacionais.",
];

const TORCIDA = [
  "VAMO FURIA! 🐆💚",
  "Acredita, FURIA! #DaleFURIA",
  "A onça vai rugir hoje! 🐾",
  "Confia no time! 💚🖤",
];

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bem-vindo ao chat oficial da FURIA! 🐆\n\nEscolha um comando ou mande sua mensagem para interagir.\n\nComandos: /jogos, /curiosidade, /torcida, /sugestao",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll automático para a última mensagem
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (msg?: string) => {
    const userMsg = msg || input.trim();
    if (!userMsg) return;
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setIsSending(true);

    setTimeout(async () => {
      let botMsg = "";
      if (userMsg.toLowerCase().startsWith("/jogos")) {
        botMsg = "Buscando status dos jogos ao vivo...";
        // Aqui você pode integrar com o componente LiveMatch ou API
        botMsg = "No momento, não há jogos ao vivo. Fique ligado!";
      } else if (userMsg.toLowerCase().startsWith("/curiosidade")) {
        botMsg = getRandom(CURIOSIDADES);
      } else if (userMsg.toLowerCase().startsWith("/torcida")) {
        botMsg = getRandom(TORCIDA);
      } else if (userMsg.toLowerCase().startsWith("/sugestao")) {
        botMsg = "Para enviar uma sugestão, use o formulário abaixo do chat!";
      } else {
        botMsg =
          "Mensagem recebida! Digite /jogos, /curiosidade, /torcida ou /sugestao para interagir mais.";
      }
      setMessages((msgs) => [...msgs, { from: "bot", text: botMsg }]);
      setIsSending(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[70vh] bg-black border-2 border-green-500 rounded-xl shadow-lg overflow-hidden">
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-black"
        style={{ scrollbarColor: "#22c55e #000" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <img
                src={BOT_AVATAR}
                alt="FURIA Bot"
                className="w-8 h-8 rounded-full mr-2 border-2 border-green-500 bg-white"
              />
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-base whitespace-pre-line ${
                msg.from === "bot"
                  ? "bg-green-900 text-green-300 border border-green-500"
                  : "bg-green-500 text-black border border-green-400"
              }`}
            >
              {msg.text}
            </motion.div>
            {msg.from === "user" && (
              <img
                src={USER_AVATAR}
                alt="Você"
                className="w-8 h-8 rounded-full ml-2 border-2 border-green-500 bg-white"
              />
            )}
          </div>
        ))}
      </div>
      <div className="bg-black border-t border-green-700 p-2 flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap mb-1">
          {SUGESTOES.map((s) => (
            <button
              key={s.comando}
              className="bg-green-900 text-green-300 border border-green-500 rounded-full px-3 py-1 text-xs hover:bg-green-500 hover:text-black transition"
              onClick={() => handleSend(s.comando)}
              disabled={isSending}
            >
              {s.label}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="flex-1 bg-black border-2 border-green-500 rounded-lg px-4 py-2 text-white placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            autoFocus
          />
          <button
            type="submit"
            className="bg-green-500 text-black font-bold px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-60"
            disabled={isSending || !input.trim()}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
