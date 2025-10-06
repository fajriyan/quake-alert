import { driver } from "driver.js";
import { useBMKGsummary, useGMBKGFeel } from "../../features/fetch";
import HomeView from "./HomeView";

const Home = () => {
  const { data: GT, isLoading: loadGT } = useBMKGsummary();
  const { data: GD, isLoading: loadGD } = useGMBKGFeel();

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

  return (
    <div className="">
      <HomeView
        GD={GD}
        GT={GT}
        driverObj={driverObj}
        loadGD={loadGD}
        loadGT={loadGT}
      />
    </div>
  );
};

export default Home;
