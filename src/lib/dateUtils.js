import dayjs from "../lib/dayjsConfig";
import "dayjs/locale/id";

const monthMap = {
  Jan: "Jan",
  Januari: "Jan",
  januari: "Jan",

  Feb: "Feb",
  Februari: "Feb",
  februari: "Feb",

  Mar: "Mar",
  Maret: "Mar",
  maret: "Mar",

  Apr: "Apr",
  April: "Apr",
  april: "Apr",

  Mei: "May",
  mei: "May",

  Jun: "Jun",
  Juni: "Jun",
  juni: "Jun",

  Jul: "Jul",
  Juli: "Jul",
  juli: "Jul",

  Agu: "Aug",
  Ags: "Aug",
  Agustus: "Aug",
  agustus: "Aug",

  Sep: "Sep",
  September: "Sep",
  september: "Sep",

  Okt: "Oct",
  Oktober: "Oct",
  oktober: "Oct",

  Nov: "Nov",
  November: "Nov",
  november: "Nov",

  Des: "Dec",
  Desember: "Dec",
  desember: "Dec",
};

export function convertIndoMonthToEng(dateStr) {
  for (const [id, en] of Object.entries(monthMap)) {
    const regex = new RegExp(`\\b${id}\\b`, "gi");
    dateStr = dateStr.replace(regex, en);
  }
  return dateStr;
}

export function getRelativeTime(tanggal, jam) {
  if (!tanggal || !jam) return "Memuat...";

  const cleanJam = jam.replace("WIB", "").trim();
  let dateTimeStr = `${tanggal} ${cleanJam}`;
  dateTimeStr = convertIndoMonthToEng(dateTimeStr);
  dateTimeStr = dateTimeStr.replace(/\s+/g, " ").trim();

  let parsed = dayjs(dateTimeStr, "DD MMM YYYY HH:mm:ss", "en");
  if (!parsed.isValid()) {
    parsed = dayjs(dateTimeStr, "DD MMM YYYY HH:mm", "en");
  }

  if (!parsed.isValid()) return "Tanggal tidak valid";

  return parsed.tz("Asia/Jakarta").locale("id").fromNow();
}
