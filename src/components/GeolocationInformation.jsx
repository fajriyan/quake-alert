import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 180, damping: 22 },
  },
};

const cardClassName =
  "rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.25)] backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70";

const statClassName =
  "rounded-2xl border border-slate-200/70 bg-slate-50/90 p-3 dark:border-slate-700/60 dark:bg-slate-800/70";

const formatValue = (value, fallback = "—") =>
  value === null || value === undefined || value === ""
    ? fallback
    : String(value);

const formatFixed = (value, digits = 2, fallback = "—") =>
  value === null || value === undefined || Number.isNaN(Number(value))
    ? fallback
    : Number(value).toFixed(digits);

const formatKm = (value, digits = 0, fallback = "—") =>
  value === null || value === undefined || Number.isNaN(Number(value))
    ? fallback
    : `${Number(value).toLocaleString("id-ID", {
        maximumFractionDigits: digits,
      })} km`;

const InfoChip = ({ label, value }) => (
  <div className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200">
    <span className="font-medium text-slate-900 dark:text-white">{label}:</span>{" "}
    {value}
  </div>
);

const MetricCard = ({ label, value, note, tone = "from-violet-500 to-sky-500" }) => (
  <div className={statClassName}>
    <div className={`h-1.5 w-12 rounded-full bg-linear-to-r ${tone}`} />
    <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
      {label}
    </p>
    <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
      {value}
    </p>
    {note ? (
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {note}
      </p>
    ) : null}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-3">
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
      {subtitle}
    </p>
    <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
      {title}
    </h3>
  </div>
);

const ProgressRow = ({ label, value, percent, accent = "bg-violet-600" }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
      <span>{label}</span>
      <span className="font-medium text-slate-700 dark:text-slate-200">
        {value}
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      <div
        className={`h-full rounded-full ${accent} transition-all duration-700 ease-out`}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        aria-hidden
      />
    </div>
  </div>
);

const GeolocationInformation = () => {
  const [data, setData] = useState(null);
  const [astro, setAstro] = useState(null);
  const [lat, setLat] = useState(null);
  const [lon, setLon] = useState(null);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingAstro, setLoadingAstro] = useState(true);

  const hasCoordinates = lat !== null && lon !== null;

  const getCurrentWeather = async () => {
    const cachedData = localStorage.getItem("weatherData");
    const cacheExpiration = Number(
      localStorage.getItem("weatherDataExpiration")
    );

    if (
      cachedData &&
      cacheExpiration &&
      new Date().getTime() < cacheExpiration
    ) {
      setData(JSON.parse(cachedData));
      setLoadingWeather(false);
      return;
    }

    if (!hasCoordinates) {
      return;
    }

    setLoadingWeather(true);

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${
          import.meta.env.VITE_API_WEATHER_VENDOR
        }&units=metric&lang=id`
      );

      setData(res.data);
      setError(null);
      localStorage.setItem("weatherData", JSON.stringify(res.data));
      localStorage.setItem(
        "weatherDataExpiration",
        String(new Date().getTime() + 1700000)
      );
    } catch (err) {
      console.error("Weather API error:", err);
      setError("Gagal memuat data cuaca.");
    } finally {
      setLoadingWeather(false);
    }
  };

  const getAstronomyData = async () => {
    if (!hasCoordinates) {
      return;
    }

    setLoadingAstro(true);

    try {
      const res = await axios.get(
        `https://api.ipgeolocation.io/astronomy?apiKey=${
          import.meta.env.VITE_GEOLOCATION_API_KEY
        }&lat=${lat}&long=${lon}`
      );

      setAstro(res.data);
      setError(null);
    } catch (err) {
      console.error("Astronomy API error:", err);
      setError((current) => current ?? "Gagal memuat data astronomi.");
    } finally {
      setLoadingAstro(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung oleh browser ini.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
        setError(null);
        setLoadingLocation(false);
      },
      (positionError) => {
        console.error("Error getting location:", positionError);
        setError("Gagal mendapatkan lokasi. Aktifkan izin lokasi pada browser.");
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (!hasCoordinates) {
      return;
    }

    getCurrentWeather();
    getAstronomyData();
  }, [lat, lon]);

  const weatherStats = useMemo(
    () => [
      {
        label: "Feels like",
        value: formatValue(formatFixed(data?.main?.feels_like, 1)),
        note: "Suhu yang terasa di tubuh",
      },
      {
        label: "Kelembapan",
        value: formatValue(
          data?.main?.humidity !== undefined ? `${data.main.humidity}%` : null
        ),
        note: "Kondisi udara saat ini",
      },
      {
        label: "Angin",
        value: formatValue(
          data?.wind?.speed !== undefined
            ? `${formatFixed(data.wind.speed, 1)} m/s`
            : null
        ),
        note: "Kecepatan angin permukaan",
      },
      {
        label: "Tekanan",
        value: formatValue(
          data?.main?.pressure !== undefined
            ? `${data.main.pressure} hPa`
            : null
        ),
        note: "Tekanan atmosfer",
      },
    ],
    [data]
  );

  const astroSummary = useMemo(
    () => [
      {
        label: "Sunrise",
        value: formatValue(astro?.sunrise),
      },
      {
        label: "Sunset",
        value: formatValue(astro?.sunset),
      },
      {
        label: "Solar Noon",
        value: formatValue(astro?.solar_noon),
      },
      {
        label: "Moonrise",
        value: formatValue(astro?.moonrise),
      },
      {
        label: "Moonset",
        value: formatValue(astro?.moonset),
      },
      {
        label: "Fase Bulan",
        value: formatValue(astro?.moon_phase),
      },
    ],
    [astro]
  );

  const distanceBars = useMemo(() => {
    if (!astro?.sun_distance || !astro?.moon_distance) {
      return null;
    }

    const sun = Number(astro.sun_distance);
    const moon = Number(astro.moon_distance);
    const logSun = Math.log10(Math.max(sun, 1));
    const logMoon = Math.log10(Math.max(moon, 1));
    const minLog = Math.min(logSun, logMoon);
    const maxLog = Math.max(logSun, logMoon);
    const normalize = (value) =>
      maxLog === minLog
        ? 100
        : Math.round(
            ((Math.log10(Math.max(value, 1)) - minLog) / (maxLog - minLog)) *
              100
          );

    return {
      sun: normalize(sun),
      moon: normalize(moon),
    };
  }, [astro]);

  const altitudeBars = useMemo(() => {
    if (astro?.sun_altitude == null || astro?.moon_altitude == null) {
      return null;
    }

    const mapAltitude = (value) => Math.round(((Number(value) + 90) / 180) * 100);

    return {
      sun: mapAltitude(astro.sun_altitude),
      moon: mapAltitude(astro.moon_altitude),
    };
  }, [astro]);

  const azimuthBars = useMemo(() => {
    if (astro?.sun_azimuth == null || astro?.moon_azimuth == null) {
      return null;
    }

    const mapAzimuth = (value) => Math.round((Number(value) % 360) / 3.6);

    return {
      sun: mapAzimuth(astro.sun_azimuth),
      moon: mapAzimuth(astro.moon_azimuth),
    };
  }, [astro]);

  const moonIllumination = useMemo(() => {
    if (astro?.moon_illumination_percentage == null) {
      return null;
    }

    return Math.max(0, Math.min(100, Number(astro.moon_illumination_percentage)));
  }, [astro]);

  return (
    <motion.section
      className="w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-slate-50 to-sky-50 p-4 text-sm shadow-[0_20px_80px_-35px_rgba(15,23,42,0.35)] dark:border-slate-700/70 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={itemVariants}
        className="mb-4 flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-xs backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70"
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Geolocation Dashboard
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
              Informasi lokasi, cuaca, dan astronomi
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Data ini dibaca langsung dari lokasi perangkat untuk memberi konteks
              yang lebih jelas tentang kondisi sekitar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                error
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-200"
                  : loadingLocation || loadingWeather || loadingAstro
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-200"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-200"
              }`}
            >
              {error
                ? "Perlu perhatian"
                : loadingLocation || loadingWeather || loadingAstro
                ? "Memuat data"
                : "Aktif"}
            </div>
            <div className="rounded-full border border-slate-200/80 px-3 py-1 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-300">
              Lokasi:{" "}
              {formatValue(
                lat !== null && lon !== null ? "tersedia" : "menunggu izin"
              )}
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            {error}
          </div>
        ) : null}
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
        <motion.div variants={itemVariants} className={cardClassName}>
          <SectionTitle
            subtitle="Cuaca sekarang"
            title="Ringkasan kondisi terkini"
          />

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-sky-100 to-indigo-100 shadow-inner dark:from-sky-950/60 dark:to-indigo-950/60">
                {loadingWeather || !data ? (
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-300/70 dark:bg-slate-700/70" />
                ) : (
                  <img
                    src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@4x.png`}
                    alt={data?.weather?.[0]?.description ?? "ikon cuaca"}
                    className="h-20 w-20 object-contain"
                  />
                )}
              </div>

              <div>
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {loadingWeather && !data
                    ? "--"
                    : formatValue(formatFixed(data?.main?.temp, 1))}
                  {loadingWeather && !data ? "" : "°C"}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {formatValue(
                    data?.weather?.[0]?.description ?? "Menunggu data cuaca"
                  )}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {formatValue(data?.name)}{" "}
                  {data?.sys?.country ? `, ${data.sys.country}` : ""}
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/70">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Dirasakan
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {formatValue(formatFixed(data?.main?.feels_like, 1))}
                  {data?.main?.feels_like != null ? "°C" : ""}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/70">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  Terakhir update
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {data?.dt
                    ? new Date(data.dt * 1000).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <InfoChip
              label="Koordinat"
              value={
                lat !== null && lon !== null
                  ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
                  : "belum tersedia"
              }
            />
            <InfoChip
              label="Lokasi"
              value={formatValue(data?.name ?? "Perangkat aktif")}
            />
            <InfoChip
              label="Zona"
              value={astro?.date ? astro.date : "mengikuti perangkat"}
            />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {weatherStats.map((item) => (
              <MetricCard
                key={item.label}
                label={item.label}
                value={item.value}
                note={item.note}
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={cardClassName}>
          <SectionTitle
            subtitle="Status perangkat"
            title="Konteks lokasi yang sedang dibaca"
          />

          <div className="space-y-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700/60 dark:bg-slate-800/70">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                Izin lokasi
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                {loadingLocation
                  ? "Meminta akses lokasi"
                  : error
                  ? "Tidak berhasil"
                  : "Berhasil dibaca"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {error
                  ? "Aktifkan izin lokasi agar dashboard bisa menampilkan data sekitar dengan akurat."
                  : "Koordinat dipakai untuk mengambil cuaca dan data astronomi secara otomatis."}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="Latitude"
                value={lat !== null ? formatFixed(lat, 4) : "—"}
                note="Garis lintang perangkat"
                tone="from-cyan-500 to-sky-500"
              />
              <MetricCard
                label="Longitude"
                value={lon !== null ? formatFixed(lon, 4) : "—"}
                note="Garis bujur perangkat"
                tone="from-indigo-500 to-violet-500"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                label="Cuaca"
                value={
                  loadingWeather && !data
                    ? "Memuat"
                    : formatValue(data?.weather?.[0]?.main ?? "Tidak tersedia")
                }
                note="Status singkat dari OpenWeather"
                tone="from-emerald-500 to-teal-500"
              />
              <MetricCard
                label="Astronomi"
                value={loadingAstro && !astro ? "Memuat" : "Aktif"}
                note="Data matahari dan bulan sedang dipantau"
                tone="from-amber-500 to-orange-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className={cardClassName}>
          <SectionTitle
            subtitle="Astronomi utama"
            title="Data matahari dan bulan"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            {astroSummary.map((item) => (
              <div key={item.label} className={statClassName}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3">
            <MetricCard
              label="Cahaya bulan"
              value={
                moonIllumination !== null ? `${moonIllumination}%` : "—"
              }
              note="Semakin tinggi nilainya, semakin terang bulan tampak"
              tone="from-fuchsia-500 to-violet-500"
            />

            <MetricCard
              label="Durasi siang"
              value={formatValue(astro?.day_length)}
              note="Panjang waktu siang pada koordinat saat ini"
              tone="from-sky-500 to-cyan-500"
            />
          </div>
        </div>

        <div className={cardClassName}>
          <SectionTitle
            subtitle="Visualisasi"
            title="Perbandingan jarak dan posisi"
          />

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700/60 dark:bg-slate-800/70">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Jarak Matahari</span>
                <span>
                  {astro?.sun_distance != null
                    ? `${Number(astro.sun_distance / 1000000).toLocaleString(
                        "id-ID",
                        { maximumFractionDigits: 0 }
                      )} juta km`
                    : "—"}
                </span>
              </div>
              <div className="mt-3 space-y-3">
                <ProgressRow
                  label="Matahari"
                  value={distanceBars ? `${distanceBars.sun}%` : "—"}
                  percent={distanceBars?.sun ?? 0}
                  accent="bg-linear-to-r from-amber-500 to-orange-500"
                />
                <ProgressRow
                  label="Bulan"
                  value={distanceBars ? `${distanceBars.moon}%` : "—"}
                  percent={distanceBars?.moon ?? 0}
                  accent="bg-linear-to-r from-sky-500 to-violet-500"
                />
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                Skala logaritmik dipakai agar perbedaan jarak yang sangat jauh tetap
                mudah dibaca.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700/60 dark:bg-slate-800/70">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Altitude</span>
                <span>
                  {formatFixed(astro?.sun_altitude, 2)}° /{" "}
                  {formatFixed(astro?.moon_altitude, 2)}°
                </span>
              </div>
              <div className="mt-3 space-y-3">
                <ProgressRow
                  label="Matahari"
                  value={altitudeBars ? `${altitudeBars.sun}%` : "—"}
                  percent={altitudeBars?.sun ?? 0}
                  accent="bg-linear-to-r from-amber-500 to-yellow-400"
                />
                <ProgressRow
                  label="Bulan"
                  value={altitudeBars ? `${altitudeBars.moon}%` : "—"}
                  percent={altitudeBars?.moon ?? 0}
                  accent="bg-linear-to-r from-sky-500 to-indigo-500"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/90 p-4 dark:border-slate-700/60 dark:bg-slate-800/70">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Azimuth</span>
                <span>
                  {formatFixed(astro?.sun_azimuth, 2)}° /{" "}
                  {formatFixed(astro?.moon_azimuth, 2)}°
                </span>
              </div>
              <div className="mt-3 space-y-3">
                <ProgressRow
                  label="Matahari"
                  value={azimuthBars ? `${azimuthBars.sun}%` : "—"}
                  percent={azimuthBars?.sun ?? 0}
                  accent="bg-linear-to-r from-orange-500 to-rose-500"
                />
                <ProgressRow
                  label="Bulan"
                  value={azimuthBars ? `${azimuthBars.moon}%` : "—"}
                  percent={azimuthBars?.moon ?? 0}
                  accent="bg-linear-to-r from-indigo-500 to-fuchsia-500"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-4">
        <div className={cardClassName}>
          <SectionTitle
            subtitle="Detail tambahan"
            title="Informasi yang sering dicari"
          />

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard
              label="Tanggal"
              value={astro?.date ?? "—"}
              note="Tanggal yang dipakai oleh layanan astronomi"
              tone="from-slate-500 to-slate-700"
            />
            <MetricCard
              label="Waktu lokal"
              value={astro?.current_time ?? "—"}
              note="Waktu setempat dari lokasi perangkat"
              tone="from-cyan-500 to-blue-500"
            />
            <MetricCard
              label="Jarak pandang"
              value={
                data?.visibility !== undefined ? `${data.visibility} m` : "—"
              }
              note="Jarak pandang udara dari API cuaca"
              tone="from-violet-500 to-fuchsia-500"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <InfoChip
              label="Sunrise"
              value={formatValue(astro?.sunrise)}
            />
            <InfoChip
              label="Sunset"
              value={formatValue(astro?.sunset)}
            />
            <InfoChip
              label="Moonrise"
              value={formatValue(astro?.moonrise)}
            />
            <InfoChip
              label="Moonset"
              value={formatValue(astro?.moonset)}
            />
            <InfoChip
              label="Cuaca"
              value={formatValue(data?.weather?.[0]?.main ?? "Tidak tersedia")}
            />
            <InfoChip
              label="Jarak Bulan"
              value={formatKm(astro?.moon_distance, 0)}
            />
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default GeolocationInformation;
