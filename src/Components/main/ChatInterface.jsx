import { useState, useEffect, useRef } from "react";

const ChatInterface = ({ location }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you learn about climate data for any Canadian location. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const response = {
        role: 'assistant',
        content: location 
          ? `I can provide information about ${location.name.split(',')[0]}. What specific climate data would you like to know?`
          : 'Please select a location on the map first, then I can provide detailed climate information.'
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Chat Header */}
      <div className="bg-black/60 backdrop-blur-xl border-b border-yellow-500/20 p-4">
        <h2 className="text-white font-semibold text-lg">Climate Assistant</h2>
        <p className="text-gray-400 text-sm">Ask me anything about climate data</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user'
                ? 'bg-yellow-500 text-black'
                : 'bg-black/60 backdrop-blur-md border border-yellow-500/20 text-white'
            }`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-black/60 backdrop-blur-xl border-t border-yellow-500/20 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about climate data..."
            className="flex-1 bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-yellow-500/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`px-6 py-3 rounded-xl transition-all ${
              input.trim()
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-black/40 border border-yellow-500/20 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
