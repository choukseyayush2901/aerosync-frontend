"use client";

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// ✅ Naya Component: Custom Map Controls (Locate + Home)
function CustomMapControls({
  onLocationSelect,
  onReset,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  onReset: () => void;
}) {
  const map = useMap();

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 14, { duration: 1.5 });
        onLocationSelect(latitude, longitude);
      },
      () => {
        alert("Unable to retrieve your location");
      },
    );
  };

  const handleHome = () => {
    // Map ko wapas default India ke center par le jao
    map.flyTo([22.9, 78.8], 5, { duration: 1.5 });
    // Parent component ko batao ki data reset karna hai
    onReset();
  };

  return (
    <div className="leaflet-top leaflet-right mt-3 mr-3">
      <div className="leaflet-control flex flex-col gap-2">
        <button
          onClick={handleLocate}
          className="bg-white/90 hover:bg-white text-gray-800 font-bold py-2 px-3 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 transition-all"
          title="My Location"
        >
          <span className="text-lg">📍</span>
          <span className="text-xs uppercase tracking-wider font-extrabold">
            Locate Me
          </span>
        </button>

        <button
          onClick={handleHome}
          className="bg-white/90 hover:bg-white text-gray-800 font-bold py-2 px-3 rounded-lg shadow-lg border border-gray-200 flex items-center gap-2 transition-all"
          title="Reset Map"
        >
          <span className="text-lg">🏠</span>
          <span className="text-xs uppercase tracking-wider font-extrabold">
            Reset Home
          </span>
        </button>
      </div>
    </div>
  );
}

function LocationMarker({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>Data for this location</Popup>
    </Marker>
  );
}

export default function MapComponent({
  onLocationSelect,
  onReset, // Naya prop receive kiya
}: {
  onLocationSelect: (lat: number, lng: number) => void;
  onReset: () => void; // Type define kiya
}) {
  return (
    <MapContainer
      center={[22.9, 78.8]}
      zoom={5}
      style={{ height: "100%", minHeight: "500px", width: "100%", zIndex: 10 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker onLocationSelect={onLocationSelect} />
      <CustomMapControls
        onLocationSelect={onLocationSelect}
        onReset={onReset}
      />
    </MapContainer>
  );
}
