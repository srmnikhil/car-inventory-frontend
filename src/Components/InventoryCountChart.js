import React, { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Button, Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { format } from "date-fns"; // Import date-fns format function

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const InventoryCountChart = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState("new");

  // Process data for chart
  const chartData = useMemo(() => {
    const categorizedData = {
      new: [],
      used: [],
      cpo: [],
    };

    const labels = [];

    // Iterate over the data
    data.forEach((item) => {
      const { timestamp, condition } = item;
      const date = new Date(timestamp); // Convert the timestamp to a Date object
      const formattedDate = format(date, "dd/MM/yyyy"); // Format the date as "DD/MM/YYYY"

      if (!labels.includes(formattedDate)) {
        labels.push(formattedDate); // Add unique formatted dates to labels
      }

      // Initialize all categories to 0 for each date
      Object.keys(categorizedData).forEach((key) => {
        const index = labels.indexOf(formattedDate);
        if (categorizedData[key][index] === undefined) {
          categorizedData[key][index] = 0;
        }
      });

      // Increment the count based on condition
      if (categorizedData[condition]) {
        const index = labels.indexOf(formattedDate);
        categorizedData[condition][index] = (categorizedData[condition][index] || 0) + 1;
      }
    });

    return { labels, datasets: categorizedData };
  }, [data]);

  const inventoryData = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Inventory Count (${activeFilter})`,
        data: chartData.datasets[activeFilter] || [],
        backgroundColor: "#FFA500",
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#e0e0e0",
        },
      },
    },
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
          Inventory Count:
        </Typography>
        {["new", "used", "cpo"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "contained" : "outlined"}
            color="warning"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </Box>
      <Bar data={inventoryData} options={options} style={{ backgroundColor: "white", borderRadius: "10px", padding: "2rem" }} />
    </Box>
  );
};

export default InventoryCountChart;
