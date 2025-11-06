import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Maps = ({ data }) => {
  return (
    <MapContainer
      className="h-[350px] sm:h-[450px] w-full rounded-xl overflow-hidden"
      center={[-2.5, 118]}
      zoom={5}
      // style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='Data Gempa'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Array.isArray(data) &&
        data.length > 0 &&
        data.map((item, i) => {
          if (!item.Coordinates) return null;

          const parts = item.Coordinates.split(",").map(Number);
          if (parts.length !== 2 || parts.some(isNaN)) return null;

          const [lat, lon] = parts;
          const magnitude = parseFloat(item.Magnitude);
          const isHighMagnitude = magnitude > 5;

          return (
            <CircleMarker
              key={i}
              center={[lat, lon]}
              radius={magnitude * 3}
              className="animate-pulse"
              pathOptions={{
                color: isHighMagnitude ? "red" : "#FFAC1C",
                fillOpacity: 0.5,
                weight: 1.5,
              }}
            >
              <Tooltip direction="top">
                <span>
                  <strong>{item.Wilayah}</strong>
                  <br />
                  Magnitudo: {item.Magnitude}
                  <br />
                  Waktu: {item.Tanggal} | {item.Jam}
                  <br />
                  Kedalaman: {item.Kedalaman}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
    </MapContainer>
  );
};

export default Maps;
