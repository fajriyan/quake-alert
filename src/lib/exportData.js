import dayjs from "./dayjsConfig";

const buildFileName = (format) =>
  `data-gempa-${dayjs().format("YYYY-MM-DD")}.${format}`;

const triggerDownload = (href, fileName) => {
  const link = document.createElement("a");
  link.setAttribute("href", href);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportRowsToCSV = (rows, header) => {
  if (!Array.isArray(rows) || rows.length === 0) return false;

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [header, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "")}"`).join(","))
      .join("\n");

  triggerDownload(encodeURI(csvContent), buildFileName("csv"));
  return true;
};

export const exportRowsToJSON = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return false;

  const jsonContent =
    "data:application/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(rows, null, 2));

  triggerDownload(jsonContent, buildFileName("json"));
  return true;
};
