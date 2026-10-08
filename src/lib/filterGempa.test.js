import assert from "node:assert/strict";
import { filterGempa } from "./filterGempa.js";

const rows = [
  {
    Wilayah: "9 km Tenggara LOMBOKBARAT-NTB",
    Magnitude: "5.2",
    Kedalaman: "92 km",
    DateTime: "2026-10-06T20:15:26+00:00",
  },
  {
    Wilayah: "Pusat gempa berada di laut 39 km Utara Mbay-Nagekeo",
    Dirasakan: "II Kab. Ende",
    Magnitude: "4.2",
    Kedalaman: "10 km",
    DateTime: "2026-10-07T12:03:42+00:00",
  },
  {
    Wilayah: "BARAT DAYA SERAM",
    Magnitude: "6.1",
    Kedalaman: "320 km",
    DateTime: "2026-10-05T00:00:00+00:00",
  },
];

const apply = (query) => filterGempa(rows, new URLSearchParams(query));

assert.equal(apply("").length, 3, "tanpa filter = semua data");
assert.equal(apply("q=lombok").length, 1, "cari wilayah");
assert.equal(apply("q=ende").length, 1, "cari dari kolom Dirasakan");
assert.equal(apply("mg=5").length, 2, "min magnitude");
assert.equal(apply("mg=7").length, 0, "min magnitude tanpa hasil");
assert.equal(apply("kedalaman=dangkal").length, 1, "kedalaman dangkal");
assert.equal(apply("kedalaman=dalam").length, 1, "kedalaman dalam");
assert.equal(apply("dari=2026-10-06").length, 2, "filter tanggal");
assert.equal(apply("mg=5&kedalaman=dalam").length, 1, "kombinasi filter");
assert.equal(filterGempa(null, new URLSearchParams()).length, 0, "data kosong");

console.log("filterGempa: OK");
