import { useState } from "react";

const DataLayers = ({ location }) => {
  const [activeLayers, setActiveLayers] = useState([]);

  const layers = [
    { id: 'temp', name: 'Temperature Overlay', color: 'red' },
    { id: 'precip', name: 'Precipitation', color: 'blue' },
    { id: 'wind', name: 'Wind Patterns', color: 'cyan' },
    { id: 'humidity', name: 'Humidity', color: 'purple' },
  ];

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => 
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Data Layers</h2>
        <p className="text-gray-400 text-sm">Toggle data overlays on the map</p>
      </div>

      <div className="space-y-3">
        {layers.map(layer => (
          <button
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className={`w-full bg-black/40 backdrop-blur-md border rounded-xl p-4 text-left transition-all ${
              activeLayers.includes(layer.id)
                ? 'border-yellow-500/60 bg-yellow-500/10'
                : 'border-yellow-500/20 hover:border-yellow-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-${layer.color}-500`}></div>
                <span className="text-white font-medium">{layer.name}</span>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                activeLayers.includes(layer.id)
                  ? 'border-yellow-500 bg-yellow-500'
                  : 'border-gray-500'
              }`}>
                {activeLayers.includes(layer.id) && (
                  <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {location && activeLayers.length > 0 && (
        <div className="mt-6 bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-xl p-4">
          <p className="text-gray-400 text-sm">
            {activeLayers.length} layer{activeLayers.length !== 1 ? 's' : ''} active for {location.name.split(',')[0]}
          </p>
        </div>
      )}
    </div>
  );
};

export default DataLayers;