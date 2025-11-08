const TerrainView = ({ location }) => {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Terrain Analysis</h2>
        <p className="text-gray-400 text-sm">
          {location ? `Terrain data for ${location.name.split(',')[0]}` : 'Select a location to view terrain data'}
        </p>
      </div>

      {location ? (
        <div className="space-y-4">
          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Elevation Profile</h3>
            <div className="h-32 bg-gradient-to-b from-yellow-900/20 to-green-900/20 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm">Elevation map placeholder</p>
            </div>
            <div className="mt-3 flex justify-between text-sm">
              <span className="text-gray-400">Elevation</span>
              <span className="text-white font-medium">-- meters</span>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
            <h3 className="text-yellow-500 font-semibold mb-3">Terrain Features</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Land Type</span>
                <span className="text-white">--</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Slope</span>
                <span className="text-white">--°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vegetation Cover</span>
                <span className="text-white">--%</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-center">Search for a location to view terrain analysis</p>
        </div>
      )}
    </div>
  );
};

export default TerrainView;