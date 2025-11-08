import { useState, useEffect, useRef } from "react";

const MapPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(4);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("climate");
  const [leftWidth, setLeftWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const containerRef = useRef(null);

  // Handle resize dragging
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      setLeftWidth(Math.min(Math.max(newLeftWidth, 30), 80));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      if (mapInstanceRef.current) {
        setTimeout(() => mapInstanceRef.current.invalidateSize(), 100);
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Initialize Leaflet map
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainerRef.current) {
      const L = window.L;

      const map = L.map(mapContainerRef.current, {
        center: [56.1304, -106.3468], // Center of Canada
        zoom: 4,
        zoomControl: false,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      map.on('zoomend', () => {
        setMapZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
      setIsLoading(false);

      return () => {
        map.remove();
      };
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle location selection
  useEffect(() => {
    if (mapInstanceRef.current && selectedLocation && window.L) {
      const L = window.L;
      const { coordinates, bounds, zoom: locationZoom } = selectedLocation;

      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      mapInstanceRef.current.flyTo(coordinates, locationZoom || 10, {
        duration: 2
      });

      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background-color: #EAB308;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 20px rgba(234, 179, 8, 0.6);
            transform: translate(-50%, -50%);
          "></div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker(coordinates, { icon: customIcon }).addTo(mapInstanceRef.current);
      markersRef.current.push(marker);

      if (bounds) {
        const [sw, ne] = bounds;
        
        const rectangle = L.rectangle([sw, ne], {
          color: '#EAB308',
          weight: 3,
          fillColor: '#EAB308',
          fillOpacity: 0.1
        }).addTo(mapInstanceRef.current);

        markersRef.current.push(rectangle);
        mapInstanceRef.current.fitBounds([sw, ne], { padding: [50, 50] });
      }
    }
  }, [selectedLocation]);

  // Update zoom
  useEffect(() => {
    if (mapInstanceRef.current && mapZoom !== mapInstanceRef.current.getZoom()) {
      mapInstanceRef.current.setZoom(mapZoom);
    }
  }, [mapZoom]);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
      // Search only within Canada
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)},Canada&limit=1&countrycodes=ca`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);
        
        let bounds = null;
        if (result.boundingbox) {
          const [south, north, west, east] = result.boundingbox.map(parseFloat);
          bounds = [
            [south, west],
            [north, east]
          ];
        }
        
        setSelectedLocation({
          name: result.display_name,
          coordinates: [lat, lon],
          bounds: bounds,
          zoom: 11
        });
      } else {
        alert("Location not found in Canada. Please try another search.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      alert("Error searching location. Please try again.");
    }
    
    setSearchQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleResetView = () => {
    setSelectedLocation(null);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([56.1304, -106.3468], 4);
      setMapZoom(4);
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(mapZoom + 1, 18);
    setMapZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(mapZoom - 1, 1);
    setMapZoom(newZoom);
  };

  const tabs = [
    { id: "climate", label: "Climate Stats" },
    { id: "satellite", label: "Satellite Imagery" },
    { id: "changes", label: "Changes" },
    { id: "terrain", label: "Terrain" },
    { id: "data", label: "Data Layers" }
  ];

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex">
      {/* Left Side - Map Section */}
      <div 
        className="relative bg-black flex flex-col"
        style={{ width: `${leftWidth}%` }}
      >
        {/* Search Bar - Moved to top of tabs */}
        <div className="bg-black/60 backdrop-blur-xl border-b border-yellow-500/20 px-4 py-3">
          <form onSubmit={handleSubmit}>
            <div
              className={`flex items-center gap-2 bg-black/40 backdrop-blur-xl rounded-xl border transition-all duration-300 p-2 shadow-xl ${
                isFocused
                  ? "border-yellow-500/50 shadow-yellow-500/20"
                  : "border-yellow-500/20 shadow-yellow-500/10"
              }`}
            >
              <div className="flex-shrink-0 pl-2">
                <svg
                  className="w-5 h-5 text-yellow-500/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search Canadian cities (e.g., Toronto, Vancouver...)"
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-400 outline-none px-2"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 hover:text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className={`flex-shrink-0 p-2 rounded-lg transition-all duration-300 ${
                  searchQuery.trim()
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/40"
                    : "bg-white/5 border border-yellow-500/10 cursor-not-allowed"
                }`}
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap gap-2 mt-2">
            {["Toronto", "Vancouver", "Montreal", "Calgary"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                className="px-3 py-1 text-xs text-gray-300 bg-black/40 backdrop-blur-md border border-yellow-500/20 rounded-lg hover:border-yellow-500/40 hover:text-white transition-all duration-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/60 backdrop-blur-xl border-b border-yellow-500/20 px-4 py-3 flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

        {/* Map View */}
        <div className="relative flex-1">
          <div ref={mapContainerRef} className="w-full h-full" />

          {isLoading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading Map...</p>
              </div>
            </div>
          )}

          {!isLoading && !window.L && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              <div className="text-center max-w-md px-4">
                <div className="mb-6">
                  <svg className="w-20 h-20 text-yellow-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">Map Preview</h3>
                <p className="text-gray-400 mb-4">
                  Add Leaflet to enable interactive maps
                </p>
                <code className="text-xs text-yellow-500 bg-black/50 px-3 py-2 rounded block">
                  Add Leaflet CDN to your HTML
                </code>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            disabled={mapZoom >= 18}
            className="p-3 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl hover:bg-black/80 hover:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 group"
            aria-label="Zoom in"
          >
            <svg
              className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <div className="px-3 py-2 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl text-center">
            <span className="text-yellow-500 text-xs font-semibold">
              {Math.round(mapZoom)}x
            </span>
          </div>

          <button
            onClick={handleZoomOut}
            disabled={mapZoom <= 1}
            className="p-3 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl hover:bg-black/80 hover:border-yellow-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 group"
            aria-label="Zoom out"
          >
            <svg
              className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>

          <button
            onClick={handleResetView}
            className="p-3 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl hover:bg-black/80 hover:border-yellow-500/50 transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 group mt-2"
            aria-label="Reset view"
          >
            <svg
              className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
        </div>

        {/* Location Info Panel */}
        {selectedLocation && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-4 max-w-xs sm:max-w-sm shadow-2xl shadow-yellow-500/20 z-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1 truncate">
                  {selectedLocation.name.split(',')[0]}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {selectedLocation.coordinates[0].toFixed(4)}, {selectedLocation.coordinates[1].toFixed(4)}
                </p>
              </div>
              <button
                onClick={() => setSelectedLocation(null)}
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

      {/* Draggable Divider */}
      <div
        className="relative w-2 bg-yellow-500/20 hover:bg-yellow-500/40 cursor-col-resize transition-colors group flex items-center justify-center"
        onMouseDown={() => setIsDragging(true)}
      >
        {/* Drag Handle Icon */}
        <div className="absolute flex flex-col gap-1 p-2 bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-lg group-hover:border-yellow-500/50 transition-all">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 16 16">
            <circle cx="4" cy="4" r="1.5"/>
            <circle cx="12" cy="4" r="1.5"/>
            <circle cx="4" cy="8" r="1.5"/>
            <circle cx="12" cy="8" r="1.5"/>
            <circle cx="4" cy="12" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
          </svg>
        </div>
      </div>

      {/* Right Side - Blank Panel */}
      <div 
        className="relative bg-black flex items-center justify-center"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <div className="text-center text-gray-600">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <p className="text-sm opacity-50">Content Panel</p>
        </div>
      </div>
    </div>
  );
};

export default MapPage;