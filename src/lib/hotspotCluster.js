export function getSeverity(avgMagnitude) {
   if (avgMagnitude >= 6) {
      return {
         label: "Kritis",
         badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
         bar: "bg-red-600",
      };
   }
   if (avgMagnitude >= 5) {
      return {
         label: "Tinggi",
         badge: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
         bar: "bg-orange-600",
      };
   }
   if (avgMagnitude >= 4) {
      return {
         label: "Sedang",
         badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300",
         bar: "bg-yellow-600",
      };
   }
   return {
      label: "Rendah",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
      bar: "bg-emerald-600",
   };
}

const EARTH_RADIUS = 6371;

function toRad(deg) {
   return (deg * Math.PI) / 180;
}

function haversine(lat1, lon1, lat2, lon2) {
   const dLat = toRad(lat2 - lat1);
   const dLon = toRad(lon2 - lon1);

   const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

   return EARTH_RADIUS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function parseCoordinate(value) {
   return Number(
      String(value)
         .replace(" LU", "")
         .replace(" LS", "")
         .replace(" BT", "")
         .replace(" BB", ""),
   );
}

export function buildHotspots(data, radiusKm = 30) {
   if (!data) return [];

   const clusters = [];

   data.forEach((item) => {
      const lat = parseCoordinate(item.Lintang);
      const lon = parseCoordinate(item.Bujur);

      let cluster = clusters.find((c) => {
         return haversine(lat, lon, c.centerLat, c.centerLon) <= radiusKm;
      });

      if (!cluster) {
         cluster = {
            centerLat: lat,
            centerLon: lon,
            items: [],
         };

         clusters.push(cluster);
      }

      cluster.items.push(item);

      cluster.centerLat =
         cluster.items.reduce((s, i) => s + parseCoordinate(i.Lintang), 0) /
         cluster.items.length;

      cluster.centerLon =
         cluster.items.reduce((s, i) => s + parseCoordinate(i.Bujur), 0) /
         cluster.items.length;
   });

   return clusters
      .map((c) => {
         const wilayah = [...new Set(c.items.map((i) => i.Wilayah.trim()))];

         return {
            centerLat: c.centerLat,
            centerLon: c.centerLon,
            count: c.items.length,
            maxMagnitude: Math.max(...c.items.map((i) => Number(i.Magnitude))),
            avgMagnitude:
               c.items.reduce((s, i) => s + Number(i.Magnitude), 0) /
               c.items.length,
            // BARU: radius sebaran cluster (km), dari titik pusat ke titik terjauh
            radiusKm: Math.max(
               0,
               ...c.items.map((i) =>
                  haversine(
                     c.centerLat,
                     c.centerLon,
                     parseCoordinate(i.Lintang),
                     parseCoordinate(i.Bujur),
                  ),
               ),
            ),
            deepest: Math.max(
               ...c.items.map((i) =>
                  Number(String(i.Kedalaman).replace(" km", "")),
               ),
            ),
            latest: c.items[0],
            wilayah,
            items: c.items,
         };
      })
      .sort((a, b) => b.count - a.count);
}
