"use client";
import { useState } from "react";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import { db } from "../lib/firebase";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Suggestion {
  id: string;
  text: string;
  analysis?: string;
  classification?: string;
  timestamp?: { seconds: number; nanoseconds: number };
  status?: string;
}

const STATUS_OPTIONS = ["nova", "lida", "em análise", "descartada"];
const CLASS_OPTIONS = ["melhoria", "bug", "elogio", "dúvida", "outro"];
const CLASS_COLORS: Record<string, string> = {
  melhoria: "#22c55e",
  bug: "#ef4444",
  elogio: "#3b82f6",
  dúvida: "#eab308",
  outro: "#6b7280",
};

function statusColor(status: string) {
  if (status === "descartada") return "text-red-700";
  if (status === "em análise") return "text-yellow-700";
  if (status === "lida") return "text-green-700";
  return "text-gray-700";
}

function classColor(classification: string) {
  if (classification === "melhoria") return "text-green-700 font-bold";
  if (classification === "bug") return "text-red-700 font-bold";
  if (classification === "elogio") return "text-blue-700 font-bold";
  if (classification === "dúvida") return "text-yellow-700 font-bold";
  return "text-gray-700";
}

export default function SuggestionsDashboard() {
  // MOCK: Sugestões simuladas para apresentação
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "1",
      text: "Adicionar modo escuro ao chat",
      analysis: "Classificação IA: melhoria",
      classification: "melhoria",
      timestamp: { seconds: 1718000000, nanoseconds: 0 },
      status: "nova",
    },
    {
      id: "2",
      text: "O botão de enviar não funciona no mobile",
      analysis: "Classificação IA: bug",
      classification: "bug",
      timestamp: { seconds: 1717990000, nanoseconds: 0 },
      status: "em análise",
    },
    {
      id: "3",
      text: "Parabéns pelo chat, ficou ótimo!",
      analysis: "Classificação IA: elogio",
      classification: "elogio",
      timestamp: { seconds: 1717980000, nanoseconds: 0 },
      status: "lida",
    },
    {
      id: "4",
      text: "Como faço para mudar meu apelido?",
      analysis: "Classificação IA: dúvida",
      classification: "dúvida",
      timestamp: { seconds: 1717970000, nanoseconds: 0 },
      status: "nova",
    },
    {
      id: "5",
      text: "Seria legal ter integração com Discord.",
      analysis: "Classificação IA: melhoria",
      classification: "melhoria",
      timestamp: { seconds: 1717960000, nanoseconds: 0 },
      status: "descartada",
    },
  ]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  // useEffect(() => {
  //   const q = query(
  //     collection(db, "suggestions"),
  //     orderBy("timestamp", "desc")
  //   );
  //   const unsubscribe = onSnapshot(q, (snapshot) => {
  //     setSuggestions(
  //       snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       })) as Suggestion[]
  //     );
  //   });
  //   return () => unsubscribe();
  // }, []);

  const handleStatusChange = async (id: string, status: string) => {
    // await updateDoc(doc(db, "suggestions", id), { status });
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const filtered = suggestions.filter((s) => {
    const matchText =
      s.text.toLowerCase().includes(search.toLowerCase()) ||
      (s.analysis || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.classification || "outro")
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    const matchClass = classFilter
      ? (s.classification || "outro") === classFilter
      : true;
    return matchText && matchStatus && matchClass;
  });

  // Dados para o gráfico
  const classCount = CLASS_OPTIONS.map((c) => ({
    name: c,
    value: suggestions.filter((s) => (s.classification || "outro") === c)
      .length,
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Dashboard de Sugestões
      </h2>
      <div className="w-full flex flex-col md:flex-row items-center gap-8 mb-8">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={classCount}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) =>
                  value > 0 ? `${name} (${value})` : ""
                }
              >
                {classCount.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={CLASS_COLORS[entry.name] || "#6b7280"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Buscar por texto, análise ou classificação..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50 mb-2"
          />
          <div className="flex gap-2">
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50"
            >
              <option value="">Todas as classificações</option>
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c} className={classColor(c)}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-gray-50"
            >
              <option value="">Todos os status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className={statusColor(s)}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="p-2">Sugestão</th>
              <th className="p-2">Análise</th>
              <th className="p-2">Classificação</th>
              <th className="p-2">Data/Hora</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b last:border-b-0">
                <td className="p-2 max-w-xs break-words text-gray-900">
                  {s.text}
                </td>
                <td className="p-2 max-w-xs break-words text-gray-800">
                  {s.analysis}
                </td>
                <td
                  className={`p-2 capitalize ${classColor(
                    s.classification || "outro"
                  )}`}
                >
                  {s.classification || "outro"}
                </td>
                <td className="p-2 text-gray-700">
                  {s.timestamp &&
                    new Date(s.timestamp.seconds * 1000).toLocaleString(
                      "pt-BR"
                    )}
                </td>
                <td className="p-2">
                  <select
                    value={s.status || "nova"}
                    onChange={(e) => handleStatusChange(s.id, e.target.value)}
                    className={`border border-gray-300 rounded px-2 py-1 bg-gray-50 ${statusColor(
                      s.status || "nova"
                    )}`}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option
                        key={opt}
                        value={opt}
                        className={statusColor(opt)}
                      >
                        {opt}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">
                  Nenhuma sugestão encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
