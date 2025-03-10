import Magnitudo from "../components/Magnitudo";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useGD, useGMBKGFeel } from "../features/fetch";
import textProcessing from "../lib/textProcessing";
import dayjs from "../lib/dayjsConfig";
import Chart from "../components/Chart";
import { useState } from "react";

const GempaDirasakan = () => {
  const { data: GD, isLoading: loadGD } = useGMBKGFeel();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ x: 70 }}
        animate={{ x: 0 }}
        transition={{ delay: 0 }}
        className="hidden-bars-y"
      >
        <div className="dark:bg-gradient-to-r min-h-screen from-gray-800 via-gray-900 to-black mb-16 duration-500">
          <Navbar />
          <div className="container mx-auto py-2 px-3 md:px-0">
            <h1 className="font-bold text-xl text-slate-700 dark:text-neutral-100">
              Data Gempa yang Dirasakan
            </h1>
            <p className=" md:w-[35%] text-sm text-slate-600 dark:text-neutral-200 leading-4 mt-1">
              Pada halaman ini ditampilkan data Gempa yang dirasakan oleh
              masyarakat berdasarkan data BMKG Terbaru.
            </p>

            <button onClick={() => setIsOpen(true)} className="mt-2 px-3 py-1.5 text-xs font-semibold bg-purple-900 hover:bg-purple-950 text-white rounded-md ">
              Buka Grafik
            </button>
            

            <div className="mt-5 overflow-x-scroll md:overflow-visible border border-slate-200 ">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:bg-gray-400/15 dark:backdrop-blur-md">
                <thead className="text-left sticky border-b text-gray-900 dark:text-neutral-100">
                  <tr>
                    <th className="px-4 py-2 font-medium w-[40px] border-r">
                      No
                    </th>
                    <th className="px-4 py-2 font-medium w-[230px] border-r">
                      Waktu Gempa
                    </th>
                    <th className="px-3 py-2 font-medium w-[95px] border-r">
                      Magnitudo
                    </th>
                    <th className="px-4 py-2 font-medium w-[150px] border-r">
                      Litang | Bujur
                    </th>
                    <th className="px-4 py-2 font-medium w-[100px] border-r">
                      Kedalaman
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium border-r">
                      Wilayah
                    </th>
                    <th className="whitespace-nowrap px-4 py-2 font-medium">
                      Koordinat
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800 dark:text-neutral-100">
                  {loadGD ? (
                    <tr>
                      <td className="">{/* <Skeleton width={"w-40"} /> */}</td>
                      <td className="">{/* <Skeleton width={"w-16"} /> */}</td>
                      <td className="">{/* <Skeleton width={"w-32"} /> */}</td>
                      <td className="">{/* <Skeleton width={"w-24"} /> */}</td>
                      <td className="">{/* <Skeleton /> */}</td>
                      <td className="">{/* <Skeleton /> */}</td>
                    </tr>
                  ) : (
                    GD?.map((GDM, index) => (
                      <tr
                        className="group h-[50px]"
                        key={GDM?.DateTime + GDM?.Bujur + GDM?.Lintang}
                      >
                        <td className="py-2 group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 border-r w-[40px] text-center">
                          {index + 1}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 border-r">
                          <p className="font-semibold">
                          <span>{GDM?.Tanggal}</span> - {GDM?.Jam}
                          </p>
                          <p className="text-xs">{dayjs(dayjs(GDM?.Tanggal, "DD MMM YYYY").format("YYYY-MM-DD")+"T"+ GDM?.Jam.replace("WIB", "").trim()).fromNow()}</p>
                        </td>
                        <td className="p-2 group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 border-r">
                          <div className="flex justify-center gap-1 items-center">
                          {GDM?.Magnitude}
                          <Magnitudo mgFill={GDM?.Magnitude} />
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 border-r">
                          {GDM?.Lintang} | {GDM?.Bujur}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 flex items-center justify-center h-[50px] group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 border-r">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="13"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrow-down me-1"
                            viewBox="0 0 16 16"
                          >
                            <path d="M.039 3.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 3.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 6.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0L.314 9.964a.5.5 0 0 1-.278-.65zm0 3a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65z" />
                          </svg>
                          {GDM?.Kedalaman}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2 group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 capitalize border-r">
                          {textProcessing(GDM?.Wilayah)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-2  group-hover:bg-slate-50 dark:group-hover:text-slate-900 dark:group-hover:bg-slate-200 hover:underline relative">
                          <a
                            href={
                              "https://www.google.com/maps/place/" +
                              GDM?.Coordinates
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex group/coordinate"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="16"
                              fill="currentColor"
                              className="bi bi-geo-alt me-1"
                              viewBox="0 0 16 16"
                            >
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                            <span className="absolute bottom-9 right-3 scale-y-0 rounded bg-gray-800 px-2 py-1 text-xs text-white md:group-hover/coordinate:scale-y-100 ease-in duration-200 ">
                              Open in Maps
                            </span>
                            {GDM?.Coordinates}
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-1 text-xs flex gap-1 dark:text-neutral-100">
              Keterangan :{" "}
              <span className="flex gap-1">
                <Magnitudo mgFill={5.0} /> Kurang Dari 5.0
              </span>
              |
              <span className="flex gap-1">
                <Magnitudo mgFill={5.1} /> Lebih dari 5.0
              </span>
            </div>
          </div>
        </div>

        {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[650px] animate-fade-in">
            <div className="flex justify-center h-[300px]">
                <Chart dataProps={GD}/>
              </div>

            {/* Tombol untuk menutup modal */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 px-3 py-1.5 text-xs font-semibold bg-purple-900 hover:bg-purple-950 text-white rounded-md "
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      </motion.div>
    </>
  );
};

export default GempaDirasakan;
