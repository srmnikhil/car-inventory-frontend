import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const HistoryLog = ({ data }) => {
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    // Get the date for 10 days ago
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    // Sort data based on timestamp in descending order
    const sortedData = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Filter data for the last 10 days
    const filteredData = sortedData.filter((log) => {
      const logDate = new Date(log.timestamp);
      return logDate >= tenDaysAgo; // Ensure it's within the last 10 days
    });

    // Process the data for cumulative calculations based on the entire data up to each date
    const processedLogs = filteredData.map((log, index) => {
      let newUnits = 0, newTotalPrice = 0, usedUnits = 0, usedTotalPrice = 0, cpoUnits = 0, cpoTotalPrice = 0;

      // Loop through all the data and calculate cumulative values for the given date
      data.forEach((entry) => {
        const entryDate = new Date(entry.timestamp);
        if (entryDate <= new Date(log.timestamp)) { // Check if the entry is before or on the current log's date
          if (entry.condition === 'new') {
            newUnits += 1;
            newTotalPrice += parseFloat(entry.price);
          } else if (entry.condition === 'used') {
            usedUnits += 1;
            usedTotalPrice += parseFloat(entry.price);
          } else if (entry.condition === 'cpo') {
            cpoUnits += 1;
            cpoTotalPrice += parseFloat(entry.price);
          }
        }
      });

      // Format date to 'Mar 10, 24'
      const formattedDate = new Date(log.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: '2-digit',
      });

      return {
        id: index, // Unique identifier for each entry
        date: formattedDate, // Show only the date in 'Mar 10, 24' format
        newUnits,
        newTotalPrice: Math.floor(newTotalPrice),  // Removing decimals
        newAvgMsrp: newUnits > 0 ? Math.floor(newTotalPrice / newUnits) : 0,  // Removing decimals
        usedUnits,
        usedTotalPrice: Math.floor(usedTotalPrice),  // Removing decimals
        usedAvgMsrp: usedUnits > 0 ? Math.floor(usedTotalPrice / usedUnits) : 0,  // Removing decimals
        cpoUnits,
        cpoTotalPrice: Math.floor(cpoTotalPrice),  // Removing decimals
        cpoAvgMsrp: cpoUnits > 0 ? Math.floor(cpoTotalPrice / cpoUnits) : 0,  // Removing decimals
      };
    });

    setHistoryLogs(processedLogs);
  }, [data]); // Recalculate when the data prop changes

  const columns = [
    { field: 'date', headerName: 'Date', width: 100 },
    { field: 'newUnits', headerName: 'New Inventory', width: 120 },
    { field: 'newTotalPrice', headerName: 'New Total MSRP', width: 130 },
    { field: 'newAvgMsrp', headerName: 'New Avg MSRP', width: 130 },
    { field: 'usedUnits', headerName: 'Used Inventory', width: 120 },
    { field: 'usedTotalPrice', headerName: 'Used Total MSRP', width: 130 },
    { field: 'usedAvgMsrp', headerName: 'Used Avg MSRP', width: 130 },
    { field: 'cpoUnits', headerName: 'CPO Inventory', width: 120 },
    { field: 'cpoTotalPrice', headerName: 'CPO Total MSRP', width: 130 },
    { field: 'cpoAvgMsrp', headerName: 'CPO Avg MSRP', width: 130 },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        History Log
      </Typography>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={historyLogs} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default HistoryLog;
