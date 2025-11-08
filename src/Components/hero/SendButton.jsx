const SendButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-shrink-0 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
        !disabled
          ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/40"
          : "bg-white/5 border border-yellow-500/10 cursor-not-allowed"
      }`}
      aria-label="Send message"
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
  );
};

export default SendButton;