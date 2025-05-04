import { NextResponse } from "next/server";
// import { db } from "@/lib/firebase";
// import { collection, addDoc } from "firebase/firestore";
// import OpenAI from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Texto da sugestão é obrigatório" },
        { status: 400 }
      );
    }

    // MOCK: Classificação e análise simuladas para apresentação
    // Para apresentação, a classificação será baseada em palavras-chave simples
    let classification = "outro";
    let analysis = "";
    const lower = text.toLowerCase();
    if (lower.includes("erro") || lower.includes("bug")) {
      classification = "bug";
      analysis = "Classificação IA: bug";
    } else if (lower.includes("melhor") || lower.includes("sugest")) {
      classification = "melhoria";
      analysis = "Classificação IA: melhoria";
    } else if (
      lower.includes("duvid") ||
      lower.includes("como") ||
      lower.includes("?")
    ) {
      classification = "dúvida";
      analysis = "Classificação IA: dúvida";
    } else if (
      lower.includes("parabéns") ||
      lower.includes("elogio") ||
      lower.includes("gostei")
    ) {
      classification = "elogio";
      analysis = "Classificação IA: elogio";
    } else {
      classification = "outro";
      analysis = "Classificação IA: outro";
    }

    // --- CÓDIGO REAL (descomente para uso real) ---
    /*
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Classifique a sugestão do usuário em uma das categorias: melhoria, bug, elogio, dúvida, outro. Responda apenas com a categoria exata. Não escreva mais nada além da categoria.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 10,
        temperature: 0.2,
      });
      const content = (completion.choices[0].message.content || "")
        .trim()
        .toLowerCase();
      console.log("OpenAI classification content:", content);
      // Normalizar resposta: remover acentos, espaços e caracteres não-letras
      const normalized = content
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z]/g, "");
      const validClasses = ["melhoria", "bug", "elogio", "duvida", "outro"];
      const match = validClasses.find((c) => normalized.includes(c));
      classification = match || "outro";
      analysis = `Classificação IA: ${content}`;
      console.log("Classification:", classification);
    } catch (err) {
      console.error("Erro ao chamar OpenAI:", err);
      analysis = `Sugestão recebida: "${text}". Classificação: Sugestão de melhoria.`;
      classification = "outro";
    }
    */

    // --- CÓDIGO REAL FIREBASE (descomente para uso real) ---
    /*
    await addDoc(collection(db, "suggestions"), {
      text,
      analysis,
      classification: classification || "outro",
      timestamp: new Date(),
    });
    */

    // MOCK: Retorno simulado
    return NextResponse.json({ success: true, analysis, classification });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao processar sugestão",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
