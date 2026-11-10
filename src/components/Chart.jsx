import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ dataProps }) => {
  if (!Array.isArray(dataProps) || dataProps.length === 0) {
    return <p>Loading data chart...</p>;
  }

  const reversedData = [...dataProps].reverse();
  const labels = reversedData.map((item) => `${item.Jam}`);
  const magnitudes = reversedData.map((item) => parseFloat(item?.Magnitude));

  const data = {
    labels,
    datasets: [
      {
        label: "Magnitude Gempa",
        data: magnitudes,
        borderColor: "#7c3aed",
        backgroundColor: "rgba(124, 58, 237, 0.15)",
        pointBackgroundColor: "#7c3aed",
        fill: true,
        tension: 0.2,
      },
    ],
  };

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
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const item = reversedData[index];
            return `Magnitude: ${item.Magnitude} | Kedalaman : ${item.Kedalaman} | ${item.Tanggal}-  ${item.Jam}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#8f8c85",
        },
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Waktu Kejadian (WIB)",
          color: "#8f8c85",
        },
      },
      y: {
        ticks: {
          color: "#8f8c85",
        },
        grid: {
          color: "rgba(120, 119, 116, 0.15)",
        },
        title: {
          display: true,
          text: "Magnitude",
          color: "#8f8c85",
        },
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="w-full min-h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;
