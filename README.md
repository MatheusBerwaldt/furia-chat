# FURIA Chat

Chat oficial da FURIA para transmissões, interação com a torcida, sugestões e curiosidades!

## Funcionalidades

- Chat em tempo real com torcedores
- Sugestão de melhorias, bugs e elogios com análise IA (mock)
- Exibição de partidas ao vivo (mock)
- Player de transmissão (mock)
- Dashboard de sugestões (mock)
- Interface responsiva e moderna

## Tecnologias

- Next.js 15 (App Router)
- React 19
- TailwindCSS
- Firebase (mockado para demo)
- OpenAI API (mockado para demo)
- React Player
- Recharts

## Instalação

1. Clone o repositório:
   ```bash
   git clone <url-do-repo>
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

## Customização

- Para trocar o logo ou favicon, substitua os arquivos em `public/` e `src/app/favicon.ico`.
- Para ativar integrações reais, descomente os trechos de código indicados nos serviços e rotas.

## Licença

Projeto de demonstração para FURIA e comunidade. Não oficial.
