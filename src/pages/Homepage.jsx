import { Link } from "react-router-dom";
import Magnitudo from "../components/Magnitudo";
import useGT, {
  useBMKGsummary,
  useGD,
  useGMBKGFeel,
  useGMBKGTerkini,
} from "../features/fetch";
import { motion } from "framer-motion";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Navbar from "../components/Navbar";
import textProcessing from "../lib/textProcessing";
import Chart from "../components/Chart";
import Maps from "../components/Maps";
import GeolocationInformation from "../components/GeolocationInformation";
import EarthquakeList from "../components/EarthquakeList";
import { getRelativeTime } from "../lib/dateUtils";

const Homepage = () => {
  const { data: GT, isLoading: loadGT } = useBMKGsummary();
  const { data: GD, isLoading: loadGD } = useGMBKGFeel();
  const { data: latestEQ, isLoading: loadingLatestEQ } = useGMBKGTerkini();

  const driverObj = driver({
    popoverClass: "driverjs-theme",
    showProgress: true,
    steps: [
      {
        element: "#time-is",
        popover: {
          title: "Jam Sekarang",
          description: "Waktu Setempat",
        },
      },
      {
        element: "#image-shakemap",
        popover: {
          title: "Gambar Shakemap",
          description: "Gambar Shakemap dari Lokasi Gempa",
        },
      },
      {
        element: "#highligt",
        popover: {
          title: "Highlight Gempa",
          description: "Berisi informasi data Gempa yang Terbaru",
        },
      },
      {
        element: "#table-feel",
        popover: {
          title: "Gempa Terbaru",
          description: "Data Gempa yang dirasakan ",
        },
      },
    ],
  });

  const Skeleton = ({ width }) => {
    try {
      if (loadGT || loadGD) {
        return (
          <div className="animate-pulse ">
            <div
              className={`mt-[5px] bg-violet-200 h-3 ${
                width ? String(width) : "w-20"
              }`}
            ></div>
          </div>
        );
      } else {
        null;
      }
    } catch (e) {
      console.log("Error in Skeleton" + e);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
      />

      <div className="selection:bg-violet-200 selection:text-black min-h-screen dark:bg-gradient-to-r from-gray-800 via-gray-900 to-black pb-10">
        <Navbar />
        <br />
        <div className="container mx-auto pt-5">
          <h1 className="hidden">Aplikasi Data Gempa Bumi BMKG | Gempa</h1>
          <div className="grid px-3 grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-3 ">
            {/* Start - Image Section  */}
            <div className="">
              <div className="p-1 rounded-lg border overflow-hidden flex justify-center bg-white">
                <a
                  href={"https://data.bmkg.go.id/DataMKG/TEWS/" + GT?.Shakemap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex-grow "
                >
                  {loadGT ? (
                    <div className="animate-pulse">
                      <div className="rounded-md bg-violet-200 h-[400px]"></div>
                    </div>
                  ) : (
                    <div className="">
                      <img
                        src={
                          "https://data.bmkg.go.id/DataMKG/TEWS/" + GT?.Shakemap
                        }
                        alt=""
                        width="100%"
                        height="100%"
                        className="object-contain h-[406px] group-hover:scale-105 transition-all duration-700"
                        id="image-shakemap"
                      />
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 scale-0 rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
                    🗺 Open Image in new Tab
                  </span>
                </a>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 50,
                }}
              >
                <div className="mt-2 flex gap-3">
                  <button
                    className=" bg-purple-900 w-full border border-purple-900 text-white  font-medium py-2 rounded-md hover:bg-violet-900 dark:bg-violet-800 dark:border-violet-800 dark:shadow-lg"
                    onClick={() => driverObj.drive()}
                  >
                    Mulai Website Tour
                  </button>
                  <Link
                    to={"/tentang"}
                    className="border border-slate-800 w-full text-slate-900 dark:text-neutral-100 font-medium py-2 rounded-md text-center hover:bg-violet-200 dark:bg-neutral-300/40 dark:shadow-lg dark:hover:bg-white dark:hover:text-slate-900"
                  >
                    Tentang Website
                  </Link>
                </div>
              </motion.div>
            </div>
            {/* End - Image Section  */}

            {/* Start - Information Section */}
            <div className="lg:col-span-3">
              <div
                className="rounded-lg border p-3 flex flex-wrap items-center gap-[6px] dark:text-neutral-100 dark:bg-gray-400/15 dark:backdrop-blur-md"
                id="highligt"
              >
                <div className="w-[32%] md:w-[16%] flex items-center flex-col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-calendar2-event"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />
                    <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">Tanggal</p>
                  <Skeleton />
                  <p className="text-xs">{GT?.Tanggal}</p>
                </div>
                <div className="w-[32%] md:w-[16%] flex items-center flex-col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">Waktu</p>
                  <Skeleton />
                  <p className="text-xs">{GT?.Jam}</p>
                </div>
                <div className="w-[32%] md:w-[16%] flex items-center flex-col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-calendar2-event"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">Magnitudo</p>
                  <div className="text-xs flex">
                    <Skeleton />
                    {GT?.Magnitude}{" "}
                    {loadGT ? null : (
                      <span className="animate-pulse">
                        <Magnitudo mgFill={GT?.Magnitude} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-[32%] md:w-[16%] flex items-center flex-col">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-calendar2-event"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847Z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">Koordinat</p>
                  <Skeleton />
                  <p className="text-xs">{GT?.Coordinates}</p>
                </div>
                <div className="w-[32%] md:w-[16%] flex items-center flex-col ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
                    <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">Lintang, Bujur</p>
                  <div className="text-xs">
                    <Skeleton />
                    {GT?.Lintang} {GT?.Bujur}
                  </div>
                </div>
                <div className="w-full my-2 md:hidden"></div>

                <div className="w-[32%] md:w-[16%] flex items-center flex-col ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    fill="currentColor"
                    className="bi bi-calendar2-event"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.5 0a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V7.5h-1.5a.5.5 0 0 0 0 1H15v2.75h-.5a.5.5 0 0 0 0 1h.5V15h-1.5a.5.5 0 0 0 0 1h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5h-2zM7 1.5l.364-.343a.5.5 0 0 0-.728 0l-.002.002-.006.007-.022.023-.08.088a28.458 28.458 0 0 0-1.274 1.517c-.769.983-1.714 2.325-2.385 3.727C2.368 7.564 2 8.682 2 9.733 2 12.614 4.212 15 7 15s5-2.386 5-5.267c0-1.05-.368-2.169-.867-3.212-.671-1.402-1.616-2.744-2.385-3.727a28.458 28.458 0 0 0-1.354-1.605l-.022-.023-.006-.007-.002-.001L7 1.5zm0 0-.364-.343L7 1.5zm-.016.766L7 2.247l.016.019c.24.274.572.667.944 1.144.611.781 1.32 1.776 1.901 2.827H4.14c.58-1.051 1.29-2.046 1.9-2.827.373-.477.706-.87.945-1.144zM3 9.733c0-.755.244-1.612.638-2.496h6.724c.395.884.638 1.741.638 2.496C11 12.117 9.182 14 7 14s-4-1.883-4-4.267z" />
                  </svg>
                  <p className="mt-2 text-sm font-semibold">Kedalaman</p>
                  <Skeleton />
                  <p className="text-xs">{GT?.Kedalaman}</p>
                </div>

                <div className="w-full my-2">
                  <hr />
                </div>

                <ul className="text-sm list-disc pl-5">
                  <div className="text-sm border border-slate-700 mb-4 rounded-full pl-1 pr-3 w-max flex gap-1 items-center">
                    <div
                      className={`w-4 h-4 rounded-full  ${
                        GT?.Magnitude <= 5 ? "bg-yellow-600" : "bg-red-700"
                      } animate-pulse`}
                    ></div>
                    Terjadi Gempa : {getRelativeTime(GT?.Tanggal, GT?.Jam)}
                  </div>
                  <li>
                    <span className="flex gap-1 capitalize">
                      Dirasakan : <Skeleton width={"w-40"} />
                      {GT?.Dirasakan}
                    </span>
                  </li>
                  <li>
                    <span className="flex gap-1 capitalize">
                      Wilayah : <Skeleton width={"w-72"} />
                      {textProcessing(GT?.Wilayah)}
                    </span>
                  </li>
                  <li>
                    <span className="flex gap-1 flex-grow capitalize">
                      Potensi : <Skeleton width={"w-64"} />
                      {GT?.Potensi}
                    </span>
                  </li>
                </ul>
              </div>

              <div
                className="mt-3 rounded-lg border p- overflow-x-scroll  dark:bg-gray-400/15 dark:backdrop-blur-md"
                id="table-feel"
              >
                <div className="border-b px-3 py-2 sticky top-0 dark:text-neutral-100">
                  <h2 className="font-semibold text-sm text-gray-900 dark:text-neutral-100">
                    #4 Data Gempa Terbaru Yang Dirasakan
                  </h2>
                </div>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="text-left sticky top-[37px] border-b text-slate-900 dark:text-neutral-100">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 font-medium">
                        Waktu Gempa
                      </th>
                      <th className="whitespace-nowrap px-3 py-2 font-medium">
                        Magnitudo
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium">
                        Litang | Bujur
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium">
                        Kedalaman
                      </th>
                      <th className="whitespace-nowrap px-4 py-2 font-medium">
                        Wilayah
                      </th>
                      <th className="whitespace-nowrap py-2 font-medium">
                        Koordinat
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loadGD ? (
                      <tr>
                        <td className="">
                          <Skeleton width={"w-40"} />
                        </td>
                        <td className="">
                          <Skeleton width={"w-16"} />
                        </td>
                        <td className="">
                          <Skeleton width={"w-32"} />
                        </td>
                        <td className="">
                          <Skeleton width={"w-24"} />
                        </td>
                        <td className="">
                          <Skeleton />
                        </td>
                        <td className="">
                          <Skeleton />
                        </td>
                      </tr>
                    ) : (
                      GD?.slice(0, 4).map((GDM) => (
                        <tr
                          className="group text-slate-700 dark:text-neutral-100"
                          key={GDM?.DateTime + GDM?.Bujur + GDM?.Lintang}
                        >
                          <td className="whitespace-nowrap ps-4 py-2  group-hover:bg-slate-50 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900 ">
                            <span>{GDM?.Tanggal}</span> - {GDM?.Jam}
                          </td>
                          <td className="whitespace-nowrap ps-4 py-2 font-medium flex group-hover:bg-slate-50 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900 ">
                            {GDM?.Magnitude}
                            <Magnitudo mgFill={GDM?.Magnitude} />
                          </td>
                          <td className="whitespace-nowrap ps-4 py-2  group-hover:bg-slate-50 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900 ">
                            {GDM?.Lintang} | {GDM?.Bujur}
                          </td>
                          <td className="whitespace-nowrap ps-4 py-2  flex group-hover:bg-slate-50 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900 ">
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
                          <td className="whitespace-nowrap ps-4 py-2  group-hover:bg-slate-50 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900  capitalize">
                            {textProcessing(GT?.Wilayah)}
                          </td>
                          <td className="whitespace-nowrap px-5 md:px-1 py-2  flex group-hover:bg-slate-50 dark:group-hover:bg-slate-200 dark:group-hover:text-slate-900  hover:underline  relative">
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
            </div>

            {/* End - Information Section  */}
          </div>
        </div>
        <div className="container mx-auto px-5 lg:px-0 mt-14 rounded-xl overflow-hidden relative z-0">
          <Maps data={GD} />
        </div>
        <div className="container mx-auto px-5 lg:px-0 flex flex-col lg:flex-row mt-20 gap-10">
          <div className="lg:w-[50%] border p-7 border-slate-200 rounded-lg dark:bg-gradient-to-r from-gray-800 via-gray-800 to-slate-800">
            <h2 className="mb-4 font-semibold text-lg text-slate-800 dark:text-white">
              Data Grafik Gempa yang Dirasakan
            </h2>
            <Chart dataProps={GD} />
          </div>
          <div className="lg:w-[50%] border p-7 border-slate-200 rounded-lg dark:bg-gradient-to-r from-gray-800 via-gray-800 to-slate-800">
            <h2 className="mb-4 font-semibold text-lg text-slate-800 dark:text-white">
              Data Grafik Gempa Terkini
            </h2>
            <Chart dataProps={latestEQ} />
          </div>
        </div>
        <div className="container mx-auto px-5 lg:px-0 mt-14 relative z-0">
          <GeolocationInformation />
        </div>
        <div className="container mx-auto px-5 lg:px-0 mt-20 gap-10">
          <h2 className="mb-5 text-xl font-semibold">
            Data Kejadian Bencana Global{" "}
          </h2>
          <EarthquakeList />
        </div>
      </div>
    </>
  );
};

export default Homepage;
