import React from 'react'
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useGD } from '../features/fetch';
import dayjs from 'dayjs';
// import dayjs from "../lib/dayjsConfig";



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = ({dataProps}) => {

   console.log(dataProps)
   const labels = dataProps?.map((item) => 
      dayjs(`${item.Tanggal} ${item.Jam.replace(" WIB", "")}`, "DD MMM YYYY HH:mm:ss").format("HH:mm")
    );
   const magnitudes = dataProps?.map((item) => parseFloat(item.Magnitude));

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
   <div className="w-full">
      <Line data={data} options={options} />
 </div>
  )
}

export default Chart