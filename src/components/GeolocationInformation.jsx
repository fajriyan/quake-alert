import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const EASE = [0.16, 1, 0.3, 1];

const containerVariants = {
   hidden: { opacity: 0, y: 12 },
   show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
   },
};

const itemVariants = {
   hidden: { opacity: 0, y: 12 },
   show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: EASE },
   },
};

const cardClassName =
   "rounded-[12px] border border-line bg-surface p-6 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] md:p-8";

const rowClassName =
   "flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0";

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

const Eyebrow = ({ children, className = "" }) => (
   <p
      className={`font-mono text-[11px] uppercase tracking-[0.18em] text-muted ${className}`}
   >
      {children}
   </p>
);

const Badge = ({ tone, children }) => {
   const tones = {
      ok: "bg-green-bg text-green-fg",
      wait: "bg-yellow-bg text-yellow-fg",
      bad: "bg-red-bg text-red-fg",
      mute: "bg-sunk text-muted border border-line",
   };

   return (
      <span
         className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${tones[tone]}`}
      >
         {children}
      </span>
   );
};

const SectionHead = ({ index, title, meta }) => (
   <div className="mb-6 flex items-baseline justify-between gap-6 border-b border-line pb-4">
      <div>
         <Eyebrow>{index}</Eyebrow>
         <h3 className="mt-2 text-xl font-medium tracking-[-0.02em] text-ink">
            {title}
         </h3>
      </div>
      {meta ? <Eyebrow className="shrink-0">{meta}</Eyebrow> : null}
   </div>
);

const Row = ({ label, value, mono = true, hint }) => (
   <div className={rowClassName}>
      <div>
         <Eyebrow>{label}</Eyebrow>
         {hint ? (
            <p className="mt-1 text-xs leading-relaxed text-muted">{hint}</p>
         ) : null}
      </div>
      <span
         className={`shrink-0 text-right text-sm text-ink ${
            mono ? "font-mono tracking-tight" : "font-medium"
         }`}
      >
         {value}
      </span>
   </div>
);

const Meter = ({ label, value, percent, fill }) => (
   <div>
      <div className="flex items-baseline justify-between gap-4">
         <Eyebrow>{label}</Eyebrow>
         <span className="font-mono text-xs text-body">{value}</span>
      </div>
      <div className="mt-2 h-[2px] w-full bg-line">
         <div
            className={`h-full ${fill} transition-all duration-700 ease-out`}
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
         localStorage.getItem("weatherDataExpiration"),
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
            }&units=metric&lang=id`,
         );

         setData(res.data);
         setError(null);
         localStorage.setItem("weatherData", JSON.stringify(res.data));
         localStorage.setItem(
            "weatherDataExpiration",
            String(new Date().getTime() + 1700000),
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
            }&lat=${lat}&long=${lon}`,
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
            setError(
               "Gagal mendapatkan lokasi. Aktifkan izin lokasi pada browser.",
            );
            setLoadingLocation(false);
         },
         { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 },
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
            label: "Dirasakan",
            value: formatValue(formatFixed(data?.main?.feels_like, 1)),
            hint: "Suhu yang terasa di tubuh",
         },
         {
            label: "Kelembapan",
            value: formatValue(
               data?.main?.humidity !== undefined
                  ? `${data.main.humidity}%`
                  : null,
            ),
            hint: "Kondisi udara saat ini",
         },
         {
            label: "Angin",
            value: formatValue(
               data?.wind?.speed !== undefined
                  ? `${formatFixed(data.wind.speed, 1)} m/s`
                  : null,
            ),
            hint: "Kecepatan angin permukaan",
         },
         {
            label: "Tekanan",
            value: formatValue(
               data?.main?.pressure !== undefined
                  ? `${data.main.pressure} hPa`
                  : null,
            ),
            hint: "Tekanan atmosfer",
         },
      ],
      [data],
   );

   const astroSummary = useMemo(
      () => [
         { label: "Sunrise", value: formatValue(astro?.sunrise) },
         { label: "Sunset", value: formatValue(astro?.sunset) },
         { label: "Solar noon", value: formatValue(astro?.solar_noon) },
         { label: "Moonrise", value: formatValue(astro?.moonrise) },
         { label: "Moonset", value: formatValue(astro?.moonset) },
         { label: "Durasi siang", value: formatValue(astro?.day_length) },
         {
            label: "Fase bulan",
            value: formatValue(astro?.moon_phase),
         },
      ],
      [astro],
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
                 ((Math.log10(Math.max(value, 1)) - minLog) /
                    (maxLog - minLog)) *
                    100,
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

      const mapAltitude = (value) =>
         Math.round(((Number(value) + 90) / 180) * 100);

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

      return Math.max(
         0,
         Math.min(100, Number(astro.moon_illumination_percentage)),
      );
   }, [astro]);

   const busy = loadingLocation || loadingWeather || loadingAstro;

   return (
      <motion.section
         className="w-full overflow-hidden rounded-[12px] border border-line p-4 text-sm text-body md:p-5"
         variants={containerVariants}
         initial="hidden"
         animate="show"
      >
         <motion.header
            variants={itemVariants}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
         >
            <div className="max-w-xl">
               <Eyebrow>Geolocation Dashboard</Eyebrow>
               <h2 className="mt-4 text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink md:text-4xl">
                  Informasi lokasi, cuaca, dan astronomi
               </h2>
               <p className="mt-4 text-sm leading-relaxed text-muted">
                  Data ini dibaca langsung dari lokasi perangkat untuk memberi
                  konteks yang lebih jelas tentang kondisi sekitar.
               </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
               <Badge tone={error ? "bad" : busy ? "wait" : "ok"}>
                  {error ? "Perlu perhatian" : busy ? "Memuat data" : "Aktif"}
               </Badge>
               <Badge tone="mute">
                  {hasCoordinates ? "Lokasi tersedia" : "Menunggu izin"}
               </Badge>
            </div>
         </motion.header>

         {error ? (
            <motion.div
               variants={itemVariants}
               className="mt-6 rounded-[8px] border border-red-bg bg-red-bg px-4 py-3 text-xs text-red-fg"
            >
               {error}
            </motion.div>
         ) : null}

         <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <motion.div variants={itemVariants} className={cardClassName}>
               <SectionHead
                  index="01"
                  title="Cuaca sekarang"
                  meta={
                     data?.dt
                        ? new Date(data.dt * 1000).toLocaleTimeString("id-ID", {
                             hour: "2-digit",
                             minute: "2-digit",
                          })
                        : "belum ada pembaruan"
                  }
               />

               <div className="flex items-start gap-6">
                  {loadingWeather || !data ? (
                     <div className="h-16 w-16 shrink-0 animate-pulse bg-sunk" />
                  ) : (
                     <img
                        src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@4x.png`}
                        alt={data?.weather?.[0]?.description ?? "ikon cuaca"}
                        className="h-16 w-16 shrink-0 object-contain"
                     />
                  )}

                  <div className="min-w-0">
                     <p className="font-mono text-5xl leading-none tracking-[-0.03em] text-ink md:text-6xl">
                        {loadingWeather && !data
                           ? "--"
                           : formatValue(formatFixed(data?.main?.temp, 1))}
                        {loadingWeather && !data ? "" : "°C"}
                     </p>
                     <p className="mt-4 text-base capitalize text-body">
                        {formatValue(
                           data?.weather?.[0]?.description ??
                              "Menunggu data cuaca",
                        )}
                     </p>
                     <p className="mt-1 font-mono text-xs text-muted">
                        {formatValue(data?.name)}
                        {data?.sys?.country ? `, ${data.sys.country}` : ""}
                     </p>
                  </div>
               </div>

               <div className="mt-8">
                  {weatherStats.map((item) => (
                     <Row
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        hint={item.hint}
                     />
                  ))}
               </div>

               <div className="mt-8 border-t border-line pt-6">
                  <Eyebrow>Referensi</Eyebrow>
                  <div className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                     <Row
                        label="Koordinat"
                        value={
                           hasCoordinates
                              ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
                              : "belum tersedia"
                        }
                     />
                     <Row
                        label="Lokasi"
                        value={formatValue(data?.name ?? "Perangkat aktif")}
                     />
                     <Row
                        label="Zona waktu"
                        value={formatValue(
                           astro?.date ?? "mengikuti perangkat",
                        )}
                     />
                     <Row
                        label="Jarak pandang"
                        value={
                           data?.visibility !== undefined
                              ? `${data.visibility} m`
                              : "—"
                        }
                     />
                  </div>
               </div>
            </motion.div>

            <div className="flex flex-col gap-6">
               <motion.div variants={itemVariants} className={cardClassName}>
                  <SectionHead index="02" title="Status perangkat" />

                  <Row
                     label="Izin lokasi"
                     mono={false}
                     value={
                        loadingLocation
                           ? "Meminta akses"
                           : error
                             ? "Tidak berhasil"
                             : "Berhasil dibaca"
                     }
                     hint={
                        error
                           ? "Aktifkan izin lokasi agar dashboard bisa menampilkan data sekitar dengan akurat."
                           : "Koordinat dipakai untuk mengambil cuaca dan data astronomi secara otomatis."
                     }
                  />

                  <div className="mt-6 space-y-2">
                     <Row
                        label="Latitude"
                        value={lat !== null ? formatFixed(lat, 4) : "—"}
                     />
                     <Row
                        label="Longitude"
                        value={lon !== null ? formatFixed(lon, 4) : "—"}
                     />
                     <Row
                        label="Cuaca"
                        value={
                           loadingWeather && !data
                              ? "Memuat"
                              : formatValue(
                                   data?.weather?.[0]?.main ?? "Tidak tersedia",
                                )
                        }
                     />
                     <Row
                        label="Astronomi"
                        value={loadingAstro && !astro ? "Memuat" : "Aktif"}
                     />
                  </div>
               </motion.div>

               <motion.div variants={itemVariants} className={cardClassName}>
                  <SectionHead index="03" title="Astronomi utama" />

                  <div>
                     {astroSummary.map((item) => (
                        <Row
                           key={item.label}
                           label={item.label}
                           value={item.value}
                        />
                     ))}
                  </div>

                  <div className="mt-6 border-t border-line pt-6">
                     <Meter
                        label="Cahaya bulan"
                        value={
                           moonIllumination !== null
                              ? `${moonIllumination}%`
                              : "—"
                        }
                        percent={moonIllumination ?? 0}
                        fill="bg-blue-fg"
                     />
                     <p className="mt-3 text-xs leading-relaxed text-muted">
                        Semakin tinggi nilainya, semakin terang bulan tampak.
                     </p>
                  </div>
               </motion.div>
            </div>
         </div>

         <motion.div
            variants={itemVariants}
            className={`mt-6 ${cardClassName}`}
         >
            <SectionHead
               index="04"
               title="Jarak dan posisi"
               meta="skala relatif"
            />

            <div className="grid gap-10 md:grid-cols-3">
               <div>
                  <Eyebrow>Jarak</Eyebrow>
                  <p className="mt-2 font-mono text-xs text-muted">
                     {astro?.sun_distance != null
                        ? `${Number(
                             astro.sun_distance / 1000000,
                          ).toLocaleString("id-ID", {
                             maximumFractionDigits: 0,
                          })} juta km dari Matahari`
                        : "—"}
                  </p>
                  <div className="mt-6 space-y-5">
                     <Meter
                        label="Matahari"
                        value={distanceBars ? `${distanceBars.sun}%` : "—"}
                        percent={distanceBars?.sun ?? 0}
                        fill="bg-yellow-fg"
                     />
                     <Meter
                        label="Bulan"
                        value={distanceBars ? `${distanceBars.moon}%` : "—"}
                        percent={distanceBars?.moon ?? 0}
                        fill="bg-blue-fg"
                     />
                  </div>
                  <p className="mt-6 text-xs leading-relaxed text-muted">
                     Skala logaritmik dipakai agar perbedaan jarak yang sangat
                     jauh tetap mudah dibaca.
                  </p>
               </div>

               <div>
                  <Eyebrow>Altitude</Eyebrow>
                  <p className="mt-2 font-mono text-xs text-muted">
                     {formatFixed(astro?.sun_altitude, 2)}° matahari /{" "}
                     {formatFixed(astro?.moon_altitude, 2)}° bulan
                  </p>
                  <div className="mt-6 space-y-5">
                     <Meter
                        label="Matahari"
                        value={altitudeBars ? `${altitudeBars.sun}%` : "—"}
                        percent={altitudeBars?.sun ?? 0}
                        fill="bg-yellow-fg"
                     />
                     <Meter
                        label="Bulan"
                        value={altitudeBars ? `${altitudeBars.moon}%` : "—"}
                        percent={altitudeBars?.moon ?? 0}
                        fill="bg-blue-fg"
                     />
                  </div>
               </div>

               <div>
                  <Eyebrow>Azimuth</Eyebrow>
                  <p className="mt-2 font-mono text-xs text-muted">
                     {formatFixed(astro?.sun_azimuth, 2)}° matahari /{" "}
                     {formatFixed(astro?.moon_azimuth, 2)}° bulan
                  </p>
                  <div className="mt-6 space-y-5">
                     <Meter
                        label="Matahari"
                        value={azimuthBars ? `${azimuthBars.sun}%` : "—"}
                        percent={azimuthBars?.sun ?? 0}
                        fill="bg-yellow-fg"
                     />
                     <Meter
                        label="Bulan"
                        value={azimuthBars ? `${azimuthBars.moon}%` : "—"}
                        percent={azimuthBars?.moon ?? 0}
                        fill="bg-blue-fg"
                     />
                  </div>
               </div>
            </div>

            <div className="mt-10 border-t border-line pt-6">
               <Eyebrow>Detail tambahan</Eyebrow>
               <div className="mt-4 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-4">
                  <Row label="Tanggal" value={astro?.date ?? "—"} />
                  <Row label="Waktu lokal" value={astro?.current_time ?? "—"} />
                  <Row
                     label="Jarak bulan"
                     value={formatKm(astro?.moon_distance, 0)}
                  />
                  <Row
                     label="Terakhir update"
                     value={
                        data?.dt
                           ? new Date(data.dt * 1000).toLocaleTimeString(
                                "id-ID",
                                {
                                   hour: "2-digit",
                                   minute: "2-digit",
                                },
                             )
                           : "—"
                     }
                  />
               </div>
            </div>
         </motion.div>
      </motion.section>
   );
};

export default GeolocationInformation;
