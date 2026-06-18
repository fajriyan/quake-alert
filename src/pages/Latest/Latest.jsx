import { useState } from "react";
import LatestView from "./LatestView";
import { useGMBKGTerkini } from "../../lib/api";
import AutoRefreshToggle from "../../components/AutoRefreshToggle";
import {
  exportRowsToCSV,
  exportRowsToJSON,
} from "../../lib/exportData";

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

const Latest = () => {
  const { data: GD, isLoading: loadGD, refetch: reGD } = useGMBKGTerkini();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <LatestView
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
            exportHeaders
          )
        }
        exportToJSON={() => exportRowsToJSON(GD)}
        isOpen={isOpen}
        loadGD={loadGD}
        setIsOpen={setIsOpen}
        setOpen={setOpen}
        open={open}
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

export default Latest;
