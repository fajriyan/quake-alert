import { getRelativeTime } from "../lib/dateUtils";
import { getSeverity } from "../lib/hotspotCluster";

const Eyebrow = ({ children, className = "" }) => (
   <p
      className={`font-mono text-[10px] uppercase tracking-[0.16em] text-muted ${className}`}
   >
      {children}
   </p>
);

const Stat = ({ label, value, unit }) => (
   <div>
      <Eyebrow>{label}</Eyebrow>
      <p className="mt-1 font-mono text-sm tracking-tight text-ink">
         {value}
         {unit ? (
            <span className="ml-0.5 text-xs text-muted">{unit}</span>
         ) : null}
      </p>
   </div>
);

const HotspotCard = ({ cluster, rank }) => {
   const severity = getSeverity(cluster.avgMagnitude);
   const visibleWilayah = cluster.wilayah.slice(0, 3);
   const remaining = cluster.wilayah.length - visibleWilayah.length;
   const magnitudePercent = Math.min((cluster.avgMagnitude / 10) * 100, 100);

   return (
      <div className="flex h-full flex-col rounded-[10px] border border-line bg-surface p-5 transition-shadow duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
         <div className="flex items-start justify-between gap-3">
            <div>
               <Eyebrow>Cluster #{rank}</Eyebrow>
               <p className="mt-2 text-base font-medium tracking-[-0.01em] text-ink">
                  {cluster.count} kejadian
               </p>
            </div>
            <span
               className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] ${severity.badge}`}
            >
               {severity.label}
            </span>
         </div>

         <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
            <Stat
               label="Magnitudo maks"
               value={cluster.maxMagnitude.toFixed(1)}
            />
            <Stat label="Rata-rata" value={cluster.avgMagnitude.toFixed(1)} />
            <Stat
               label="Radius sebaran"
               value={cluster.radiusKm.toFixed(0)}
               unit="km"
            />
            <Stat
               label="Kedalaman"
               value={cluster.deepest}
               unit="km"
            />
         </div>

         <div className="mt-5">
            <div className="flex items-baseline justify-between gap-4">
               <Eyebrow>Intensitas rata-rata</Eyebrow>
               <span className="font-mono text-xs text-body">
                  {cluster.avgMagnitude.toFixed(1)} / 10
               </span>
            </div>
            <div className="mt-2 h-[2px] w-full bg-line">
               <div
                  className={`h-full ${severity.bar} transition-all duration-700 ease-out`}
                  style={{ width: `${magnitudePercent}%` }}
                  aria-hidden
               />
            </div>
         </div>

         <div className="mt-5">
            <Eyebrow>Wilayah terdampak</Eyebrow>
            <div className="mt-2 flex flex-wrap gap-1.5">
               {visibleWilayah.map((w) => (
                  <span
                     key={w}
                     className="rounded-full border border-line bg-sunk px-2 py-0.5 text-[10px] capitalize text-muted"
                  >
                     {w.toLowerCase()}
                  </span>
               ))}
               {remaining > 0 && (
                  <span className="rounded-full border border-line bg-sunk px-2 py-0.5 text-[10px] text-muted">
                     +{remaining} lainnya
                  </span>
               )}
            </div>
         </div>

         <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4 text-[11px] text-muted">
            <span>
               Terakhir{" "}
               {getRelativeTime(cluster.latest?.Tanggal, cluster.latest?.Jam)}
            </span>
            <span className="font-mono tracking-tight">
               {cluster.centerLat.toFixed(2)}, {cluster.centerLon.toFixed(2)}
            </span>
         </div>
      </div>
   );
};

export default HotspotCard;
