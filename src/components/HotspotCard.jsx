import { getRelativeTime } from "../lib/dateUtils";
import { getSeverity } from "../lib/hotspotCluster";

const Stat = ({ label, value }) => (
   <div>
      <p className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-neutral-500">
         {label}
      </p>
      <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100">
         {value}
      </p>
   </div>
);

const HotspotCard = ({ cluster, rank }) => {
   const severity = getSeverity(cluster.avgMagnitude);
   const visibleWilayah = cluster.wilayah.slice(0, 3);
   const remaining = cluster.wilayah.length - visibleWilayah.length;

   return (
      <div
         className={`relative overflow-hidden rounded-lg border border-slate-300 dark:border-neutral-700 bg-red bg-white dark:bg-neutral-900 transition-all w-full `}
      >
         <div
            className={` ${severity.bar} w-2 h-2 rounded-full absolute right-1 top-1`}
         ></div>
         <div className="p-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6  items-center justify-center rounded-full bg-slate-100 dark:bg-neutral-800 text-[11px] font-bold text-slate-600 dark:text-neutral-300">
                     #{rank}
                  </span>
                  <span
                     className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${severity.badge}`}
                  >
                     {severity.label}
                  </span>
               </div>
               <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                  {cluster.count} kejadian
               </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
               <Stat
                  label="Magnitudo Maks"
                  value={cluster.maxMagnitude.toFixed(1)}
               />
               <Stat
                  label="Rata-rata"
                  value={cluster.avgMagnitude.toFixed(1)}
               />
               <Stat
                  label="Radius Sebaran"
                  value={`${cluster.radiusKm.toFixed(0)} km`}
               />
               <Stat
                  label="Kedalaman Terdalam"
                  value={`${cluster.deepest} km`}
               />
            </div>

            <div className="mt-4">
               <div className="flex justify-between text-[10px] text-slate-400 dark:text-neutral-500 mb-1">
                  <span>Skala Magnitudo</span>
                  <span>{cluster.avgMagnitude.toFixed(1)} / 10</span>
               </div>
               <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                     className={`h-full rounded-full ${severity.bar} transition-all`}
                     style={{
                        width: `${Math.min((cluster.avgMagnitude / 10) * 100, 100)}%`,
                     }}
                  />
               </div>
            </div>

            <div className="mt-4">
               <p className="text-[11px] text-slate-500 dark:text-neutral-400 mb-1.5">
                  Wilayah Terdampak
               </p>
               <div className="flex flex-wrap gap-1.5">
                  {visibleWilayah.map((w) => (
                     <span
                        key={w}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 capitalize"
                     >
                        {w.toLowerCase()}
                     </span>
                  ))}
                  {remaining > 0 && (
                     <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-neutral-800 text-slate-500 dark:text-neutral-400">
                        +{remaining} lainnya
                     </span>
                  )}
               </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-neutral-400">
               <span>
                  Terakhir:{" "}
                  {getRelativeTime(
                     cluster.latest?.Tanggal,
                     cluster.latest?.Jam,
                  )}
               </span>
               <span>
                  {cluster.centerLat.toFixed(2)}, {cluster.centerLon.toFixed(2)}
               </span>
            </div>
         </div>
      </div>
   );
};

export default HotspotCard;
