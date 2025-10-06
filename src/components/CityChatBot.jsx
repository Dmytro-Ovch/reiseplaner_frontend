import { useState, useEffect } from "react";

export default function CityChatBot({ city }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (city) {
      setMessages([
        { role: "assistant", content: `Hallo! Frag mich gerne nach Sehenswürdigkeiten in ${city}. ` }
      ]);
    }
  }, [city]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { role: "user", content: input };
    setMessages((m) => [...m, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, city }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Fehler beim Abrufen der Antwort." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-md flex flex-col gap-3">
      <h3 className="text-lg font-bold mb-2">Chatbot für {city}</h3>

      <div className="h-64 overflow-y-auto bg-gray-900 p-2 rounded">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`my-2 ${
              m.role === "user" ? "text-right text-blue-400" : "text-left text-green-300"
            }`}
          >
            <p className="inline-block bg-gray-700 rounded px-3 py-1">{m.content}</p>
          </div>
        ))}
        {loading && <p className="text-gray-400 text-sm">Denke nach...</p>}
      </div>

      <div className="flex gap-2 mt-2">
        <input
          className="input input-bordered flex-1 bg-gray-700 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Frag nach Sehenswürdigkeiten..."
        />
        <button className="btn btn-accent" onClick={sendMessage} disabled={loading}>
          Senden
        </button>
      </div>
    </div>
  );
}
