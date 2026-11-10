import { motion } from "framer-motion";
import Chart from "./Chart";
import GempaPerTanggalChart from "./GempaPerTanggalChart";
import HotspotCard from "./HotspotCard";

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

const Eyebrow = ({ children, className = "" }) => (
   <p
      className={`font-mono text-[11px] uppercase tracking-[0.18em] text-muted ${className}`}
   >
      {children}
   </p>
);

const Badge = ({ tone = "mute", children }) => {
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

const RegionalSummary = ({ GD = [], hotspots = [] }) => {
   const totalEvents = hotspots.reduce((sum, h) => sum + h.count, 0);
   const strongest = hotspots.length
      ? Math.max(...hotspots.map((h) => h.maxMagnitude))
      : 0;
   const dayCount = new Set(GD.map((item) => item?.Tanggal)).size;

   return (
      <motion.section
         className="mt-6 w-full overflow-hidden rounded-[12px] border border-line p-4 text-sm text-body md:p-5"
         variants={containerVariants}
         initial="hidden"
         animate="show"
      >
         <motion.header
            variants={itemVariants}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
         >
            <div className="max-w-xl">
               <Eyebrow>Ringkasan wilayah</Eyebrow>
               <h2 className="mt-4 text-3xl font-medium leading-[1.1] tracking-[-0.03em] text-ink md:text-4xl">
                  Rangkuman Data Gempa berdasarkan Wilayah
               </h2>
               <p className="mt-4 text-sm leading-relaxed text-muted">
                  Gempa dikelompokkan berdasarkan kedekatan lokasi (radius 30
                  km). Setiap kartu merangkum jumlah kejadian, kekuatan,
                  sebaran, dan kedalaman agar pola aktivitas tiap wilayah lebih
                  mudah dibaca.
               </p>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
               <Badge tone="ok">{hotspots.length} cluster</Badge>
               <Badge tone="mute">{totalEvents} kejadian</Badge>
               {strongest > 0 ? (
                  <Badge tone={strongest >= 5 ? "bad" : "wait"}>
                     M {strongest.toFixed(1)} tertinggi
                  </Badge>
               ) : null}
            </div>
         </motion.header>

         {hotspots.length === 0 ? (
            <motion.p
               variants={itemVariants}
               className="mt-8 rounded-[8px] border border-line bg-sunk px-4 py-3 text-xs text-muted"
            >
               Belum ada cluster terdeteksi.
            </motion.p>
         ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
               {hotspots.map((spot, i) => (
                  <motion.div key={i} variants={itemVariants}>
                     <HotspotCard cluster={spot} rank={i + 1} />
                  </motion.div>
               ))}
            </div>
         )}

         <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <motion.div variants={itemVariants} className={cardClassName}>
               <SectionHead
                  index="01"
                  title="Jumlah gempa per tanggal"
                  meta={`${dayCount} hari · ${GD.length} kejadian`}
               />
               <GempaPerTanggalChart data={GD} />
            </motion.div>

            <motion.div variants={itemVariants} className={cardClassName}>
               <SectionHead
                  index="02"
                  title="Tren magnitudo"
                  meta="urut waktu kejadian"
               />
               <Chart dataProps={GD} />
            </motion.div>
         </div>
      </motion.section>
   );
};

export default RegionalSummary;
