"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  PollutionData,
  getPollutionTheme,
  getDefaultTheme,
} from "../utils/theme";

const MapWithNoSSR = dynamic(() => import("../components/MapComponent"), {
  ssr: false,
  loading: () => (
    <p className="text-white/80 font-semibold text-lg text-center mt-20 animate-pulse">
      Map Loading...
    </p>
  ),
});

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [pollutionData, setPollutionData] = useState<PollutionData | null>(
    null,
  );

  // ✅ NAYA STATE: Location ka naam save karne ke liye
  const [locationName, setLocationName] = useState<string | null>(null);

  const fetchPollutionData = async (lat: number, lng: number) => {
    setLoading(true);
    setPollutionData(null);
    setLocationName("Detecting Location..."); // Jab tak naam aaye, ye dikhayenge

    try {
      // 1. Apna Backend Fetch (Pollution Data)
      const response = await fetch(
        `https://aerosync-live-backend.onrender.com/openaq/location?lat=${lat}&lng=${lng}`,
      );
      const result = await response.json();

      if (result.success) {
        setPollutionData(result.data.current);
      }

      // ✅ 2. OpenStreetMap API se Location ka Naam nikalna (Reverse Geocoding)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      );
      const geoData = await geoRes.json();

      if (geoData && geoData.address) {
        // City, town, ya district jo bhi mile usko nikal lo
        const place =
          geoData.address.city ||
          geoData.address.town ||
          geoData.address.state_district ||
          geoData.address.county ||
          "Unknown Area";
        const state = geoData.address.state || "";
        setLocationName(`${place}${state ? `, ${state}` : ""}`);
      } else {
        setLocationName(`Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`); // Agar naam na mile toh coordinates dikha do
      }
    } catch (error) {
      console.error("Pipeline Error:", error);
      setLocationName("Location Unknown");
    } finally {
      setLoading(false);
    }
  };

  const resetDashboard = () => {
    setPollutionData(null);
    setLocationName(null); // ✅ Reset par location bhi clear kar do
    setLoading(false);
  };

  const currentPollution = pollutionData
    ? pollutionData.pm2_5 || pollutionData.pm10 || 0
    : 0;
  const theme = pollutionData
    ? getPollutionTheme(currentPollution)
    : getDefaultTheme();

  return (
    <main
      className={`flex min-h-screen bg-gradient-to-br ${theme.panelBg} transition-all duration-1000 items-center justify-center p-4 md:p-8`}
    >
      <div className="w-full max-w-6xl bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[80vh]">
        {/* ✨ LEFT PANEL */}
        <div className="w-full md:w-1/3 p-8 text-white flex flex-col relative overflow-hidden bg-white/5 border-r border-white/10">
          <h1 className="text-3xl font-bold mb-2 z-10 drop-shadow-md">
            AeroSync
          </h1>
          <p className="text-blue-100 text-sm mb-8 opacity-90 z-10">
            Real-time Air Quality Telemetry Engine
          </p>

          <div className="flex-grow flex flex-col justify-center z-10">
            {loading ? (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md text-center shadow-lg">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold">Extracting Data...</h2>
                <p className="text-sm text-blue-100 mt-2">{locationName}</p>
              </div>
            ) : pollutionData ? (
              <div className="flex flex-col space-y-6">
                {/* 🌿 ENVIRONMENT VISUALIZER COMPONENT */}
                <div className="bg-black/20 rounded-2xl p-4 flex flex-col items-center justify-center relative border border-white/10 overflow-hidden shadow-inner">
                  <div
                    className={`absolute left-6 top-4 text-2xl opacity-40 ${theme.particleAnim}`}
                  >
                    {theme.particles}
                  </div>
                  <div
                    className={`absolute right-6 bottom-4 text-3xl opacity-40 ${theme.particleAnim}`}
                    style={{ animationDelay: "0.4s" }}
                  >
                    {theme.particles}
                  </div>

                  <div className="flex items-end space-x-3 text-4xl mb-2">
                    <span className="animate-pulse">{theme.cloud}</span>
                    <span className="text-5xl drop-shadow-2xl">
                      {theme.plant}
                    </span>
                    <span
                      className="animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    >
                      {theme.cloud}
                    </span>
                  </div>

                  <div
                    className={`text-sm font-black tracking-widest uppercase ${theme.statusColor} bg-black/40 px-4 py-1 rounded-full backdrop-blur-md shadow-lg`}
                  >
                    Status: {theme.level}
                  </div>
                </div>

                {/* 📊 DATA DISPLAY COMPONENT */}
                <div className="bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg">
                  {/* ✅ NAYA: Header with Location */}
                  <div className="flex justify-between items-end mb-4 border-b border-white/20 pb-2">
                    <h2 className="text-xl font-bold text-white">
                      Live Telemetry
                    </h2>
                    {locationName && (
                      <div className="flex items-center text-xs font-semibold text-blue-100 opacity-90 max-w-[150px] bg-black/20 px-2 py-1 rounded-md">
                        <span className="mr-1">📍</span>
                        <span className="truncate" title={locationName}>
                          {locationName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/30 p-3 rounded-xl flex justify-between items-center shadow-inner">
                      <p className="text-sm text-blue-100">PM 10</p>
                      <p className="text-xl font-semibold">
                        {pollutionData.pm10}{" "}
                        <span className="text-xs font-normal opacity-70">
                          μg/m³
                        </span>
                      </p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl flex justify-between items-center shadow-inner">
                      <p className="text-sm text-blue-100">PM 2.5</p>
                      <p className="text-xl font-semibold">
                        {pollutionData.pm2_5}{" "}
                        <span className="text-xs font-normal opacity-70">
                          μg/m³
                        </span>
                      </p>
                    </div>
                    <div className="bg-black/30 p-3 rounded-xl flex justify-between items-center shadow-inner">
                      <p className="text-sm text-blue-100">CO</p>
                      <p className="text-xl font-semibold">
                        {pollutionData.carbon_monoxide}{" "}
                        <span className="text-xs font-normal opacity-70">
                          μg/m³
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Awaiting Location...
                </h2>
                <p className="text-sm text-blue-100 opacity-90">
                  Click Anywhere On The Map To Know The Exect Pollution Level Of
                  That Location
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 🗺️ RIGHT PANEL: MAP */}
        <div className="w-full md:w-2/3 relative h-full z-0 bg-black/10">
          <MapWithNoSSR
            onLocationSelect={fetchPollutionData}
            onReset={resetDashboard}
          />
        </div>
      </div>
    </main>
  );
}
