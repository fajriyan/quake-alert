import { useState } from "react";

const checklist = [
  "Tetap tenang dan jangan panik",
  "Lindungi kepala (Drop, Cover, Hold On)",
  "Menjauh dari kaca dan lemari",
  "Matikan listrik jika aman",
  "Keluar ke area terbuka setelah gempa berhenti",
];

export default function EducationPage() {
  const [checked, setChecked] = useState([]);

  const toggle = (item) => {
    setChecked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 border border-slate-200 rounded-lg ">
      <h1 className="text-3xl font-bold mb-2 text-purple-900 dark:text-white">
        Edukasi & Keselamatan Gempa
      </h1>

      <p className="text-slate-600 mb-8 dark:text-slate-200">
        Section ini berisi panduan dasar yang perlu diketahui untuk mengurangi
        risiko saat terjadi gempa bumi.
      </p>

      {/* Sebelum Gempa */}
      <section className="mb-8 dark:text-slate-200">
        <h2 className="text-xl font-semibold mb-2">Sebelum Gempa</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Kenali jalur evakuasi di rumah dan tempat kerja</li>
          <li>Siapkan tas darurat (air, obat, senter)</li>
          <li>Amankan perabot berat ke dinding</li>
        </ul>
      </section>

      {/* Saat Gempa */}
      <section className="mb-8 dark:text-slate-200">
        <h2 className="text-xl font-semibold mb-2">Saat Gempa Terjadi</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Jangan berlari keluar saat guncangan masih terjadi</li>
          <li>Berlindung di bawah meja yang kokoh</li>
          <li>Jauhi jendela dan benda yang mudah jatuh</li>
        </ul>
      </section>

      {/* Setelah Gempa */}
      <section className="mb-8 dark:text-slate-200">
        <h2 className="text-xl font-semibold mb-2">Setelah Gempa</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Keluar ke area terbuka dengan hati-hati</li>
          <li>Periksa kondisi diri dan sekitar</li>
          <li>Waspadai gempa susulan</li>
        </ul>
      </section>

      {/* Checklist */}
      <section className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg dark:text-slate-200">
        <h2 className="text-xl font-semibold mb-4">Checklist Darurat</h2>

        <ul className="space-y-3">
          {checklist.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => toggle(item)}
            >
              <input
                type="checkbox"
                checked={checked.includes(item)}
                readOnly
              />
              <span
                className={
                  checked.includes(item) ? "line-through text-slate-400" : ""
                }
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-sm text-slate-500 dark:text-slate-200">
          Checklist ini bisa kamu gunakan sebagai pengingat cepat saat kondisi
          darurat.
        </p>
      </section>
    </div>
  );
}
