import { useMemo } from "react";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GempaPerTanggalChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data.length) return { labels: [], datasets: [] };

    const grouped = {};

    data.forEach((item) => {
      const tanggal = dayjs(item.DateTime).format("YYYY-MM-DD");

      if (!grouped[tanggal]) {
        grouped[tanggal] = 0;
      }

      grouped[tanggal]++;
    });

    const sortedDates = Object.keys(grouped).sort(
      (a, b) => new Date(a) - new Date(b),
    );

    return {
      labels: sortedDates.map((date) => dayjs(date).format("DD MMM YYYY")),
      datasets: [
        {
          label: "Jumlah Gempa",
          data: sortedDates.map((date) => grouped[date]),

          backgroundColor: "rgba(88, 28, 135, 0.8)", // #581c87 dengan opacity
          borderColor: "#581c87",
          hoverBackgroundColor: "rgba(88, 28, 135, 1)",

          borderWidth: 1,
          borderRadius: 6,
          barThickness: 80,
        },
      ],
    };
  }, [data]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#581c87",
          font: {
            weight: "600",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        title: {
          display: true,
          text: "Jumlah Gempa",
          color: "#581c87",
        },
      },
      x: {
        title: {
          display: true,
          text: "Tanggal",
          color: "#581c87",
        },
      },
    },
  };

  return (
    <div className="w-full dark:bg-white rounded-md border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4 ">
        Jumlah Gempa per Tanggal
      </h2>

      <Bar data={chartData} options={options} />
    </div>
  );
}
