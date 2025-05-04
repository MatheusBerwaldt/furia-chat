import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Função simples para calcular similaridade baseada em palavras-chave
function calculateSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

export async function POST(req: Request) {
  try {
    console.log("Iniciando processamento da sugestão...");

    const body = await req.json();
    console.log("Corpo da requisição:", body);

    const { text } = body;
    if (!text) {
      console.error("Texto da sugestão não fornecido");
      return NextResponse.json(
        { error: "Texto da sugestão é obrigatório" },
        { status: 400 }
      );
    }

    // Teste de conexão com o Firestore
    try {
      const suggestionsRef = collection(db, "suggestions");
      const snapshot = await getDocs(suggestionsRef);
      console.log(
        "Teste Firestore: Documentos encontrados:",
        snapshot.docs.length
      );
    } catch (fireErr) {
      console.error("Erro ao conectar com o Firestore:", fireErr);
      return NextResponse.json(
        {
          error: "Erro ao conectar com o Firestore",
          details: fireErr instanceof Error ? fireErr.message : fireErr,
        },
        { status: 500 }
      );
    }

    // Verificar sugestões similares no Firebase
    console.log("Verificando sugestões similares...");
    const suggestionsRef = collection(db, "suggestions");

    try {
      const snapshot = await getDocs(suggestionsRef);
      console.log("Documentos encontrados:", snapshot.docs.length);

      let isDuplicate = false;
      for (const doc of snapshot.docs) {
        const data = doc.data();
        if (!data.text) {
          console.warn("Documento sem texto:", doc.id);
          continue;
        }

        const similarity = calculateSimilarity(text, data.text);
        if (similarity > 0.7) {
          // Limiar de similaridade ajustado
          console.log("Sugestão similar encontrada");
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate) {
        return NextResponse.json(
          { error: "Sugestão similar já existe" },
          { status: 400 }
        );
      }

      // Análise simples da sugestão
      const analysis = `Sugestão recebida: "${text}". Classificação: Sugestão de melhoria.`;

      // Salvar no Firebase
      console.log("Salvando no Firebase...");
      const docRef = await addDoc(suggestionsRef, {
        text,
        analysis,
        timestamp: new Date(),
      });
      console.log("Sugestão salva com sucesso. ID:", docRef.id);

      return NextResponse.json({ success: true, analysis });
    } catch (firebaseError) {
      console.error("Erro no Firebase:", firebaseError);
      if (firebaseError instanceof Error) {
        console.error("Stack trace do Firebase:", firebaseError.stack);
      }
      throw firebaseError;
    }
  } catch (error) {
    console.error("Erro geral:", error);
    if (error instanceof Error) {
      console.error("Stack trace:", error.stack);
    }
    return NextResponse.json(
      {
        error: "Erro ao processar sugestão",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}
