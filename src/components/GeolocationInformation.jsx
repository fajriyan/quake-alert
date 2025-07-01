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
            <div className="flex gap-4 flex-wrap text-gray-700 text-xs mt-5">
              <p>
                <strong>📍 Lokasi:</strong> {astro.location?.latitude},{" "}
                {astro.location?.longitude}
              </p>
              <p>
                <strong>🗓️ Tanggal:</strong> {astro.date}
              </p>
              <p>
                <strong>🕒 Waktu Sekarang:</strong> {astro.current_time}
              </p>
              <p>
                <strong>☀️ Sunrise:</strong> {astro.sunrise}
              </p>
              <p>
                <strong>🌇 Sunset:</strong> {astro.sunset}
              </p>
              <p>
                <strong>🌞 Solar Noon:</strong> {astro.solar_noon}
              </p>
              <p>
                <strong>🕒 Panjang Hari:</strong> {astro.day_length}
              </p>
              <p>
                <strong>🌙 Moonrise:</strong> {astro.moonrise}
              </p>
              <p>
                <strong>🌘 Moonset:</strong> {astro.moonset}
              </p>
              <p>
                <strong>🌔 Fase Bulan:</strong> {astro.moon_phase}
              </p>
              <p>
                <strong>💡 Cahaya Bulan:</strong>{" "}
                {astro.moon_illumination_percentage}%
              </p>
              <p>
                <strong>📏 Jarak Bulan:</strong>{" "}
                {Number(astro.moon_distance).toFixed(0)} km
              </p>
              <p>
                <strong>📏 Jarak Matahari:</strong>{" "}
                {Number(astro.sun_distance / 1000000).toFixed(0)} juta km
              </p>
              <p>
                <strong>🌙 Moon Altitude:</strong>{" "}
                {astro.moon_altitude.toFixed(2)}°
              </p>
              <p>
                <strong>🌙 Moon Azimuth:</strong>{" "}
                {astro.moon_azimuth.toFixed(2)}°
              </p>
              <p>
                <strong>☀️ Sun Altitude:</strong>{" "}
                {astro.sun_altitude.toFixed(2)}°
              </p>
              <p>
                <strong>☀️ Sun Azimuth:</strong> {astro.sun_azimuth.toFixed(2)}°
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeolocationInformation;
