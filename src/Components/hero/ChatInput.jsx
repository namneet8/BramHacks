import { m } from "framer-motion";
import { useState, useRef } from "react";
import MicrophoneButton from "./MicrophoneButton";
import SendButton from "./SendButton";

const ChatInput = ({ input, setInput, onSubmit }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
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
    <m.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.2 }}
      className="absolute bottom-6 sm:bottom-8 w-full max-w-3xl px-3 sm:px-4"
    >
      <div className="relative flex items-end gap-1.5 sm:gap-2 bg-black/30 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-yellow-500/20 shadow-2xl shadow-yellow-500/10 p-2 sm:p-3 hover:border-yellow-500/30 transition-all duration-300">
        <MicrophoneButton />

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a city and the insight you want..."
          className="flex-1 bg-transparent text-white text-sm sm:text-base placeholder-gray-400 outline-none resize-none py-2 sm:py-3 px-1 sm:px-2 max-h-[120px] overflow-y-auto"
          rows={1}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#4B5563 transparent",
          }}
        />

        <SendButton onClick={onSubmit} disabled={!input.trim()} />
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3 text-[10px] sm:text-xs text-gray-400">
        <span className="hidden sm:inline">Press Enter to send</span>
        <span className="sm:hidden">Enter to send</span>
        <span className="text-yellow-500/50">•</span>
        <span className="hidden sm:inline">Shift + Enter for new line</span>
        <span className="sm:hidden">Shift+Enter = new line</span>
      </div>
    </m.div>
  );
};

export default ChatInput;