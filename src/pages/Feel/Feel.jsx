import { useState } from "react";
import FeelView from "./FeelView";
import { useGMBKGFeel } from "../../lib/api";
import AutoRefreshToggle from "../../components/AutoRefreshToggle";
import { exportRowsToCSV, exportRowsToJSON } from "../../lib/exportData";
import { buildHotspots } from "../../lib/hotspotCluster";

const exportHeaders = [
   "Tanggal",
   "Jam",
   "Lintang",
   "Bujur",
   "Magnitude",
   "Kedalaman",
   "Wilayah",
   "Potensi",
];

const Feel = () => {
   const { data: GD, isLoading: loadGD, refetch: reGD } = useGMBKGFeel();
   const [isOpen, setIsOpen] = useState(false);
   const [open, setOpen] = useState(false);

   const hotspots = buildHotspots(GD, 30);

   return (
      <div className="">
         <FeelView
            GD={GD}
            exportToCSV={() =>
               exportRowsToCSV(
                  GD?.map((g) => [
                     g.Tanggal,
                     g.Jam,
                     g.Lintang,
                     g.Bujur,
                     g.Magnitude,
                     g.Kedalaman,
                     g.Wilayah,
                     g.Potensi,
                  ]) || [],
                  exportHeaders,
               )
            }
            exportToJSON={() => exportRowsToJSON(GD)}
            isOpen={isOpen}
            loadGD={loadGD}
            open={open}
            setIsOpen={setIsOpen}
            setOpen={setOpen}
            hotspots={hotspots}
         />
         <AutoRefreshToggle
            interval={2000}
            onRefresh={async () => {
               await reGD();
            }}
         />
      </div>
   );
};

export default Feel;
