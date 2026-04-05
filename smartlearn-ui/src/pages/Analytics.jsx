import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ["DSA", "OS", "DBMS", "Java"],
  datasets: [
    {
      label: "Accuracy %",
      data: [80, 60, 50, 70],
      backgroundColor: ["#f97316", "#f59e0b", "#10b981", "#3b82f6"],
      borderRadius: 8,
      barPercentage: 0.6,
      categoryPercentage: 0.8,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Subject Accuracy" },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: { stepSize: 10 },
    },
  },
};

function Analytics() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <Bar data={data} options={options} />
    </div>
  );
}

export default Analytics;
