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

const AverageMsrpChart = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState("new");

  // Process data for chart
  const chartData = useMemo(() => {
    const categorizedData = {
      new: [],
      used: [],
      cpo: [],
    };

    const labels = [];
    const countData = {
      new: [],
      used: [],
      cpo: [],
    };

    // Iterate over the data
    data.forEach((item) => {
      const { timestamp, condition, price } = item;
      const date = timestamp.split(" ")[0]; // Extract the date from timestamp (YYYY-MM-DD)
      const formattedDate = format(date, "dd/MM/yyyy"); // Format the date as "DD/MM/YYYY"

      if (!labels.includes(formattedDate)) {
        labels.push(formattedDate); // Add unique dates to labels
      }

      // Initialize all categories to 0 for each date
      Object.keys(categorizedData).forEach((key) => {
        const index = labels.indexOf(formattedDate);
        if (categorizedData[key][index] === undefined) {
          categorizedData[key][index] = 0;
          countData[key][index] = 0;
        }
      });

      // Calculate total MSRP and count for averaging
      if (categorizedData[condition]) {
        const index = labels.indexOf(formattedDate);
        categorizedData[condition][index] += parseFloat(price); // Sum up MSRP
        countData[condition][index] += 1; // Increment count
      }
    });

    // Compute averages for each category
    Object.keys(categorizedData).forEach((key) => {
      categorizedData[key] = categorizedData[key].map(
        (total, idx) => (total / (countData[key][idx] || 1)).toFixed(2) // Avoid divide by zero
      );
    });

    return { labels, datasets: categorizedData };
  }, [data]);

  const msrpData = {
    labels: chartData.labels,
    datasets: [
      {
        label: `Average MSRP (${activeFilter})`,
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
        callbacks: {
          label: (context) => {
            let value = context.raw;
            if (value >= 1000) value = `$${(value / 1000).toFixed(1)}k`;
            else value = `$${value}`;
            return ` ${value}`;
          },
        },
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
        ticks: {
          callback: (value) => {
            if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
            return `$${value}`;
          },
        },
      },
    },
  };

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Box sx={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
          Average MSRP in USD:
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
      <Bar data={msrpData} options={options} style={{ backgroundColor: "white", borderRadius: "10px", padding: "2rem" }} />
    </Box>
  );
};

export default AverageMsrpChart;
