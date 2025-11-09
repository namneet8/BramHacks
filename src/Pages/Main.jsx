import { useState, useEffect, useRef } from "react";
import MapComponent from "../Components/map/MapComponent";
import ClimateStats from "../Components/stats/ClimateStats";
import SatelliteImagery from "../Components/stats/SatelliteImagery";
import ChangesView from "../Components/stats/ChangesView";
import TerrainView from "../Components/stats/TerrainView";
import DataLayers from "../Components/stats/DataLayers";
import ChatInterface from "../Components/main/ChatInterface";
import SearchBar from "../Components/map/SearchBar";
import TabBar from "../Components/main/TabBar";

const MainPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [leftWidth, setLeftWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  
  const containerRef = useRef(null);

  // Load initial location from localStorage if coming from Hero
  useEffect(() => {
    const storedLocation = localStorage.getItem("initialLocation");
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setSelectedLocation(parsedLocation);
      localStorage.removeItem("initialLocation"); // Clear after loading to avoid reuse
    }
  }, []);

  // Handle resize dragging
  useEffect(() => {
    //API CALLS 
    const params = { location: 123, longitude: 34, latitude: -70 };
    // const queryString = new URLSearchParams(params).toString();
    const queryString = "";
    

    fetch(`https://tinniest-unequivalently-karly.ngrok-free.dev/landcover-report?lat=43.7&lon=-79.3 `,{
      method: "GET",
      mode: "cors",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Accept": "application/json"
      }
    }
    )
    .then((res) => {
      console.log("✅ Got response object:", res);
      console.log("Response status:", res.status);

      if (!res.ok) throw new Error("Network response was not ok");

      // Try to parse JSON safely
      return res
        .json()
        .catch((err) => {
          console.error("❌ JSON parse failed:", err);
          throw new Error("Invalid JSON format");
        });
    })
    .then((json) => {
      console.log("🎯 Full response:", json);
      setData(json);
      if (json.images) {
        setImages(json.images);
        console.log("🖼️ Images:", json.images);
      }
    })
    .catch((err) => {
      console.error("🚨 Fetch error:", err);
      setError(err.message);
    })
    .finally(() => {
      console.log("✅ Fetch complete");
      setLoading(false);
    });
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      setLeftWidth(Math.min(Math.max(newLeftWidth, 30), 80));
    };
    const handleMouseUp = () => {
      setIsDragging(false);
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

  const tabs = [
    { id: "map", label: "Map" },
    { id: "climate", label: "Climate Stats" },
    { id: "satellite", label: "Satellite Imagery" },
    { id: "changes", label: "Changes" },
    { id: "terrain", label: "Terrain" },
    { id: "data", label: "Data Layers" }
  ];

  // Render the appropriate LEFT panel component based on active tab
  const renderLeftPanel = () => {
    switch (activeTab) {
      case "map":
        return <MapComponent selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} />;
      case "climate":
        return <ClimateStats location={selectedLocation} />;
      case "satellite":
        return <SatelliteImagery location={selectedLocation} />;
      case "changes":
        return <ChangesView location={selectedLocation} imageArray={ images} />;
      case "terrain":
        return <TerrainView location={selectedLocation} />;
      case "data":
        return <DataLayers location={selectedLocation} />;
      default:
        return <MapComponent selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex">
      {/* Left Side - Dynamic Content (Map/Stats) Section */}
      <div 
        className="relative bg-black flex flex-col flex-1 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        <SearchBar onLocationSelect={setSelectedLocation} />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        
        <div className="flex-1 overflow-hidden">
          {renderLeftPanel()}
        </div>
      </div>
      {/* Draggable Divider */}
      <div
        className="relative w-2 bg-yellow-500/20 hover:bg-yellow-500/40 cursor-col-resize transition-colors group flex items-center justify-center"
        onMouseDown={() => setIsDragging(true)}
      >
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
      {/* Right Side - Chat Interface (Always Visible) */}
      <div
        className="relative bg-black"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <ChatInterface location={selectedLocation} />
      </div>
    </div>
  );
};

export default MainPage;