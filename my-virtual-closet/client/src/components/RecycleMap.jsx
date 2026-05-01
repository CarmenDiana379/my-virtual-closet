import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

function RecycleMap() {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);

  const [selectedType, setSelectedType] = useState("All");

  const locations = [
    {
      name: "Charity Shop Donation Point",
      type: "Donate",
      position: [51.5074, -0.1278],
      description: "Suitable for wearable clothes in good condition."
    },
    {
      name: "Textile Recycling Bank",
      type: "Textile recycling bank",
      position: [51.5155, -0.141],
      description: "Suitable for damaged or worn clothing."
    },
    {
      name: "Clothing Repair Tailor",
      type: "Repair",
      position: [51.5033, -0.1195],
      description: "Useful for clothes that can be repaired or altered."
    },
    {
      name: "Upcycling Workshop",
      type: "Upcycle",
      position: [51.5202, -0.105],
      description: "Creative reuse option for unwanted clothing."
    },
    {
      name: "Local Charity Shop",
      type: "Charity shop",
      position: [51.5112, -0.1134],
      description: "Best for clean, wearable clothing donations."
    }
  ];

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([51.5074, -0.1278], 13);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    markerGroupRef.current = L.layerGroup().addTo(map);
  }, []);

  useEffect(() => {
    if (!markerGroupRef.current) return;

    markerGroupRef.current.clearLayers();

    const filteredLocations =
      selectedType === "All"
        ? locations
        : locations.filter((location) => location.type === selectedType);

    filteredLocations.forEach((location) => {
      L.marker(location.position)
        .addTo(markerGroupRef.current)
        .bindPopup(
          `<strong>${location.name}</strong><br/>
          Type: ${location.type}<br/>
          ${location.description}`
        );
    });
  }, [selectedType]);

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        border: "2px solid black",
        padding: "20px"
      }}
    >
      <h2>Recycle and Donation Map</h2>

      <p>
        Filter the map to find donation, textile recycling, repair, upcycling or
        charity shop options.
      </p>

      <div style={{ marginBottom: "15px" }}>
        {[
          "All",
          "Donate",
          "Textile recycling bank",
          "Repair",
          "Upcycle",
          "Charity shop"
        ].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              margin: "5px",
              padding: "8px 14px",
              background: selectedType === type ? "#ddd" : "white",
              border: "2px solid black"
            }}
          >
            {type}
          </button>
        ))}
      </div>

      <div
        ref={mapRef}
        style={{
          height: "450px",
          width: "100%"
        }}
      />
    </div>
  );
}

export default RecycleMap;