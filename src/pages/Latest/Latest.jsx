import { useState } from "react";
import { useGMBKGTerkini } from "../../features/fetch";
import dayjs from "../../lib/dayjsConfig";
import LatestView from "./LatestView";

const Latest = () => {
  const { data: GD, isLoading: loadGD } = useGMBKGTerkini();
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const exportToCSV = () => {
    if (!GD || GD.length === 0) return;

    const header = [
      "Tanggal",
      "Jam",
      "Lintang",
      "Bujur",
      "Magnitude",
      "Kedalaman",
      "Wilayah",
      "Potensi",
    ];
    const rows = GD.map((g) => [
      g.Tanggal,
      g.Jam,
      g.Lintang,
      g.Bujur,
      g.Magnitude,
      g.Kedalaman,
      g.Wilayah,
      g.Potensi,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.map((v) => `"${v}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `data-gempa-${dayjs().format("YYYY-MM-DD")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (!GD || GD.length === 0) return;

    const jsonContent =
      "data:application/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(GD, null, 2));

    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute(
      "download",
      `data-gempa-${dayjs().format("YYYY-MM-DD")}.json`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="">
      <LatestView
        GD={GD}
        exportToCSV={exportToCSV}
        exportToJSON={exportToJSON}
        isOpen={isOpen}
        loadGD={loadGD}
        setIsOpen={setIsOpen}
        setOpen={setOpen}
        open={open}
      />
    </div>
  );
};

export default Latest;
