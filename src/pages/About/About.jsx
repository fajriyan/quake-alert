import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  dayjs.extend(relativeTime);
  dayjs.locale("id");

  const dates = [
    "2024-11-18T10:00:00Z", // Tanggal dalam format ISO
    "2024-11-15T12:30:00Z",
    "2024-11-01T08:00:00Z",
  ];
  return (
    <motion.div
      initial={{ x: 70 }}
      animate={{ x: 0 }}
      transition={{ delay: 0 }}
      className="hidden-bars-y"
    >
      <div className="dark:bg-gradient-to-r min-h-screen from-gray-800 via-gray-900 to-black">
        <div className="">
          <img
            src="https://c.tenor.com/mndwWfr3sAYAAAAC/tenor.gif"
            className="w-full h-[200px] md:h-[300px] object-cover"
            width={100}
            height={100}
            alt=""
          />
        </div>
        <div className="container mx-auto py-7">
          <div className="flex flex-col md:flex-row gap-5 md:gap-10 px-3 md:px-0">
            <div className="w-24 md:w-52">
              <img
                src="https://raw.githubusercontent.com/fajriyan/info-gempa/90f658ab8dcb69f7cc2ebd628ab8fb13d05b6a32/public/favicon.svg"
                alt="Logo Gempa"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <h1 className="text-2xl font-semibold flex gap-1 dark:text-neutral-100">
                Tentang Project Gempa{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-exclamation-circle-fill animate-pulse"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
              </h1>
              <p className="text-justify dark:text-neutral-200">
                Gempa adalah salah satu project sederhana milik saya yang
                bertujuan seperti namanya yakni menampilkan data Gempa terbaru
                dan data gempa terbaru dengan tampilan yang mudah dipahami dan
                interaktif. Data yang ditampilkan pada website ini merupakan
                milik BMKG (Badan Meteorologi, Klimatologi, dan Geofisika)
                Indonesia, data itu di fetch melalui project{" "}
                <a href="" className="underline">
                  Public API
                </a>{" "}
                yang telah dibuat sebelumnya. Semoga Bermanfaat.
              </p>
              <div className="flex gap-3 items-center">
                <Link
                  to="/"
                  className="border border-slate-800 text-slate-900 rounded-md hover:bg-violet-100 px-3 py-1 font-medium dark:bg-neutral-300/90 dark:shadow-lg dark:hover:bg-white dark:hover:text-slate-900"
                >
                  Kembali ke Beranda
                </Link>
                <a
                  href="https://saweria.co/fajriyan"
                  className="hover:text-violet-900 dark:text-neutral-200 dark:hover:text-neutral-200 dark:hover:underline"
                >
                  Dukung saya
                </a>
              </div>
            </div>
          </div>

          <div className="mt-7">
            <div className="space-y-4">
              <details className="group [&_summary::-webkit-details-marker]:hidden border border-violet-900/50 dark:border-neutral-400 rounded-xl overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-950 dark:bg-gray-300/80 dark:backdrop-blur-md">
                  <h2 className="font-medium">
                    Data Gempa yang digunakan berasal dari mana? Apakah valid?
                  </h2>

                  <svg
                    className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <p className="py-4 px-4 leading-relaxed text-gray-700 dark:text-neutral-300">
                  Dapat dipastikan Valid! Karena data yang digunakan pada
                  website ini adalah Real Time sepenuhnya berasal dari BMKG
                  (Badan Meteorologi, Klimatologi, dan Geofisika), berikut
                  adalah website{" "}
                  <a href="https://www.bmkg.go.id/" className="underline">
                    BMKG.GO.ID
                  </a>{" "}
                  untuk informasi lebih lengkap.
                </p>
              </details>
              <details className="group [&_summary::-webkit-details-marker]:hidden border border-violet-900/50 dark:border-neutral-400 rounded-xl overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-950 dark:bg-gray-300/80 dark:backdrop-blur-md">
                  <h2 className="font-medium">
                    Apakah saya bisa meminta fitur tambahan?
                  </h2>

                  <svg
                    className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <p className="py-4 px-4 leading-relaxed text-gray-700 dark:text-neutral-300">
                  Tentu saja boleh, kalian bisa melakukan Request untuk fitur
                  atau bug yang kalian temukan, silahkan lakukan{" "}
                  <a
                    href="https://github.com/fajriyan/info-gempa/issues/new"
                    className="underline"
                  >
                    report
                  </a>
                  .
                </p>
              </details>

              <details className="group [&_summary::-webkit-details-marker]:hidden border border-violet-900/50 dark:border-neutral-400 rounded-xl overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-950 dark:bg-gray-300/80 dark:backdrop-blur-md">
                  <h2 className="font-medium">
                    Bagaimana jika saya ingin membuat aplikasi serupa?
                  </h2>

                  <svg
                    className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <p className="py-4 px-4 leading-relaxed text-gray-700 dark:text-neutral-300">
                  Tentunya sangat diperbolehkan, saya akan segera merilis API
                  untuk mendapatkan data Gempa yang digunakan pada aplikasi ini,
                  nantikan untuk informasinya di situs ini.
                </p>
              </details>
            </div>
          </div>

          <div className="mt-7">
            <h2 className="font-semibold text-lg">Hubungi Kami</h2>
            <div className="mt-2 flex gap-2">
              <a
                className="px-1 py-0.5 hover:bg-slate-900 hover:text-white rounded-md border border-slate-800"
                href="https://github.com/fajriyan"
              >
                Github
              </a>
              <a
                className="px-1 py-0.5 hover:bg-slate-900 hover:text-white rounded-md border border-slate-800"
                href="https://www.linkedin.com/in/fajriyan/"
              >
                LinkedIn
              </a>
              <a
                className="px-1 py-0.5 hover:bg-slate-900 hover:text-white rounded-md border border-slate-800"
                href="https://www.instagram.com/fajriyan.nur/"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
