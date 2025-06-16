import { useGMBKGTerkini } from "../features/fetch";
import { useState, useMemo } from "react";
import Calendar from "react-calendar";
import dayjs from "../lib/dayjsConfig";

import React from "react";

const formatDate = (date) => {
  // Format: DD-MM-YYYY
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const CalendarAlert = () => {
  const { data: gempaList } = useGMBKGTerkini();
  console.log(gempaList)
  const [selectedDate, setSelectedDate] = useState(null);

  const gempaByDate = useMemo(() => {
    const map = {};
    const monthMap = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    gempaList.forEach((g) => {
      const [day, monStr, year] = g.Tanggal.split("-");
      const month = monthMap[monStr];
      const formatted = `${day}-${month}-${year}`; // Jadi DD-MM-YYYY
      if (!map[formatted]) map[formatted] = [];
      map[formatted].push(g);
    });

    return map;
  }, [gempaList]);

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const key = formatDate(date); // Format DD-MM-YYYY
    const count = gempaByDate[key]?.length || 0;
    return count > 0 ? (
      <div className="text-xs text-red-500">{count} gempa</div>
    ) : null;
  };

  const handleClick = (date) => {
    const d = formatDate(date);
    setSelectedDate(d);
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <h2 className="text-xl font-bold mb-4">Kalender Gempa</h2>
      <Calendar
        onClickDay={handleClick}
        tileContent={tileContent}
        locale="id"
      />

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">
            Gempa pada {selectedDate}
          </h3>
          {gempaByDate[selectedDate]?.length ? (
            <ul className="space-y-2">
              {gempaByDate[selectedDate].map((g, idx) => (
                <li key={idx} className="bg-gray-100 p-2 rounded">
                  <strong>{g.Wilayah}</strong> - {g.Jam} - Magnitudo{" "}
                  {g.Magnitude}
                </li>
              ))}
            </ul>
          ) : (
            <p>Tidak ada data gempa pada hari ini.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarAlert;
