import axios from "axios";
import { useEffect, useState } from "react";

const GeolocationInformation = () => {
  const [data, setData] = useState();
  const [astro, setAstro] = useState();
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [error, setError] = useState(null);

  const getCurrentWeather = async () => {
    const cachedData = localStorage.getItem("weatherData");
    const cacheExpiration = localStorage.getItem("weatherDataExpiration");

    if (
      cachedData &&
      cacheExpiration &&
      new Date().getTime() < cacheExpiration
    ) {
      setData(JSON.parse(cachedData));
    } else if (lat && lon) {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
            import.meta.env.VITE_API_WEATHER_VENDOR
          }&units=metric&lang=id`
        );
        const get = res.data;
        setData(get);

        localStorage.setItem("weatherData", JSON.stringify(get));
        localStorage.setItem(
          "weatherDataExpiration",
          new Date().getTime() + 1700000
        );
      } catch (err) {
        console.error("Weather API error:", err);
        setError("Gagal memuat data cuaca.");
      }
    }
  };

  const getAstronomyData = async () => {
    if (lat && lon) {
      try {
        const res = await axios.get(
          `https://api.ipgeolocation.io/astronomy?apiKey=${
            import.meta.env.VITE_GEOLOCATION_API_KEY
          }&lat=${lat}&long=${lon}`
        );
        setAstro(res.data);
      } catch (err) {
        console.error("Astronomy API error:", err);
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLon(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Gagal mendapatkan lokasi.");
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getCurrentWeather();
    getAstronomyData();
  }, [lat, lon]);

  return (
    <div className="p-4 text-sm rounded-md space-y-4 w-full border border-slate-200 overflow-hidden">
      {error ? (
        <div className="text-red-500 text-xs">
          <p>{error}</p>
        </div>
      ) : (
        <div className="">
          <div className="flex gap-5 items-center">
            {data && (
              <div className="flex items-center gap-3">
                <img
                  src={`https://openweathermap.org/img/wn/${data?.weather[0]?.icon}@4x.png`}
                  alt="icon cuaca"
                  className="w-[50px]"
                />
                <div>
                  <p className="font-semibold text-lg">{data?.main?.temp}°C</p>
                  <p className="text-xs">{data?.name}</p>
                </div>
              </div>
            )}
          </div>

          {astro && (
            <div className="mt-6 space-y-6">
              {/* 📌 Umum */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2">
                  📌 Umum
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 text-xs text-slate-700">
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">📍 Lokasi</p>
                    <p>
                      {astro.location?.latitude}, {astro.location?.longitude}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🗓️ Tanggal</p>
                    <p>{astro.date}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🕒 Waktu</p>
                    <p>{astro.current_time}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🕒 Panjang Hari</p>
                    <p>{astro.day_length}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">📏 Jarak Matahari</p>
                    <p>
                      {Number(astro.sun_distance / 1000000).toFixed(0)} juta km
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">📏 Jarak Bulan</p>
                    <p>{Number(astro.moon_distance).toFixed(0)} km</p>
                  </div>
                </div>
              </div>

              {/* ☀️ Matahari */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2">
                  ☀️ Matahari
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 text-xs text-slate-700">
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌅 Sunrise</p>
                    <p>{astro.sunrise}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌇 Sunset</p>
                    <p>{astro.sunset}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌞 Solar Noon</p>
                    <p>{astro.solar_noon}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">☀️ Sun Altitude</p>
                    <p>{astro.sun_altitude.toFixed(2)}°</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">☀️ Sun Azimuth</p>
                    <p>{astro.sun_azimuth.toFixed(2)}°</p>
                  </div>
                </div>
              </div>

              {/* 🌙 Bulan */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2">
                  🌙 Bulan
                </h4>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 text-xs text-slate-700">
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌙 Moonrise</p>
                    <p>{astro.moonrise}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌘 Moonset</p>
                    <p>{astro.moonset}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌔 Fase Bulan</p>
                    <p>{astro.moon_phase}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">💡 Cahaya Bulan</p>
                    <p>{astro.moon_illumination_percentage}%</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌙 Moon Altitude</p>
                    <p>{astro.moon_altitude.toFixed(2)}°</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 shadow-sm">
                    <p className="font-medium">🌙 Moon Azimuth</p>
                    <p>{astro.moon_azimuth.toFixed(2)}°</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            {/* helper calculations (inline di JSX) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Distance card */}
              <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">
                      📏 Jarak
                    </p>
                    <p className="text-sm text-slate-800 font-semibold mt-1">
                      {astro?.sun_distance
                        ? `${Number(
                            astro.sun_distance / 1000000
                          ).toLocaleString()} juta km`
                        : "—"}
                      {"  "} /{"  "}
                      {astro?.moon_distance
                        ? `${Number(astro.moon_distance).toLocaleString()} km`
                        : "—"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Skala (log) untuk perbandingan visual
                    </p>
                  </div>
                </div>

                {/* visual comparative bars (log scale) */}
                <div className="mt-3 space-y-2">
                  {astro?.sun_distance && astro?.moon_distance
                    ? (() => {
                        const sun = Number(astro.sun_distance); // km
                        const moon = Number(astro.moon_distance); // km
                        const logSun = Math.log10(Math.max(sun, 1));
                        const logMoon = Math.log10(Math.max(moon, 1));
                        const minLog = Math.min(logSun, logMoon);
                        const maxLog = Math.max(logSun, logMoon);
                        const normalize = (v) =>
                          maxLog === minLog
                            ? 100
                            : Math.round(
                                ((Math.log10(Math.max(v, 1)) - minLog) /
                                  (maxLog - minLog)) *
                                  100
                              );

                        const sunPct = normalize(sun);
                        const moonPct = normalize(moon);

                        return (
                          <div className="space-y-2">
                            <div className="text-xs text-slate-500 flex items-center justify-between">
                              <span>☀️ Matahari</span>
                              <span className="font-medium text-slate-700">
                                {sunPct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-violet-800"
                                style={{ width: `${sunPct}%` }}
                                aria-hidden
                              />
                            </div>

                            <div className="text-xs text-slate-500 flex items-center justify-between mt-2">
                              <span>🌙 Bulan</span>
                              <span className="font-medium text-slate-700">
                                {moonPct}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-violet-800"
                                style={{ width: `${moonPct}%` }}
                                aria-hidden
                              />
                            </div>
                          </div>
                        );
                      })()
                    : null}
                </div>
              </div>

              {/* Altitude card */}
              <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  🧭 Altitude
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        ☀️{" "}
                        {astro?.sun_altitude
                          ? `${astro.sun_altitude.toFixed(2)}°`
                          : "—"}
                      </span>
                      <span className="text-xs text-slate-600">
                        🌙{" "}
                        {astro?.moon_altitude
                          ? `${astro.moon_altitude.toFixed(2)}°`
                          : "—"}
                      </span>
                    </div>
                    {/* normalize altitude (-90..90) -> 0..100 */}
                    {astro?.sun_altitude != null &&
                      astro?.moon_altitude != null &&
                      (() => {
                        const mapAlt = (v) =>
                          Math.round(((Number(v) + 90) / 180) * 100);
                        const sunPct = mapAlt(astro.sun_altitude);
                        const moonPct = mapAlt(astro.moon_altitude);
                        return (
                          <div className="mt-2 space-y-2">
                            <div className="text-xs text-slate-500 flex items-center justify-between">
                              <span className="mr-2">☀️</span>
                              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-violet-800"
                                  style={{ width: `${sunPct}%` }}
                                />
                              </div>
                              <span className="ml-3 w-10 text-right text-xs text-slate-600">
                                {sunPct}%
                              </span>
                            </div>

                            <div className="text-xs text-slate-500 flex items-center justify-between">
                              <span className="mr-2">🌙</span>
                              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-violet-800"
                                  style={{ width: `${moonPct}%` }}
                                />
                              </div>
                              <span className="ml-3 w-10 text-right text-xs text-slate-600">
                                {moonPct}%
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                </div>
              </div>

              {/* Azimuth card */}
              <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">🧭 Azimuth</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      ☀️{" "}
                      {astro?.sun_azimuth
                        ? `${astro.sun_azimuth.toFixed(2)}°`
                        : "—"}
                    </span>
                    <span>
                      🌙{" "}
                      {astro?.moon_azimuth
                        ? `${astro.moon_azimuth.toFixed(2)}°`
                        : "—"}
                    </span>
                  </div>

                  {astro?.sun_azimuth != null &&
                    astro?.moon_azimuth != null &&
                    (() => {
                      const mapAz = (v) =>
                        Math.round(((Number(v) % 360) / 360) * 100);
                      const sunPct = mapAz(astro.sun_azimuth);
                      const moonPct = mapAz(astro.moon_azimuth);

                      return (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 text-xs text-slate-600">☀️</div>
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-violet-800"
                                style={{ width: `${sunPct}%` }}
                              />
                            </div>
                            <div className="w-10 text-right text-xs text-slate-600">
                              {sunPct}%
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 text-xs text-slate-600">🌙</div>
                            <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="h-2 rounded-full bg-violet-800"
                                style={{ width: `${moonPct}%` }}
                              />
                            </div>
                            <div className="w-10 text-right text-xs text-slate-600">
                              {moonPct}%
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                </div>
              </div>

              {/* Phase / Illumination card */}
              <div className="bg-slate-50 rounded-xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs text-slate-500 font-medium">
                  🌗 Fase & Illumination
                </p>
                <div className="mt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-800 font-semibold">
                        {astro?.moon_phase ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Fase Bulan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-800 font-semibold">
                        {astro?.moon_illumination_percentage != null
                          ? `${astro.moon_illumination_percentage}%`
                          : "—"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Illumination
                      </p>
                    </div>
                  </div>

                  {/* illumination bar */}
                  {astro?.moon_illumination_percentage != null && (
                    <div className="mt-3">
                      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                        <div
                          className="h-3 rounded-full bg-violet-800"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(100, astro.moon_illumination_percentage)
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Lebih tinggi berarti bulan lebih terang
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeolocationInformation;
