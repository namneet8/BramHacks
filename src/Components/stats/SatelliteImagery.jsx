const SatelliteImagery = ({ location }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Satellite Imagery</h2>
        <p className="text-gray-400 text-sm">
          {location ? `Viewing ${location.name.split(',')[0]}` : 'Select a location to view satellite images'}
        </p>
      </div>

      {location ? (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <div className="aspect-video bg-gradient-to-br from-green-900/20 to-blue-900/20 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-16 h-16 text-yellow-500/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">Recent satellite image - Placeholder</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-3 hover:border-yellow-500/40 transition-all">
              <p className="text-white text-sm font-medium">Visible Light</p>
            </button>
            <button className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-3 hover:border-yellow-500/40 transition-all">
              <p className="text-white text-sm font-medium">Infrared</p>
            </button>
            <button className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-3 hover:border-yellow-500/40 transition-all">
              <p className="text-white text-sm font-medium">Cloud Cover</p>
            </button>
            <button className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-3 hover:border-yellow-500/40 transition-all">
              <p className="text-white text-sm font-medium">Vegetation</p>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-center">Search for a location to view satellite imagery</p>
        </div>
      )}
    </div>
  );
};

export default SatelliteImagery;