"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SuggestionBox() {
  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: suggestion }),
      });

      if (response.ok) {
        setSuggestion("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Erro ao enviar sugestão:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="Digite sua sugestão aqui..."
            className="w-full h-32 p-4 bg-black border-2 border-green-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={isSubmitting || !suggestion.trim()}
            className={`px-6 py-2 rounded-lg font-bold ${
              isSubmitting || !suggestion.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? "Enviando..." : "Enviar Sugestão"}
          </motion.button>
        </div>
      </form>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          Sugestão enviada com sucesso! ✅
        </motion.div>
      )}
    </div>
  );
}
