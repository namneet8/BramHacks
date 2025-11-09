import { m } from "framer-motion";

const SamplePrompts = ({ onPromptClick }) => {
  const allPrompts = [
    "Show me climate trends in Toronto",
    "Analyze deforestation patterns in the Amazon",
    "Track urban expansion in Brampton",
    "Air quality trends in Toronto for next 2 years",
  ];

  // Show only first 2 prompts on mobile/tablet
  const prompts =
    typeof window !== "undefined" && window.innerWidth < 1024
      ? allPrompts.slice(0, 2)
      : allPrompts;

  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="absolute bottom-40 sm:bottom-40 w-full max-w-3xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 py-0"
    >
      {prompts.map((prompt, index) => (
        <m.button
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: [0, -6, 0], // floating motion
          }}
          transition={{
            opacity: { duration: 0.6, delay: 1 + index * 0.05 },
            y: {
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }}
          onClick={() => onPromptClick(prompt)}
          className="group relative bg-black/20 backdrop-blur-md rounded-xl border border-yellow-500/20 p-3 sm:p-4 hover:border-yellow-500/40 hover:bg-black/30 transition-all duration-300 text-left shadow-lg hover:shadow-yellow-500/10"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500/60 group-hover:text-yellow-500 transition-colors"
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
            <span className="text-gray-300 group-hover:text-white transition-colors text-xs sm:text-sm lg:text-base leading-snug">
              {prompt}
            </span>
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </m.button>
      ))}
    </m.div>
  );
};

export default SamplePrompts;
