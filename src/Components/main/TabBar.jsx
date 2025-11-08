const TabBar = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="bg-black/60 backdrop-blur-xl border-b border-yellow-500/20 px-4 py-3 flex items-center gap-1 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/40"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;