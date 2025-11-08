import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MicrophoneButton from "../hero/MicrophoneButton";
const genAI = new GoogleGenerativeAI(import.meta.env.REACT_APP_GEMINI_API_KEY);
// function extractEntities(prompt) {
//   const locationMatch = prompt.match(/\b(in|at|from|of)\s+([A-Z][a-zA-Z]+)/);
//   const infoTypeMatch = prompt.match(/(weather|population|traffic|economy|tourism|crime|education|statistics|insights)/i);
//   return {
//     location: locationMatch ? locationMatch[2] : "unknown location",
//     infoType: infoTypeMatch ? infoTypeMatch[0] : "general information",
//   };
// }
const ChatInterface = ({ location }) => {

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
const [prompt, setPrompt] = useState("");
const [chat, setChat] = useState(() => {
  try {
    const saved = localStorage.getItem("chatHistory");
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});
const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      localStorage.setItem("chatHistory", JSON.stringify(chat));
    }, [chat]);
  
    const handleSend = async (e) => {
      e.preventDefault();
      if (!prompt.trim()) return;
  
      const userMsg = { role: "user", content: prompt };
      // const entities = extractEntities(prompt);
      // const historyText = chat.map(m => `${m.role}: ${m.content}`).join("\n");
  
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
      const fullPrompt = `
        You are a JSON extractor. 
From the user's message, extract the location name and give its latitude and longitude.
Return only JSON in this format:
{
  "location": "<city or place>",
  "latitude": <number>,
  "longitude": <number>
}

User message: "${prompt}"`;
  
      setChat(prev => [...prev, userMsg]);
      setLoading(true);
  
      try {
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        const botMsg = { role: "assistant", content: text };
        setChat(prev => [...prev, botMsg]);
      } catch (err) {
        console.error(err);
        setChat(prev => [...prev, { role: "assistant", content: "⚠️ Error fetching Gemini response." }]);
      } finally {
        setLoading(false);
        setPrompt("");
      }
    };
  
    const clearChat = () => {
      setChat([]);
      localStorage.removeItem("chatHistory");
    };


  return (
    <div className="h-full flex flex-col bg-black">
      {/* Chat Header */}
      <div className="bg-black/60 backdrop-blur-xl border-b border-yellow-500/20 p-4">
        <h2 className="text-white font-semibold text-lg">Climate Assistant</h2>
        <p className="text-gray-400 text-sm">Ask me anything about climate data</p>
      </div>

      
      <div className="flex-1 overflow-y-auto  space-y-3  text-white p-4">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg max-w-[80%] ${
              msg.role === "user" ? " bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 p-2 sm:p-3 hover:border-yellow-500/30 transition-all duration-300 self-end ml-auto" : " bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 p-2 sm:p-3 hover:border-yellow-500/30 transition-all duration-300"
            }`}
          >
            <b>{msg.role === "user" ? "You" : "Gemini"}:</b> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Gemini is thinking...</div>}
      </div>

      <form onSubmit={handleSend} className="relative flex items-end gap-1.5 sm:gap-2 bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 p-2 sm:p-3 hover:border-yellow-500/30 transition-all duration-300 m-4">
      <MicrophoneButton />
        <input
          className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-gray-400 outline-none resize-none py-2 sm:py-3 px-1 sm:px-2 max-h-[120px] overflow-y-auto"
          placeholder="Ask something (e.g., Weather in Toronto)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          disabled={!prompt.trim()}
          className={`flex-shrink-0 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300  "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/40"`}
        >
         <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
