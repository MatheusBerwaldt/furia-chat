# FURIA Chat

Este projeto é uma aplicação de chat interativa para torcedores da FURIA, desenvolvida com Next.js, Tailwind CSS e TypeScript. A aplicação permite que os usuários interajam com um chatbot, enviem mensagens em tempo real, assistam a transmissões ao vivo e participem de apostas em partidas.

## Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor e roteamento.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript.
- **Framer Motion**: Biblioteca para animações e transições.
- **React Player**: Componente para reprodução de vídeos e streams.
- **React Icons**: Biblioteca de ícones para React.

## APIs Externas

- **HLTV**: Utilizada para obter dados de partidas ao vivo e informações sobre jogos.
- **Firebase**: Utilizada para autenticação, banco de dados em tempo real e armazenamento de dados.
- **OpenAI**: Utilizada para análise de sugestões e interações com o chatbot.

## Captação de Informações dos Jogos

As informações dos jogos são captadas através da API HLTV, utilizando o serviço `LiveMatchService`. Este serviço faz requisições para a API HLTV para obter dados atualizados sobre partidas ao vivo, incluindo:

- Times participantes
- Placar atual
- Status da partida (ao vivo ou em breve)
- Data e hora da partida
- Evento em que a partida está ocorrendo

Os dados são processados e exibidos no chat, permitindo que os usuários vejam as partidas ao vivo e interajam com elas através de apostas.

## Uso da IA na Classificação e Abstenção de Sugestões

O projeto utiliza a API OpenAI para classificar e filtrar sugestões enviadas pelos usuários. O serviço `SuggestionService` processa as sugestões da seguinte forma:

- **Classificação**: A IA analisa o conteúdo da sugestão e a classifica em categorias como "bug", "melhoria", "elogio", entre outros.
- **Abstenção de Repetidas**: A IA verifica se a sugestão é similar a outras já enviadas, evitando duplicatas e garantindo que apenas sugestões únicas sejam processadas.

Isso garante que as sugestões sejam organizadas e relevantes, melhorando a qualidade do feedback recebido.

## Funcionalidades

### ChatBot

O ChatBot é um assistente virtual que responde a comandos específicos:

- **/jogos**: Exibe as partidas ao vivo da FURIA, com opções para apostar.
- **/sugestao**: Permite enviar sugestões para a FURIA.
- **/curiosidade**: Exibe curiosidades sobre a FURIA.
- **/torcida**: Exibe mensagens de torcida para a FURIA.

### Chat em Tempo Real

O chat em tempo real permite que os usuários interajam com outros torcedores:

- **Envio de Mensagens**: Os usuários podem enviar mensagens e comandos.
- **Comandos Especiais**:
  - **/acende**: Ativa um efeito de fogo na tela.
  - **/fallen**: Ativa um efeito de celebração com emojis e confetes.
  - **/curiosidade**: Exibe uma curiosidade sobre a FURIA.
  - **/torcida**: Exibe uma mensagem de torcida.
- **Botões de Interação**: Botões para acender a FURIA, celebrar o FalleN, exibir curiosidades, mandar energia e assistir à transmissão ao vivo.
- **Transmissão ao Vivo**: Botão para abrir um modal com a transmissão ao vivo da FURIA.

### Apostas

Os usuários podem apostar em partidas ao vivo:

- **Apostar em Partidas**: Botões para apostar em cada time durante partidas ao vivo.
- **Modal de Aposta**: Exibe o formulário de apostas com campos para nome,valor e time escolhido.

## Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/furia-chat.git
   cd furia-chat
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse a aplicação em `http://localhost:3000`.

## Estrutura do Projeto

- **`src/components/`**: Componentes React, como `ChatBot`, `TorcidaChat`, `StreamModal`, `ApostaModal`, etc.
- **`src/services/`**: Serviços para gerenciar dados, como `LiveMatchService`, `StreamEmbedService`, etc.
- **`src/app/`**: Páginas da aplicação, como `page.tsx` (página inicial) e `chat/page.tsx` (chat em tempo real).
