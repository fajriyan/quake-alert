// src/dayjsConfig.js
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import "dayjs/locale/id.js";

// Extend plugins
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

// Set locale and timezone
dayjs.locale("id");
dayjs.tz.setDefault("Asia/Jakarta");

export default dayjs;
