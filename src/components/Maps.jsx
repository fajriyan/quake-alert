import { useMemo, useState } from "react";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [-2.5, 118];
const DEFAULT_ZOOM = 5;

const MIGHTY_BANDS = [
  {
    min: 0,
    max: 3.9,
    label: "Ringan",
    color: "#2563eb",
    fillColor: "#60a5fa",
  },
  {
    min: 4,
    max: 4.9,
    label: "Sedang",
    color: "#f59e0b",
    fillColor: "#fbbf24",
  },
  {
    min: 5,
    max: 5.9,
    label: "Kuat",
    color: "#f97316",
    fillColor: "#fb7185",
  },
  {
    min: 6,
    max: Infinity,
    label: "Sangat kuat",
    color: "#dc2626",
    fillColor: "#ef4444",
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseMagnitude = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseDepth = (value) => {
  if (!value) return "-";
  return String(value);
};

const parseCoordinateValue = (value) => {
  const parsed = parseFloat(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const getZoomPrecision = (zoom) => {
  if (zoom <= 4) return 1.5;
  if (zoom <= 6) return 0.75;
  if (zoom <= 8) return 0.35;
  return 0.15;
};

const getMagnitudeStyle = (magnitude) => {
  const band =
    MIGHTY_BANDS.find((item) => magnitude >= item.min && magnitude <= item.max) ||
    MIGHTY_BANDS[0];

  return band;
};

const roundToPrecision = (value, precision) =>
  Math.round(value / precision) * precision;

const formatCoordinate = (value) =>
  Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);

const buildClusters = (items, zoom) => {
  const precision = getZoomPrecision(zoom);
  const grouped = new Map();

  items.forEach((item) => {
    const lat = parseCoordinateValue(item?.lat);
    const lon = parseCoordinateValue(item?.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return;
    }

    const normalizedLat = roundToPrecision(lat, precision);
    const normalizedLon = roundToPrecision(lon, precision);
    const key = `${normalizedLat}:${normalizedLon}`;

    const magnitude = parseMagnitude(item?.Magnitude);
    const band = getMagnitudeStyle(magnitude);

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        center: [normalizedLat, normalizedLon],
        items: [],
        totalMagnitude: 0,
        maxMagnitude: 0,
        band,
      });
    }

    const cluster = grouped.get(key);
    cluster.items.push({ ...item, magnitude });
    cluster.totalMagnitude += magnitude;
    cluster.maxMagnitude = Math.max(cluster.maxMagnitude, magnitude);
    cluster.band = getMagnitudeStyle(cluster.maxMagnitude);
  });

  return Array.from(grouped.values())
    .map((cluster) => ({
      ...cluster,
      count: cluster.items.length,
      averageMagnitude: cluster.items.length
        ? cluster.totalMagnitude / cluster.items.length
        : 0,
    }))
    .sort((a, b) => b.count - a.count || b.maxMagnitude - a.maxMagnitude);
};

const ClusterIcon = ({ count, color }) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: ${clamp(28 + count * 2, 34, 60)}px;
        height: ${clamp(28 + count * 2, 34, 60)}px;
        border-radius: 9999px;
        background: ${color};
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 13px;
        border: 2px solid rgba(255,255,255,0.95);
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.24);
      ">
        ${count}
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 30],
  });

const ZoomTracker = ({ onZoomChange }) => {
  useMapEvents({
    zoomend: (event) => {
      onZoomChange(event.target.getZoom());
    },
  });

  return null;
};

const SmartLegend = ({ totalCount, clusterCount }) => {
  return (
    <div className="absolute left-3 bottom-3 z-[500] max-w-[220px] rounded-xl border border-white/70 bg-white/95 p-3 text-xs text-slate-700 shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100">
      <div className="mb-2">
        <p className="text-sm font-semibold">Peta Gempa</p>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-300">
          {totalCount} kejadian ditampilkan, {clusterCount} titik cluster pada
          zoom ini.
        </p>
      </div>
      <div className="space-y-1.5">
        {MIGHTY_BANDS.map((band) => (
          <div key={band.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full ring-1 ring-white"
              style={{ backgroundColor: band.color }}
            />
            <span>{band.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Maps = ({ data }) => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const normalizedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data
      .map((item) => {
        const coordinate = String(item?.Coordinates || "").split(",");
        if (coordinate.length !== 2) return null;

        const lat = parseCoordinateValue(coordinate[0]);
        const lon = parseCoordinateValue(coordinate[1]);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

        const magnitude = parseMagnitude(item?.Magnitude);

        return {
          ...item,
          lat,
          lon,
          magnitude,
        };
      })
      .filter(Boolean);
  }, [data]);

  const clusters = useMemo(
    () => buildClusters(normalizedData, zoom),
    [normalizedData, zoom],
  );

  return (
    <div className="relative">
      <SmartLegend totalCount={normalizedData.length} clusterCount={clusters.length} />
      <MapContainer
        className="h-[450px] sm:h-[550px] w-full rounded-xl overflow-hidden"
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
      >
        <ZoomTracker onZoomChange={setZoom} />
        <TileLayer
          attribution="Data Gempa"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {clusters.map((cluster) => {
          const isCluster = cluster.count > 1;
          const style = getMagnitudeStyle(cluster.maxMagnitude);

          if (isCluster) {
            return (
              <Marker
                key={cluster.key}
                position={cluster.center}
                icon={ClusterIcon({
                  count: cluster.count,
                  color: style.color,
                })}
              >
                <Popup>
                  <div className="space-y-1 text-sm">
                    <p className="font-semibold">
                      {cluster.count} gempa di area ini
                    </p>
                    <p>
                      Magnitudo tertinggi: <strong>M{cluster.maxMagnitude.toFixed(1)}</strong>
                    </p>
                    <p>
                      Rata-rata magnitudo:{" "}
                      <strong>{cluster.averageMagnitude.toFixed(1)}</strong>
                    </p>
                    <p>
                      Perkiraan pusat cluster:{" "}
                      <strong>
                        {formatCoordinate(cluster.center[0])},{" "}
                        {formatCoordinate(cluster.center[1])}
                      </strong>
                    </p>
                    <div className="pt-1">
                      <p className="font-medium">Contoh kejadian:</p>
                      <ul className="list-disc pl-4 text-xs">
                        {cluster.items.slice(0, 3).map((item) => (
                          <li key={`${item.DateTime}-${item.Coordinates}`}>
                            {item.Wilayah} - M{item.Magnitude} - {item.Tanggal} {item.Jam}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }

          const item = cluster.items[0];
          const radius = clamp(cluster.maxMagnitude * 3.25, 7, 20);

          return (
            <CircleMarker
              key={cluster.key}
              center={cluster.center}
              radius={radius}
              pathOptions={{
                color: style.color,
                fillColor: style.fillColor,
                fillOpacity: 0.6,
                weight: 1.5,
              }}
            >
              <Tooltip direction="top" opacity={1} sticky>
                <span>
                  <strong>{item.Wilayah}</strong>
                  <br />
                  Magnitudo: M{item.Magnitude}
                  <br />
                  Kedalaman: {parseDepth(item.Kedalaman)}
                  <br />
                  Waktu: {item.Tanggal} | {item.Jam}
                </span>
              </Tooltip>
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{item.Wilayah}</p>
                  <p>Magnitudo: M{item.Magnitude}</p>
                  <p>Kedalaman: {parseDepth(item.Kedalaman)}</p>
                  <p>Waktu: {item.Tanggal} | {item.Jam}</p>
                  <p>Koordinat: {item.Coordinates}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Maps;
