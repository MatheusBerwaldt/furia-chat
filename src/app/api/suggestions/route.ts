import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "Texto da sugestão é obrigatório" },
        { status: 400 }
      );
    }

    // Análise simples da sugestão
    const analysis = `Sugestão recebida: "${text}". Classificação: Sugestão de melhoria.`;

    // Salvar no Firebase
    await addDoc(collection(db, "suggestions"), {
      text,
      analysis,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, analysis });
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
