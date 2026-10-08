import { useSearchParams } from "react-router-dom";

const DEPTH_OPTIONS = [
   { value: "", label: "Semua Kedalaman" },
   { value: "dangkal", label: "Dangkal < 60 km" },
   { value: "menengah", label: "Menengah 60-300 km" },
   { value: "dalam", label: "Dalam > 300 km" },
];

const inputClass =
   "rounded-md border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-xs text-slate-700 dark:text-neutral-100";

const labelClass =
   "flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-neutral-200";

const FilterBar = ({ total = 0, shown = 0 }) => {
   const [params, setParams] = useSearchParams();

   const setParam = (key, value) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      setParams(next, { replace: true });
   };

   const q = params.get("q") || "";
   const mg = params.get("mg") || "";
   const depth = params.get("kedalaman") || "";
   const dari = params.get("dari") || "";
   const isActive = Boolean(q || mg || depth || dari);

   return (
      <div className="mt-4 flex flex-wrap items-end gap-3 rounded-md border border-slate-200 p-3 dark:border-gray-600">
         <label className={labelClass}>
            Cari Wilayah
            <input
               type="search"
               value={q}
               onChange={(event) => setParam("q", event.target.value)}
               placeholder="contoh: Lombok"
               className={`${inputClass} w-44`}
            />
         </label>

         <label className={labelClass}>
            Min Magnitudo <span className="font-normal">{mg || "0.0"}</span>
            <input
               type="range"
               min="0"
               max="8"
               step="0.5"
               value={mg || "0"}
               onChange={(event) => setParam("mg", event.target.value)}
               className="mt-2 accent-purple-900"
            />
         </label>

         <label className={labelClass}>
            Kedalaman
            <select
               value={depth}
               onChange={(event) => setParam("kedalaman", event.target.value)}
               className={inputClass}
            >
               {DEPTH_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                     {option.label}
                  </option>
               ))}
            </select>
         </label>

         <label className={labelClass}>
            Dari Tanggal
            <input
               type="date"
               value={dari}
               onChange={(event) => setParam("dari", event.target.value)}
               className={inputClass}
            />
         </label>

         <div className="ml-auto flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-neutral-400">
               Menampilkan {shown} dari {total} data
            </span>
            {isActive ? (
               <button
                  onClick={() => setParams(new URLSearchParams(), { replace: true })}
                  className="rounded-md border border-purple-900 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-purple-950 hover:text-white dark:text-gray-300"
               >
                  Reset
               </button>
            ) : null}
         </div>
      </div>
   );
};

export default FilterBar;
