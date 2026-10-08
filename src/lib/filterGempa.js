import { getDepthCategory } from "./getDepthTag.js";

// params: URLSearchParams dengan key q, mg, kedalaman, dari
export const filterGempa = (rows, params) => {
  if (!Array.isArray(rows)) return [];

  const get = (key) => params?.get?.(key) || "";
  const q = get("q").trim().toLowerCase();
  const minMagnitude = parseFloat(get("mg"));
  const depth = get("kedalaman");
  const dari = get("dari");

  return rows.filter((row) => {
    if (q) {
      const text = `${row.Wilayah ?? ""} ${row.Dirasakan ?? ""}`.toLowerCase();
      if (!text.includes(q)) return false;
    }

    if (!Number.isNaN(minMagnitude) && parseFloat(row.Magnitude) < minMagnitude) {
      return false;
    }

    if (depth && getDepthCategory(row.Kedalaman) !== depth) return false;

    if (dari && String(row.DateTime ?? "").slice(0, 10) < dari) return false;

    return true;
  });
};
