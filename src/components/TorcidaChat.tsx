"use client";

import React, { useState, useRef, useEffect } from "react";

function FireEffect({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex">
      <div className="absolute inset-0 animate-fire-borders" style={{ pointerEvents: 'none' }}>
        {/* Chamas animadas nas bordas */}
        <div className="absolute top-0 left-0 w-full h-4 fire-gradient animate-fire" />
        <div className="absolute bottom-0 left-0 w-full h-4 fire-gradient animate-fire" />
        <div className="absolute top-0 left-0 h-full w-4 fire-gradient-vertical animate-fire" />
        <div className="absolute top-0 right-0 h-full w-4 fire-gradient-vertical animate-fire" />
      </div>
      <style jsx global>{`
        .fire-gradient {
          background: linear-gradient(90deg, #ff9800 0%, #ff3d00 50%, #fffde4 100%);
          opacity: 0.85;
          filter: blur(2px);
        }
        .fire-gradient-vertical {
          background: linear-gradient(180deg, #ff9800 0%, #ff3d00 50%, #fffde4 100%);
          opacity: 0.85;
          filter: blur(2px);
        }
        @keyframes fire {
          0% { opacity: 0.7; filter: blur(2px); }
          50% { opacity: 1; filter: blur(4px); }
          100% { opacity: 0.7; filter: blur(2px); }
        }
        .animate-fire {
          animation: fire 0.7s infinite;
        }
      `}</style>
    </div>
  );
}

function FallenEffect({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <span className="text-[7rem] md:text-[10rem] drop-shadow-lg animate-fallen">😎</span>
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random()}s`,
            }}
          >
            🎉
          </span>
        ))}
      </div>
      <style jsx global>{`
        @keyframes fallen {
          0% { transform: scale(0.7) rotate(-10deg); opacity: 0.7; }
          50% { transform: scale(1.1) rotate(10deg); opacity: 1; }
          100% { transform: scale(0.7) rotate(-10deg); opacity: 0.7; }
        }
        .animate-fallen {
          animation: fallen 1.2s infinite;
        }
        .confetti {
          font-size: 2rem;
          animation: confetti-fall 1.5s linear infinite;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

const CURIOSIDADES = [
  "A FURIA foi fundada em 2017 e rapidamente se tornou referência no CS brasileiro!",
  "O mascote da FURIA é uma onça, símbolo de força e agilidade.",
  "A torcida da FURIA é conhecida por ser uma das mais apaixonadas do cenário!",
  "FURIA já representou o Brasil em diversos Majors internacionais.",
];
const TORCIDA = [
  "VAMO FURIA! 🐆🖤",
  "Acredita, FURIA! #DaleFURIA",
  "A onça vai rugir hoje! 🐾",
  "Confia no time! 🖤🖤",
];

const FAKE_USERS = [
  "torcedor123", "furioso", "oncaPreta", "csfan", "furia_love", "gamerBR", "hypeFuria", "torcidaCS", "furiaTOP", "furiaGOAT"
];
const FAKE_MESSAGES = [
  "VAMO FURIA! 🖤🐾", "Que jogada!", "Acredita!", "Dale FURIA!", "Confia no time!", "É ACE!", "CLUTCH TIME!", "FalleN monstro!", "Vamos virar!", "Que bala!", "🔥🔥🔥", "Só os brabos!", "Torcida tá on!"
];

function getRandomFakeMessage() {
  const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
  const text = FAKE_MESSAGES[Math.floor(Math.random() * FAKE_MESSAGES.length)];
  return { user, text, ts: Date.now() };
}

function getRandom(arr: string[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function TorcidaChat() {
  const [fireActive, setFireActive] = useState(false);
  const [fallenActive, setFallenActive] = useState(false);
  const [messages, setMessages] = useState<{user: string, text: string, ts: number}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Efeito: mensagens automáticas simulando chat real
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((msgs) => [...msgs, getRandomFakeMessage()].slice(-30));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Scroll automático para o fim
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Envio de mensagem do usuário
  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    setMessages((msgs) => [...msgs, { user: "Você", text: value, ts: Date.now() }]);
    if (value.toLowerCase() === "/acende") triggerFire();
    if (value.toLowerCase() === "/fallen" || value.toLowerCase().includes("fallen")) triggerFallen();
    if (value.toLowerCase() === "/curiosidade") sendCuriosidade();
    if (value.toLowerCase() === "/torcida") sendTorcida();
    if (inputRef.current) inputRef.current.value = "";
  }

  function triggerFire() {
    setFireActive(true);
    setTimeout(() => setFireActive(false), 3000);
  }

  function triggerFallen() {
    setFallenActive(true);
    setTimeout(() => setFallenActive(false), 3000);
  }

  function sendCuriosidade() {
    setMessages((msgs) => [...msgs, { user: "FURIA Bot", text: getRandom(CURIOSIDADES), ts: Date.now() }]);
  }

  function sendTorcida() {
    setMessages((msgs) => [...msgs, { user: "FURIA Bot", text: getRandom(TORCIDA), ts: Date.now() }]);
  }

  function handleFire() {
    triggerFire();
    setMessages((msgs) => [...msgs, { user: "Você", text: "🔥 Acende a FURIA!", ts: Date.now() }]);
  }

  function handleFallen() {
    triggerFallen();
    setMessages((msgs) => [...msgs, { user: "Você", text: "🎉 FALOU FALLEN?", ts: Date.now() }]);
  }

  function handleCuriosidade() {
    sendCuriosidade();
    setMessages((msgs) => [...msgs, { user: "Você", text: "💡 Curiosidade FURIA", ts: Date.now() }]);
  }

  function handleTorcida() {
    sendTorcida();
    setMessages((msgs) => [...msgs, { user: "Você", text: "🙌 Mandar energia!", ts: Date.now() }]);
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col h-[70vh] bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
      <FireEffect active={fireActive} />
      <FallenEffect active={fallenActive} />
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-2 bg-white">
        {messages.map((msg, i) => (
          <div key={msg.ts + i} className={`flex ${msg.user === "Você" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-2xl px-4 py-2 text-base shadow-sm ${msg.user === "Você" ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
              <span className="font-bold mr-2 text-xs text-gray-500">{msg.user}</span>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center w-full p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSend} className="flex gap-2 w-full justify-center">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black shadow-none text-base max-w-xs"
            placeholder="Digite sua mensagem ou um comando... (ex: /acende, /fallen)"
          />
          <button
            type="submit"
            className="bg-black text-white font-bold px-6 py-2 rounded-full hover:bg-gray-800 transition shadow-none text-base"
          >
            Enviar
          </button>
        </form>
        <div className="flex flex-nowrap gap-2 justify-center items-center mt-2">
          <button
            className="min-w-[60px] px-3 py-1.5 rounded-full font-bold text-xs border border-gray-900 bg-black text-white flex items-center justify-center text-center shadow-sm"
            onClick={handleFire}
          >
            🔥 Acende a FURIA!
          </button>
          <button
            className="min-w-[60px] px-3 py-1.5 rounded-full font-bold text-xs border border-gray-900 bg-black text-white flex items-center justify-center text-center shadow-sm"
            onClick={handleFallen}
          >
            🎉 FALOU FALLEN?
          </button>
          <button
            className="min-w-[60px] px-3 py-1.5 rounded-full font-bold text-xs border border-gray-900 bg-black text-white flex items-center justify-center text-center shadow-sm"
            onClick={handleCuriosidade}
          >
            💡 Curiosidade FURIA
          </button>
          <button
            className="min-w-[60px] px-3 py-1.5 rounded-full font-bold text-xs border border-gray-900 bg-black text-white flex items-center justify-center text-center shadow-sm"
            onClick={handleTorcida}
          >
            🙌 Mandar energia!
          </button>
        </div>
      </div>
    </div>
  );
} 