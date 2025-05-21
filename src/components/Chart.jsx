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
        borderColor: "rgb(10 28 135 / 1)",
        backgroundColor: "rgb(88 28 135 / 1)",
        tension: 0.2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
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
        title: {
          display: true,
          text: "Waktu Kejadian (WIB)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Magnitude",
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
