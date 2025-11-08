const ChangesView = ({ location }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Climate Changes Over Time</h2>
        <p className="text-gray-400 text-sm">
          {location ? `Analyzing ${location.name.split(',')[0]}` : 'Select a location to view changes'}
        </p>
      </div>

      {location ? (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Temperature Trends (1980-2024)</h3>
            <div className="h-40 bg-gradient-to-t from-red-900/20 to-transparent rounded-lg flex items-end justify-center">
              <p className="text-gray-400 text-sm mb-4">Chart placeholder - Temperature increase over time</p>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Key Observations</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Average temperature increase: -- °C since 1980</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Precipitation pattern changes: --</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 mt-1">•</span>
                <span>Extreme weather events: --</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-center">Search for a location to view climate changes</p>
        </div>
      )}
    </div>
  );
};

export default ChangesView;