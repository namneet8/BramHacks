import { useState } from "react";

const SearchBar = ({ onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = async (query) => {
    if (!query.trim()) return;
    
    try {
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
          bounds = [[south, west], [north, east]];
        }
        
        onLocationSelect({
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

  return (
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
            <svg className="w-5 h-5 text-yellow-500/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
              <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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
  );
};

export default SearchBar;
