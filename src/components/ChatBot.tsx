"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LiveMatchService } from "../services/LiveMatchService";
import { StreamEmbedService } from "../services/StreamEmbedService";
import { SuggestionService } from "../services/SuggestionService";
import ReactPlayer from "react-player";
import { Bet, getBetsLocal, setBetsLocal, addBet } from "../services/BetService";

const BOT_AVATAR = "/Furia_Esports_logo.png";
const USER_AVATAR = "/user.png";

function Avatar({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: string;
}) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
      {fallback}
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className="w-7 h-7 rounded-full border border-gray-200 bg-white shadow-sm"
      onError={() => setErrored(true)}
    />
  );
}

const SUGESTOES = [
  { comando: "/jogos", label: "Partidas FURIA" },
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

async function handleJogos() {
  try {
    const matches = await LiveMatchService.getLiveMatches();
    if (!matches.length)
      return ["No momento, não há jogos ao vivo. Fique ligado!"];
    return matches.map((m) => {
      const apostaBtns = m.status === "live"
        ? `<div style='margin-top:8px;display:flex;gap:8px;'>
            <button onclick=\"window.__abrirAposta('${m.id}','${m.team1}')\" style='background:#111;color:#fff;border-radius:8px;padding:6px 16px;font-weight:bold;border:none;cursor:pointer;transition:background 0.2s;'>Apostar ${m.team1}</button>
            <button onclick=\"window.__abrirAposta('${m.id}','${m.team2}')\" style='background:#111;color:#fff;border-radius:8px;padding:6px 16px;font-weight:bold;border:none;cursor:pointer;transition:background 0.2s;'>Apostar ${m.team2}</button>
          </div>`
        : "";
      return (
        `🦁 <b>${m.team1}</b> <span style=\"color:#888\">vs</span> <b>${m.team2}</b>\n` +
        `🏆 <b>${m.event}</b>\n` +
        `⏰ <b>Status:</b> <span style=\"color:${m.status === "live" ? '#111' : '#888'};font-weight:bold;\">${m.status === "live" ? "AO VIVO" : "Em breve"}</span>\n` +
        `🔢 <b>Placar:</b> <span style=\"color:#222;font-weight:bold;\">${m.score1} x ${m.score2}</span>\n` +
        apostaBtns
      );
    });
  } catch {
    return ["Erro ao buscar partidas ao vivo."];
  }
}

function handleCuriosidade() {
  return getRandom(CURIOSIDADES);
}

function handleTorcida() {
  return getRandom(TORCIDA);
}

async function handleStream() {
  const url = await StreamEmbedService.getLiveStreamUrl();
  if (url) {
    return url;
  }
  return null;
}

async function handleSugestao(text: string) {
  const res = await SuggestionService.sendSuggestion(text);
  if (res.success) {
    return `Sugestão enviada com sucesso!\n${
      res.analysis ? "Análise: " + res.analysis : ""
    }`;
  }
  return `Erro ao enviar sugestão: ${res.error}`;
}

function handleTextoLivre() {
  return "Mensagem recebida! Digite /jogos, /curiosidade, /torcida, /sugestao ou clique nos botões acima para interagir mais.";
}

function getInitialUser() {
  if (typeof window === "undefined") return { nickname: "", saldo: 1000 };
  const nickname = localStorage.getItem("furia_nickname") || "";
  const saldo = parseInt(localStorage.getItem("furia_saldo") || "1000", 10);
  return { nickname, saldo };
}

function setUserLocal(nickname: string, saldo: number) {
  localStorage.setItem("furia_nickname", nickname);
  localStorage.setItem("furia_saldo", saldo.toString());
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Bem-vindo ao chat oficial da FURIA!\n\nEscolha um comando ou mande sua mensagem para interagir.\n\nComandos: /jogos, /curiosidade, /torcida, /sugestao",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [aguardandoSugestao, setAguardandoSugestao] = useState(false);
  const [showStream, setShowStream] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState(getInitialUser());
  const [showNicknameModal, setShowNicknameModal] = useState(!user.nickname);
  const [nicknameInput, setNicknameInput] = useState("");
  const [apostas, setApostas] = useState<Bet[]>(getBetsLocal());
  const [apostaModal, setApostaModal] = useState<{match: any, team: string} | null>(null);
  const [apostaValor, setApostaValor] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, showStream]);

  useEffect(() => {
    if (user.nickname) {
      setUserLocal(user.nickname, user.saldo);
    }
  }, [user]);

  const handleSend = async (msg?: string) => {
    const userMsg = msg || input.trim();
    if (!userMsg) return;
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setIsSending(true);

    setTimeout(async () => {
      let botMsg: string | string[] = "";
      if (aguardandoSugestao) {
        botMsg = await handleSugestao(userMsg);
        setAguardandoSugestao(false);
      } else if (userMsg.toLowerCase().startsWith("/jogos")) {
        botMsg = await handleJogos();
      } else if (userMsg.toLowerCase().startsWith("/curiosidade")) {
        botMsg = handleCuriosidade();
      } else if (userMsg.toLowerCase().startsWith("/torcida")) {
        botMsg = handleTorcida();
      } else if (userMsg.toLowerCase().startsWith("/sugestao")) {
        botMsg = "Por favor, digite sua sugestão e envie.";
        setAguardandoSugestao(true);
      } else {
        botMsg = handleTextoLivre();
      }
      if (Array.isArray(botMsg)) {
        setMessages((msgs) => [
          ...msgs,
          ...botMsg.map((text) => ({ from: "bot", text })),
        ]);
      } else {
        setMessages((msgs) => [...msgs, { from: "bot", text: botMsg }]);
      }
      setIsSending(false);
    }, 800);
  };

  const handleStreamButton = async () => {
    setStreamLoading(true);
    const url = await handleStream();
    setStreamUrl(url);
    setShowStream(true);
    setStreamLoading(false);
  };

  // Função para abrir modal de aposta
  function abrirAposta(match: any, team: string) {
    setApostaModal({ match, team });
    setApostaValor("");
  }

  function handleAddBet(match: any, team: string, valor: number) {
    const novaAposta: Bet = {
      id: Date.now(),
      matchId: match.id,
      team,
      valor,
      status: "aberta",
      match,
    };
    addBet(novaAposta);
    setApostas(getBetsLocal());
  }

  // Função para apostar
  function apostar() {
    if (!apostaModal || !apostaValor) return;
    const valor = parseInt(apostaValor, 10);
    if (isNaN(valor) || valor <= 0 || valor > user.saldo) return;
    const novoSaldo = user.saldo - valor;
    setUser({ ...user, saldo: novoSaldo });
    handleAddBet(apostaModal.match, apostaModal.team, valor);
    setApostaModal(null);
    setApostaValor("");
  }

  // Exibir apostas do usuário
  function renderApostas() {
    if (!apostas.length) return null;
    return (
      <div className="rounded-xl bg-gray-50 border border-gray-200 shadow-sm px-4 py-3 mb-2 flex flex-col gap-2" style={{ fontFamily: 'Inter, Arial, sans-serif' }}>
        <h3 className="font-bold text-black mb-1 text-base tracking-tight">Suas apostas</h3>
        <ul className="flex flex-col gap-1">
          {apostas.map((a: Bet) => (
            <li key={a.id} className="flex items-center justify-between text-sm md:text-base">
              <span className="truncate">
                <span className="font-semibold text-black">{a.match.team1}</span>
                <span className="mx-1 text-gray-500">vs</span>
                <span className="font-semibold text-black">{a.match.team2}</span>
                <span className="ml-2 font-bold text-white bg-black rounded px-2 py-1 text-xs md:text-sm">{a.team}</span>
                <span className="ml-2 text-black font-semibold">{a.valor} moedas</span>
              </span>
              <span className="ml-2 text-gray-700 text-xs md:text-sm">{a.status === "aberta" ? "⏳ Em andamento" : a.status}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Expor função global para abrir aposta (para uso nos botões HTML)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__abrirAposta = (matchId: string, team: string) => {
        LiveMatchService.getLiveMatches().then(matches => {
          const match = matches.find((m: any) => m.id.toString() === matchId);
          if (match) abrirAposta(match, team);
        });
      };
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[70vh] bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
      {/* Modal para nickname */}
      {showNicknameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 min-w-[300px]">
            <h2 className="text-lg font-bold text-black">Escolha seu nickname</h2>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-black w-full"
              placeholder="Digite seu nickname"
              value={nicknameInput}
              onChange={e => setNicknameInput(e.target.value)}
              maxLength={16}
              autoFocus
            />
            <button
              className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition"
              disabled={!nicknameInput.trim()}
              onClick={() => {
                setUser({ nickname: nicknameInput.trim(), saldo: 1000 });
                setShowNicknameModal(false);
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      )}
      {/* Topo com nickname e saldo */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 bg-white">
        <span className="font-bold text-black">👤 {user.nickname || "-"}</span>
        <span className="font-mono text-black">💰 {user.saldo} moedas</span>
      </div>
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-white"
        style={{ scrollbarColor: "#22c55e #fff" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <Avatar src={BOT_AVATAR} alt="FURIA Bot" fallback="FB" />
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[70%] px-4 py-2 rounded-3xl text-base whitespace-pre-line shadow-sm ${
                msg.from === "bot"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-green-100 text-green-900"
              }`}
              style={{
                borderRadius:
                  msg.from === "bot"
                    ? "18px 18px 18px 6px"
                    : "18px 18px 6px 18px",
              }}
            >
              <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            </motion.div>
            {msg.from === "user" && (
              <Avatar src={USER_AVATAR} alt="Você" fallback="U" />
            )}
          </div>
        ))}
        <AnimatePresence>
          {isClient && showStream && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg p-2 flex flex-col items-center"
              style={{ width: 350, maxWidth: "90vw" }}
            >
              <div className="flex w-full justify-between items-center mb-2">
                <span className="text-gray-800 font-bold text-sm">
                  Transmissão ao vivo
                </span>
                <button
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold px-2"
                  onClick={() => setShowStream(false)}
                  title="Fechar"
                >
                  ×
                </button>
              </div>
              {streamLoading ? (
                <div className="w-full aspect-video flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : streamUrl ? (
                <div className="w-full aspect-video rounded-lg overflow-hidden">
                  <ReactPlayer
                    url={streamUrl}
                    width="100%"
                    height="100%"
                    controls
                    playing
                    muted={false}
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center text-gray-400">
                  Sem transmissão ao vivo
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Apostas feitas - fixa acima da barra de comandos */}
      <div className="px-6 pb-2 pt-2 bg-white border-t border-b border-gray-200 sticky top-0 z-10">
        {renderApostas()}
      </div>
      {/* Barra de comandos */}
      <div className="bg-white border-t border-gray-200 p-3 flex flex-col gap-2">
        <div className="flex gap-1 flex-nowrap mb-1">
          <button
            className="bg-black text-white font-semibold px-2 py-1 rounded-full hover:bg-gray-800 transition shadow-none text-xs min-w-[90px]"
            onClick={handleSend.bind(null, "/jogos")}
            disabled={isSending}
            style={{ fontWeight: 600 }}
          >
            Partidas FURIA
          </button>
          <button
            className="bg-gray-200 text-black font-semibold px-2 py-1 rounded-full hover:bg-gray-300 transition shadow-none text-xs min-w-[90px] border border-gray-300"
            onClick={handleStreamButton}
            disabled={isSending}
            style={{ fontWeight: 600 }}
          >
            Assistir transmissão
          </button>
          {SUGESTOES.filter((s) => s.comando !== "/jogos").map((s) => (
            <button
              key={s.comando}
              className="bg-gray-100 text-black border border-gray-200 rounded-full px-2 py-1 text-xs hover:bg-gray-200 hover:text-black transition shadow-none min-w-[90px] font-semibold"
              onClick={() => handleSend(s.comando)}
              disabled={isSending}
              style={{ fontWeight: 500 }}
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
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black shadow-none text-base"
            placeholder={
              aguardandoSugestao
                ? "Digite sua sugestão..."
                : "Digite sua mensagem..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            autoFocus
          />
          <button
            type="submit"
            className="bg-black text-white font-bold px-6 py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-60 shadow-none text-base"
            disabled={isSending || !input.trim()}
          >
            Enviar
          </button>
        </form>
      </div>
      {apostaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4 min-w-[300px]">
            <h2 className="text-lg font-bold text-black mb-2">Apostar em {apostaModal.team}</h2>
            <div className="text-xs text-gray-700 mb-2">
              Partida: <b>{apostaModal.match.team1}</b> vs <b>{apostaModal.match.team2}</b>
            </div>
            <input
              className="border border-gray-300 rounded px-3 py-2 text-black w-full"
              placeholder="Valor da aposta"
              type="number"
              min="1"
              max={user.saldo}
              value={apostaValor}
              onChange={e => setApostaValor(e.target.value)}
              autoFocus
            />
            <div className="text-xs text-gray-500">Saldo disponível: {user.saldo} moedas</div>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition"
                disabled={!apostaValor || parseInt(apostaValor, 10) <= 0 || parseInt(apostaValor, 10) > user.saldo}
                onClick={apostar}
              >
                Apostar
              </button>
              <button
                className="bg-gray-200 text-black px-6 py-2 rounded-full font-bold hover:bg-gray-300 transition"
                onClick={() => setApostaModal(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
