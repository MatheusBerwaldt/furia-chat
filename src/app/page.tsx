import StreamEmbed from "@/components/StreamEmbed";
import LiveMatch from "@/components/LiveMatch";
import SuggestionBox from "@/components/SuggestionBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-4">
      <h1 className="text-4xl font-bold text-center mb-8">FURIA CS Chat</h1>
      <StreamEmbed />
      <LiveMatch />
      <SuggestionBox />
    </main>
  );
}
