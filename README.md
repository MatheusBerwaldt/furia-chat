# FURIA Chat

Chat oficial da FURIA para transmissões, interação com a torcida, sugestões e curiosidades!

## Funcionalidades

- Sugestão de melhorias, bugs e elogios com análise IA
- Exibição de partidas ao vivo
- Player de transmissão 
- Dashboard de sugestões 

## Tecnologias

- Next.js 15 (App Router)
- React 19
- TailwindCSS
- Firebase 
- OpenAI API
- React Player
- Recharts

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/MatheusBerwaldt/furia-chat.git
   cd furia-chat
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
4. Acesse [http://localhost:3000](http://localhost:3000)

## Configuração (opcional para produção)

Para uso real, configure as variáveis de ambiente do Firebase e OpenAI em um arquivo `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
OPENAI_API_KEY=...
```

> **Nota:** Para apresentação/demo, todas as integrações estão mockadas e funcionam sem configuração.

## Estrutura de Pastas

- `src/app` — páginas e layout
- `src/components` — componentes reutilizáveis (ChatBot, StreamEmbed, Dashboard, etc)
- `src/services` — serviços de integração (mockados)

## Licença

Projeto de demonstração para FURIA e comunidade. Não oficial.
