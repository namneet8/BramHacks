const ClimateStats = ({ location }) => {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Climate Statistics</h2>
        <p className="text-gray-400 text-sm">
          {location ? `Showing data for ${location.name.split(',')[0]}` : 'Select a location to view climate data'}
        </p>
      </div>

      {location ? (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Temperature</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Average Annual</span>
                <span className="text-white font-medium">--°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Summer High</span>
                <span className="text-white font-medium">--°C</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Winter Low</span>
                <span className="text-white font-medium">--°C</span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Precipitation</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Annual Rainfall</span>
                <span className="text-white font-medium">-- mm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Snow Days</span>
                <span className="text-white font-medium">-- days</span>
              </div>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Climate Zone</h3>
            <p className="text-gray-300 text-sm">Climate data will be displayed here</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-center">Search for a Canadian city to view its climate statistics</p>
        </div>
      )}
    </div>
  );
};

export default ClimateStats;
