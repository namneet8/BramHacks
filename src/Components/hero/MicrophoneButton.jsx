import { useState } from "react";

const MicrophoneButton = () => {
  const [isListening, setIsListening] = useState(false);

  const toggleMicrophone = () => {
    setIsListening(!isListening);
    // Add your speech recognition logic here
  };

  return (
    <button
      onClick={toggleMicrophone}
      className={`flex-shrink-0 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
        isListening
          ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse shadow-lg shadow-yellow-500/50"
          : "bg-white/5 hover:bg-white/10 border border-yellow-500/20 hover:border-yellow-500/40"
      }`}
      aria-label="Voice input"
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
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
      </svg>
    </button>
  );
};

export default MicrophoneButton;