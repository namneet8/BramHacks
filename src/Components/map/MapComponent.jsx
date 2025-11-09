import { useState, useEffect, useRef } from "react";

const MapComponent = ({ selectedLocation, onLocationSelect, onZoomChange, initialZoom = 4 }) => {
  const [mapZoom, setMapZoom] = useState(initialZoom);
  const [isLoading, setIsLoading] = useState(true);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // Helper: Extract coordinates safely
  const getCoordinates = (location) => {
    if (!location) return null;

    if (Array.isArray(location.coordinates)) {
      return location.coordinates; // [lat, lng]
    }
    if (location.lat !== undefined && location.lng !== undefined) {
      return [location.lat, location.lng];
    }
    if (location.latitude !== undefined && location.longitude !== undefined) {
      return [location.latitude, location.longitude];
    }
    return null;
  };

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window === 'undefined' || !window.L || !mapContainerRef.current) {
      setIsLoading(false);
      return;
    }

    const L = window.L;

    const map = L.map(mapContainerRef.current, {
      center: [56.1304, -106.3468],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    map.on('zoomend', () => {
      const zoom = map.getZoom();
      setMapZoom(zoom);
      if (onZoomChange) onZoomChange(zoom);
    });

    mapInstanceRef.current = map;
    setIsLoading(false);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialZoom, onZoomChange]);

  // Handle location selection
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation || !window.L) return;

    const L = window.L;
    const coords = getCoordinates(selectedLocation);
    if (!coords) {
      console.warn("Invalid coordinates in selectedLocation:", selectedLocation);
      return;
    }

    const [lat, lng] = coords;
    const zoom = selectedLocation.zoom || 13;

    // Clear previous markers
    markersRef.current.forEach(marker => {
      if (marker.remove) marker.remove();
    });
    markersRef.current = [];

    // Fly to location first, then show box after animation completes
    mapInstanceRef.current.flyTo([lat, lng], zoom, { duration: 2 });

    // Wait for fly animation to complete before showing the box
    setTimeout(() => {
      if (!mapInstanceRef.current) return;

      // Create a 5x5 kilometer highlighted box around the location
      const boxSize = 2.5; // 2.5 km in each direction = 5km total width/height
      const latOffset = boxSize / 111; // Roughly 1 degree latitude = 111 km
      const lngOffset = boxSize / (111 * Math.cos(lat * Math.PI / 180)); // Adjust for latitude

      const bounds = [
        [lat - latOffset, lng - lngOffset], // Southwest corner
        [lat + latOffset, lng + lngOffset]  // Northeast corner
      ];

      // Create highlighted rectangle
      const rectangle = L.rectangle(bounds, {
        color: '#EAB308',
        weight: 3,
        fillColor: '#EAB308',
        fillOpacity: 0.2,
        dashArray: '10, 5'
      }).addTo(mapInstanceRef.current);

      markersRef.current.push(rectangle);
    }, 2000); // Match the flyTo duration

    // Optional bounds rectangle
    if (selectedLocation.bounds && Array.isArray(selectedLocation.bounds)) {
      const [[swLat, swLng], [neLat, neLng]] = selectedLocation.bounds;
      const rectangle = L.rectangle([[swLat, swLng], [neLat, neLng]], {
        color: '#EAB308',
        weight: 3,
        fillColor: '#EAB308',
        fillOpacity: 0.1
      }).addTo(mapInstanceRef.current);

      markersRef.current.push(rectangle);
      mapInstanceRef.current.fitBounds([[swLat, swLng], [neLat, neLng]], { padding: [50, 50] });
    }
  }, [selectedLocation]);

  const handleZoomIn = () => {
    const newZoom = Math.min(mapZoom + 1, 18);
    setMapZoom(newZoom);
    mapInstanceRef.current?.setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(mapZoom - 1, 1);
    setMapZoom(newZoom);
    mapInstanceRef.current?.setZoom(newZoom);
  };

  const handleResetView = () => {
    onLocationSelect?.(null);
    mapInstanceRef.current?.setView([56.1304, -106.3468], initialZoom);
    setMapZoom(initialZoom);
  };

  // Safely get display coordinates
  const displayCoords = selectedLocation ? getCoordinates(selectedLocation) : null;

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Map...</p>
          </div>
        </div>
      )}

      {/* Leaflet not loaded fallback */}
      {!isLoading && !window.L && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="mb-6">
              <svg className="w-20 h-20 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-white text-2xl font-bold mb-3">Map Preview</h3>
            <p className="text-gray-400 mb-4">Add Leaflet to enable interactive maps</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          disabled={mapZoom >= 18}
          className="p-3 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl hover:bg-black/80 hover:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 group"
        >
          <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>

        <div className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl text-center">
          <span className="text-yellow-500 text-xs font-semibold">{Math.round(mapZoom)}x</span>
        </div>

        <button
          onClick={handleZoomOut}
          disabled={mapZoom <= 1}
          className="p-3 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl hover:bg-black/80 hover:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 group"
        >
          <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>

        <button
          onClick={handleResetView}
          className="p-3 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl hover:bg-black/80 hover:border-yellow-500/50 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 group mt-2"
          title="Reset View"
        >
          <svg className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {/* Location Info Panel */}
      {selectedLocation && displayCoords && (
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4 max-w-xs sm:max-w-sm shadow-2xl shadow-yellow-500/20 z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                {selectedLocation.name?.split(',')[0] || "Location"}
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                {parseFloat(displayCoords[0]).toFixed(4)}, {parseFloat(displayCoords[1]).toFixed(4)}
              </p>
            </div>
            <button
              onClick={() => onLocationSelect?.(null)}
              className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;