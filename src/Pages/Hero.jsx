import { m, LazyMotion, domAnimation } from "framer-motion";
import { useState, useRef } from "react";
import HeroText from "../Components/HeroText";
import HeroParticles from "../Components/Particles/HeroParticles";

const Hero = () => {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (input.trim()) {
      console.log("Submitted:", input);
      // Handle your submission logic here
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleMicrophone = () => {
    setIsListening(!isListening);
    // Add your speech recognition logic here
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div id="hero" className="w-full bg-black flex justify-center overflow-hidden-web relative">
      <LazyMotion features={domAnimation} strict>
        <m.div
          id="hero"
          className="relative w-full flex flex-col justify-center items-center h-screen min-h-[500px] px-4"
        >
          <HeroText />
          <HeroParticles />
          
          {/* Sample Prompts Grid */}
          <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="absolute bottom-32 w-full max-w-3xl px-4 grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {[
              "Show me recent wildfire activity in California",
              "Analyze deforestation patterns in the Amazon",
              "Track urban expansion in major cities",
              "Monitor glacier retreat over the past decade"
            ].map((prompt, index) => (
              <m.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                onClick={() => {
                  setInput(prompt);
                  setTimeout(() => {
                    if (prompt.trim()) {
                      console.log("Submitted:", prompt);
                      setInput("");
                    }
                  }, 300);
                }}
                className="group relative bg-black/20 backdrop-blur-md rounded-xl border border-yellow-500/20 p-4 hover:border-yellow-500/40 hover:bg-black/30 transition-all duration-300 text-left shadow-lg hover:shadow-yellow-500/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5 text-yellow-500/60 group-hover:text-yellow-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors text-sm md:text-base">
                    {prompt}
                  </span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </m.button>
            ))}
          </m.div>
          
          {/* Chat Input Box */}
          <m.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="absolute bottom-8 w-full max-w-3xl px-4"
          >
            <div className="relative flex items-end gap-2 bg-black/30 backdrop-blur-xl rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 p-3 hover:border-yellow-500/30 transition-all duration-300">
              {/* Microphone Button */}
              <button
                onClick={toggleMicrophone}
                className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                  isListening
                    ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse shadow-lg shadow-yellow-500/50"
                    : "bg-white/5 hover:bg-white/10 border border-yellow-500/20 hover:border-yellow-500/40"
                }`}
                aria-label="Voice input"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>

              {/* Text Input */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about satellite intelligence..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none resize-none py-3 px-2 max-h-[120px] overflow-y-auto"
                rows={1}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#4B5563 transparent",
                }}
              />

              {/* Send Button */}
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                  input.trim()
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/40"
                    : "bg-white/5 border border-yellow-500/10 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5 text-white"
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
            </div>

            {/* Helper Text */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <span>Press Enter to send</span>
              <span className="text-yellow-500/50">•</span>
              <span>Shift + Enter for new line</span>
            </div>
          </m.div>
        </m.div>
      </LazyMotion>
    </div>
  );
};

export default Hero;