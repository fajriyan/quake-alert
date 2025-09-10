// src/components/EarthquakeTableCache.jsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const CACHE_KEY = "earthquake_data";
const CACHE_TIME = 1000 * 60 * 60; // 1 jam dalam ms

const EarthquakeTableCache = () => {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarthquakes = async () => {
      try {
        setLoading(true);

        // cek cache dulu
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = new Date().getTime();
          if (now - parsed.timestamp < CACHE_TIME) {
            setEarthquakes(parsed.data);
            setLoading(false);
            return;
          }
        }

        // fetch data baru
        const res = await axios.get(
          "https://eonet.gsfc.nasa.gov/api/v3/events"
        );

        // filter earthquake dan ambil 10 terbaru
        const quakeEvents = res.data.events
          // .filter((event) =>
          //   event.categories.some((cat) => cat.id === "earthquakes")
          // )
          .sort(
            (a, b) =>
              new Date(b.geometry[0].date) - new Date(a.geometry[0].date)
          )
          .slice(0, 10);

        setEarthquakes(quakeEvents);

        // simpan ke cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: quakeEvents, timestamp: new Date().getTime() })
        );
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data gempa");
      } finally {
        setLoading(false);
      }
    };

    fetchEarthquakes();
  }, []);

  if (loading) return <p>Loading data gempa...</p>;
  if (error) return <p>{error}</p>;
  if (earthquakes.length === 0) return <p>Tidak ada data gempa saat ini.</p>;

  return (
    <div className="">
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Judul</th>
              <th className="border px-4 py-2 text-left">Tanggal</th>
              <th className="border px-4 py-2 text-left">Koordinat</th>
              <th className="border px-4 py-2 text-left">Sumber</th>
              <th className="border px-4 py-2 text-left">Link Detail</th>
            </tr>
          </thead>
          <tbody>
            {earthquakes.map((eq) => (
              <tr key={eq.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{eq.title}</td>
                <td className="border px-4 py-2">
                  {new Date(eq.geometry[0].date).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  Lat {eq.geometry[0].coordinates[1]}, Lon{" "}
                  {eq.geometry[0].coordinates[0]}
                </td>
                <td className="border px-4 py-2">
                  {eq.sources.map((s) => s.id).join(", ")}
                </td>
                <td className="border px-4 py-2">
                  <a
                    href={eq.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarthquakeTableCache;
