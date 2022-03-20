import React from "react";

// libs
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from "chart.js";
import {Bar} from "react-chartjs-2";

// components
import {mockStates} from "../../../mock/yearStat";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const data = {
  labels,
  datasets: [
    {
      label: "Free Accounts",
      data: mockStates.graphicOfFreeAccounts.map((i) => i.count),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Subscriptions",
      data: mockStates.graphicOfSubscriptions.map((i) => i.count),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const Chart = () => {
  return <Bar options={options} data={data} />;
};
