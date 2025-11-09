import { useState, useEffect, useRef } from "react";
import MapComponent from "../Components/map/MapComponent";
import LandCoverComparison from "../Components/stats/LandCoverComparison";
import SatelliteImagery from "../Components/stats/SatelliteImagery";
import ChangesView from "../Components/stats/ChangesView";
import TerrainView from "../Components/stats/TerrainView";
import AirQualityIndex from "../Components/stats/AirQualityIndex";
import ChatInterface from "../Components/main/ChatInterface";
import SearchBar from "../Components/map/SearchBar";
import TabBar from "../Components/main/TabBar";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MainPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("map");
  const [leftWidth, setLeftWidth] = useState(60);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [changeImages, setChangeImages] = useState([]);
  const [nightImages, setNightImages] = useState([]);
  const [changeSummaryData, setChangeSummaryData] = useState(null);
  const [nightSummaryData, setNightSummaryData] = useState(null);
  const [aqiSummaryData, setAqiSummaryData] = useState(null);
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  
  const containerRef = useRef(null);
  async function fetchAllReports() {
    const endpoints = [
      "https://tinniest-unequivalently-karly.ngrok-free.dev/landcover-report?keyword=Toronto&lat=43.2557&lon=-79.8711",
      "https://tinniest-unequivalently-karly.ngrok-free.dev/night-light?keyword=Hamilton&lat=43.2557&lon=-79.8711",
      "https://tinniest-unequivalently-karly.ngrok-free.dev/air-quality?keyword=Hamilton&lat=43.2557&lon=-79.8711"
    ];
  
    const headers = {
      "ngrok-skip-browser-warning": "true",
      "Accept": "application/json"
    };
  
    const [landcover, nightlight, airquality] = await Promise.all(
      endpoints.map((url) => fetch(url, { headers }).then((res) => res.json()))
    );
  
    return { landcover, nightlight, airquality };
  }
  
  async function getGeminiInsights({ landcover, nightlight, airquality }) {
    const storedHistory = localStorage.getItem("chatHistory");
  const chatHistory = storedHistory ? JSON.parse(storedHistory) : [];
    const nightlightSummary = {
      average_change: nightlight?.report?.average_change ?? "N/A",
      average_intensity_2021: nightlight?.report?.average_intensity_2021 ?? "N/A",
      average_intensity_2025: nightlight?.report?.average_intensity_2025 ?? "N/A",
    };
    
    const prompt = `
  You are an environmental analysis assistant.
  Use the following data summaries and chat history to provide insights.
  
  === Landcover Report Summary ===
  ${JSON.stringify(landcover?.report?.change_summary, null, 2)}
  
  === Night Light Summary ===
  ${JSON.stringify(nightlightSummary)}
  
  === Air Quality Summary ===
  ${JSON.stringify(airquality?.monthly_aqi, null, 2)}
  
  === Chat History ===
  ${chatHistory}
  
  Please summarize:
  1️⃣ The environmental changes in this region.
  2️⃣ Any patterns between land cover, light pollution, and air quality.
  `;
  
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insight = response.text();
    const newMessage = {
      role: "assistant",
      content: insight,
      timestamp: new Date().toISOString(),
    };
    console.log(localStorage.getItem("chatHistory"));
    const updatedChatHistory = [...chatHistory, newMessage];
  localStorage.setItem("chatHistory", JSON.stringify(updatedChatHistory));
  window.dispatchEvent(new Event("storage"));

    return insight;
  }
  // Load initial location from localStorage if coming from Hero
  useEffect(() => {
    const storedLocation = localStorage.getItem("initialLocation");
    if (storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      setSelectedLocation(parsedLocation); // Clear after loading to avoid reuse
    }
  }, []);

  // Handle resize dragging
  useEffect(() => {
    //API CALLS 
    const params = { location: 123, longitude: 34, latitude: -70 };
    // const queryString = new URLSearchParams(params).toString();
    const queryString = "";
    

    async function fetchAndAnalyze() {
      try {
        setLoading(true);
  
        const { landcover, nightlight, airquality } = await fetchAllReports();
        setChangeImages(landcover?.images || []);
        console.log("nightlight img", nightlight)
        setNightImages(nightlight?.image || []);
        console.log("Landcover Images:", landcover);
  
        setChangeSummaryData(landcover?.report?.change_summary);
        setNightSummaryData(nightlight?.report?.percentage_summary);
        setAqiSummaryData(airquality?.report?.monthly_aqi);
  
        const insight = await getGeminiInsights({ landcover, nightlight, airquality });
  
        console.log("🧠 Gemini Insights:", insight);
        localStorage.setItem("geminiInsight", insight);
  
      } catch (err) {
        console.error("🚨 Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  
    fetchAndAnalyze();    const handleMouseMove = (e) => {
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

  // Demo fallback data
  const demoData_landCover = {
    "2018": {
      "NDVI_vegetation_%": "51.34%",
      "NDBI_builtup_%": "11.28%",
      "NDWI_water_%": "5.76%",
      "MNDWI_enhanced_water_%": "5.80%"
    },
    "2024": {
      "NDVI_vegetation_%": "56.68%",
      "NDBI_builtup_%": "10.46%",
      "NDWI_water_%": "5.66%",
      "MNDWI_enhanced_water_%": "5.75%"
    }
  };

  // Demo fallback data
  const demoData_aqi = {"city":"Toronto","monthly_aqi":{"2020-11":1.44,"2020-12":1.32,"2021-01":1.46,"2021-02":1.37,"2021-03":1.96,"2021-04":1.54,"2021-05":1.92,"2021-06":1.81,"2021-07":1.71,"2021-08":2.2,"2021-09":1.35,"2021-10":1.34,"2021-11":1.3,"2021-12":1.23,"2022-01":1.26,"2022-02":1.51,"2022-03":1.8,"2022-04":1.61,"2022-05":1.87,"2022-06":1.68,"2022-07":1.98,"2022-08":1.91,"2022-09":1.61,"2022-10":1.82,"2022-11":1.63,"2022-12":1.33,"2023-01":1.39,"2023-02":1.85,"2023-03":2.07,"2023-04":2.15,"2023-05":2.03,"2023-06":2.17,"2023-07":2.3,"2023-08":1.9,"2023-09":1.93,"2023-10":1.73,"2023-11":1.58,"2023-12":1.58,"2024-01":1.56,"2024-02":1.88,"2024-03":1.98,"2024-04":1.96,"2024-05":1.93,"2024-06":1.94,"2024-07":2.28,"2024-08":2.09,"2024-09":2.21,"2024-10":1.77,"2024-11":1.49,"2024-12":1.54,"2025-01":1.67,"2025-02":2.03,"2025-03":2.13,"2025-04":2.06,"2025-05":1.63,"2025-06":1.81,"2025-07":2.01,"2025-08":1.97,"2025-09":2.02,"2025-10":1.83,"2025-11":1.88,"2026-01":2.0,"2026-02":2.0,"2026-03":2.01,"2026-04":2.02,"2026-05":2.03,"2026-06":2.03,"2026-07":2.04,"2026-08":2.05,"2026-09":2.05,"2026-10":2.06,"2026-11":2.07,"2026-12":2.08,"2027-01":2.08,"2027-02":2.09,"2027-03":2.1,"2027-04":2.11,"2027-05":2.11,"2027-06":2.12,"2027-07":2.13,"2027-08":2.13,"2027-09":2.14,"2027-10":2.15,"2027-11":2.16,"2027-12":2.16}};

  const tabs = [
    { id: "map", label: "Map" },
    { id: "landcover", label: "Land Cover" },
    { id: "satellite", label: "Satellite Imagery" },
    { id: "changes", label: "Changes" },
    { id: "terrain", label: "Terrain" },
    { id: "aiq", label: "Air Quality Index" }
  ];

  // Render the appropriate LEFT panel component based on active tab
  const renderLeftPanel = () => {
    switch (activeTab) {
      case "map":
        return <MapComponent selectedLocation={selectedLocation} onLocationSelect={setSelectedLocation} />;
      case "landcover":
        return (
          <LandCoverComparison
            percentage_summary={demoData_landCover}
          />
        );
      case "satellite":
        return <SatelliteImagery location={selectedLocation} imageArray={ changeImages}/>;
      case "changes":
        return <ChangesView location={selectedLocation} imageArray={ changeImages} />;
      case "terrain":
        return <TerrainView location={selectedLocation} imageArray={ nightImages}  />;
      case "aiq":
        return <AirQualityIndex monthly_aqi={demoData_aqi.monthly_aqi} city={demoData_aqi.city} />;

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
        {/* <SearchBar onLocationSelect={setSelectedLocation} /> */}
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