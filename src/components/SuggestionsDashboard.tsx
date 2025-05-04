"use client";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface Suggestion {
  id: string;
  text: string;
  analysis?: string;
  timestamp?: { seconds: number; nanoseconds: number };
  status?: string;
}

const STATUS_OPTIONS = ["nova", "lida", "em análise", "descartada"];

function statusColor(status: string) {
  if (status === "descartada") return "text-red-700";
  if (status === "em análise") return "text-yellow-700";
  if (status === "lida") return "text-green-700";
  return "text-gray-700";
}

export default function SuggestionsDashboard() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "suggestions"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSuggestions(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Suggestion[]
      );
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateDoc(doc(db, "suggestions", id), { status });
  };

  const filtered = suggestions.filter((s) => {
    const matchText =
      s.text.toLowerCase().includes(search.toLowerCase()) ||
      (s.analysis || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? s.status === statusFilter : true;
    return matchText && matchStatus;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Dashboard de Sugestões
      </h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por texto ou análise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-50"
        />
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
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="p-2">Sugestão</th>
              <th className="p-2">Análise</th>
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
                <td colSpan={4} className="text-center text-gray-400 py-8">
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
