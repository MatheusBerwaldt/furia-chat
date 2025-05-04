import { useState, useEffect, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { FaPaperPlane } from "react-icons/fa";
import { io, Socket } from "socket.io-client";

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: Timestamp;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Configuração do Socket.io
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000/api/socket"
    );

    socketRef.current.on("messageReceived", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Configuração do Firestore
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      text: newMessage,
      timestamp: serverTimestamp(),
    };

    // Envia para o Firestore
    const docRef = await addDoc(collection(db, "messages"), messageData);

    // Emite para o Socket.io
    socketRef.current?.emit("sendMessage", {
      id: docRef.id,
      ...messageData,
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="text-sm text-gray-400">{message.user}</div>
            <div className="bg-gray-800 rounded-lg p-3 max-w-[80%] break-words">
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {message.timestamp?.toDate().toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-furia-red"
        />
        <button
          type="submit"
          className="bg-furia-red text-white rounded-lg px-4 py-2 hover:bg-furia-red-dark transition-colors"
          disabled={!newMessage.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
}
