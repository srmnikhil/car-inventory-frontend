import React, { useState } from 'react';
import { Grid, Card, Typography, Button, MenuItem, Select, Divider, FormControl, RadioGroup, FormControlLabel, Radio, IconButton } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';

// Helper function to count entries based on condition
const countEntriesByCondition = (data, condition) => {
    return data.filter(item => item.condition.toLowerCase() === condition.toLowerCase()).length;
};

// Helper function to sum the prices based on condition
const sumPriceByCondition = (data, condition) => {
    return data
        .filter(item => item.condition.toLowerCase() === condition.toLowerCase())
        .reduce((sum, item) => sum + parseFloat(item.price), 0); // Parse price as float for summing
};

// Helper function to calculate the average price based on condition
const averagePriceByCondition = (data, condition) => {
    const count = countEntriesByCondition(data, condition);
    if (count === 0) return 0; // Avoid division by zero
    const totalPrice = sumPriceByCondition(data, condition);
    return totalPrice / count; // Average price
};

// Helper function to format numbers with commas and remove decimals
const formatNumber = (num) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
};

const Inventory = ({ data }) => {
    const [dealer, setDealer] = useState('Dealer1'); // Example dealer state

    // Count the number of 'new', 'used', and 'cpo' entries based on the 'condition' field
    const newCount = countEntriesByCondition(data, 'new');
    const usedCount = countEntriesByCondition(data, 'used');
    const cpoCount = countEntriesByCondition(data, 'cpo');

    // Sum the prices based on the 'condition' field
    const newPriceTotal = sumPriceByCondition(data, 'new');
    const usedPriceTotal = sumPriceByCondition(data, 'used');
    const cpoPriceTotal = sumPriceByCondition(data, 'cpo');

    // Calculate the average price based on the 'condition' field
    const newAvgPrice = averagePriceByCondition(data, 'new');
    const usedAvgPrice = averagePriceByCondition(data, 'used');

    const textColor = "#FF9926"; // The text color for "New", "Used", and "CPO" labels

    // Get the current date for "Recent gathered data"
    const currentDate = new Date().toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
    });

    // Handler for dealer selection change
    const handleDealerChange = (event) => {
        setDealer(event.target.value);
    };

    return (
        <div>
            {/* Inventory Header */}
            <Grid container justifyContent="space-between" >
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                    Inventory
                </Typography>
                <Grid item sx={{ marginRight: "11rem" }}>
                    <Grid container alignItems="center">
                        {/* Select Dealer Label */}
                        <Typography style={{ marginRight: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                            Select Dealer
                        </Typography>

                        <FormControl style={{ marginRight: '1rem', width: '10rem', backgroundColor: 'white' }}>
                            <Select
                                value={dealer}
                                onChange={handleDealerChange}
                                style={{ height: '2.5rem' }} // Make the height same as the button
                            >
                                <MenuItem value="Dealer1">Dealer 1</MenuItem>
                                <MenuItem value="Dealer2">Dealer 2</MenuItem>
                                <MenuItem value="Dealer3">Dealer 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>

            {/* Divider Line */}
            <Divider style={{ margin: '1rem 0' }} />

            {/* Recent Gathered Data */}
            <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                Recent gathered data as of {currentDate}
            </Typography>

            {/* Horizontal Scrollable Cards */}
            <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
                <Grid container spacing={2} direction="row" justifyContent="flex-start" wrap="nowrap">
                    {/* New Units Card */}
                    <Grid item style={{ marginLeft: '0.625rem' }}>
                        <Card style={{ padding: '1rem', width: '6rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>{formatNumber(newCount)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}># New Units</Typography>
                        </Card>
                    </Grid>

                    {/* New MSRP Card */}
                    <Grid item>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>${formatNumber(newPriceTotal)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}>New MSRP</Typography>
                        </Card>
                    </Grid>

                    {/* New Avg. MSRP Card */}
                    <Grid item>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>${formatNumber(newAvgPrice)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}>New avg. MSRP</Typography>
                        </Card>
                    </Grid>

                    {/* Used Units Card */}
                    <Grid item>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>{formatNumber(usedCount)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}># Used Units</Typography>
                        </Card>
                    </Grid>

                    {/* Used MSRP Card */}
                    <Grid item>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>${formatNumber(usedPriceTotal)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}>Used MSRP</Typography>
                        </Card>
                    </Grid>

                    {/* Used Avg. MSRP Card */}
                    <Grid item>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>${formatNumber(usedAvgPrice)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}>Used avg. MSRP</Typography>
                        </Card>
                    </Grid>

                    {/* CPO Units Card */}
                    <Grid item>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>{formatNumber(cpoCount)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}># CPO Units</Typography>
                        </Card>
                    </Grid>

                    {/* CPO MSRP Card */}
                    <Grid item style={{ marginRight: '0.625rem' }}>
                        <Card style={{ padding: '1rem', width: '7rem', height: '3rem' }}>
                            <Typography variant="h5" style={{ fontSize: '1rem' }}>${formatNumber(cpoPriceTotal)}</Typography>
                            <Typography variant="h6" style={{ color: textColor, fontSize: '0.875rem' }}>CPO MSRP</Typography>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Inventory;
