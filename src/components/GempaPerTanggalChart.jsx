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
          barThickness: 45,
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
          color: "#8f8c85",
          font: {
            family: "monospace",
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
          color: "#8f8c85",
        },
        grid: {
          color: "rgba(120, 119, 116, 0.15)",
        },
        title: {
          display: true,
          text: "Jumlah Gempa",
          color: "#8f8c85",
        },
      },
      x: {
        ticks: {
          color: "#8f8c85",
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Tanggal",
          color: "#8f8c85",
        },
      },
    },
  };

  return (
    <div className="w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
