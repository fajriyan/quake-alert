import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "quake_alert_notifications";

const NotificationToggle = ({ latestEvent, minMagnitude = 5 }) => {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState("default");
  const [message, setMessage] = useState("");
  const lastEventIdRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      setEnabled(false);
      setPermission(Notification?.permission || "default");
      return;
    }

    try {
      const parsed = JSON.parse(saved);
      setEnabled(parsed.enabled && parsed.permission === "granted");
      setPermission(parsed.permission || Notification?.permission || "default");
    } catch (error) {
      setEnabled(false);
      setPermission(Notification?.permission || "default");
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (permission !== "granted") return;
    if (!latestEvent) return;

    const eventId =
      latestEvent?.DateTime ||
      `${latestEvent?.Tanggal}-${latestEvent?.Jam}-${latestEvent?.Magnitude}-${latestEvent?.Shakemap}`;

    if (eventId === lastEventIdRef.current) return;
    lastEventIdRef.current = eventId;

    const magnitude = parseFloat(latestEvent?.Magnitude || 0);
    if (Number.isNaN(magnitude) || magnitude < minMagnitude) return;

    new Notification(`Gempa Baru: M${latestEvent?.Magnitude}`, {
      body: `${latestEvent?.Wilayah} • ${latestEvent?.Tanggal} ${latestEvent?.Jam}`,
      icon: "/favicon.svg",
      tag: eventId,
      renotify: true,
    });
  }, [enabled, latestEvent, permission, minMagnitude]);

  const persistPermission = (permissionValue, enabledValue) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ permission: permissionValue, enabled: enabledValue }),
    );
  };

  const requestPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setMessage("Browser tidak mendukung notifikasi.");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        setEnabled(true);
        persistPermission(result, true);
        setMessage("Notifikasi gempa aktif.");
        return true;
      }

      setEnabled(false);
      persistPermission(result, false);

      if (result === "denied") {
        setMessage(
          "Notifikasi ditolak. Ubah pengaturan browser untuk mengaktifkannya kembali.",
        );
      } else {
        setMessage("Izin notifikasi belum disetujui.");
      }

      return false;
    } catch (error) {
      setMessage("Terjadi kesalahan pada permintaan notifikasi.");
      return false;
    }
  };

  const toggleNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setMessage("Browser tidak mendukung notifikasi.");
      return;
    }

    if (enabled) {
      setEnabled(false);
      persistPermission(permission, false);
      setMessage("Notifikasi gempa dimatikan.");
      return;
    }

    if (permission === "granted") {
      setEnabled(true);
      persistPermission(permission, true);
      setMessage("Notifikasi gempa aktif.");
      return;
    }

    await requestPermission();
  };

  return (
    <div className="rounded-lg border dark:border-gray-600 p-3 bg-white dark:bg-gray-800/70 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Notifikasi Gempa</p>
          <p className="text-xs text-slate-500 dark:text-slate-300">
            Dapatkan notifikasi ketika gempa baru terdeteksi dengan magnitude ≥{" "}
            {minMagnitude}.
          </p>
        </div>
        <button
          onClick={toggleNotifications}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            enabled ? "bg-green-600 text-white" : "bg-slate-200 text-slate-900"
          }`}
        >
          {enabled ? "Aktif" : "Aktifkan"}
        </button>
      </div>
      {message ? (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default NotificationToggle;
