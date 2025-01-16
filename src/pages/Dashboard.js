import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../redux/slices/inventorySlice';
import Navbar from '../Components/Navbar';
import Inventory from '../Components/Inventory';
import InventoryCountChart from '../Components/InventoryCountChart';
import AverageMSRPChart from '../Components/AverageMSRPChart';
import HistoryLog from '../Components/HistoryLog';
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Sidebar from '@mui/material/Drawer';
import { FormControl, RadioGroup, FormControlLabel, Radio, MenuItem, Select } from '@mui/material';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.inventory);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('last_month');  // Default to "last_month"
    const uniqueMakes = [...new Set(data.map(item => item.brand))];  // Get unique makes

    // Fetch data when the component first loads or when selected filters change
    useEffect(() => {
        dispatch(fetchInventory({ make: selectedMake, duration: selectedDuration }));  // Dispatch with default filters on load
    }, [dispatch, selectedMake, selectedDuration]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Toggle Sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Handle Filter Change
    const handleMakeChange = (event) => {
        setSelectedMake(event.target.value);
    };

    const handleDurationChange = (event) => {
        setSelectedDuration(event.target.value);
    };

    return (
        <>
            <Navbar />
            <div style={{ backgroundColor: "#F5F5F5", padding: "1rem" }}>
                <Inventory data={data} />
                <InventoryCountChart data={data}/>
                <AverageMSRPChart data={data}/>
                <HistoryLog data={data}/>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={toggleSidebar}
                    startIcon={<FilterAltIcon style={{ color: '#FF9926' }} />}
                    style={{
                        backgroundColor: 'white',
                        color: '#000',
                        height: '2.5rem',
                        boxShadow: 'none', // Remove the box shadow from the filter button
                        position: 'absolute', 
                        top: '70px', // Adjust the top position if needed
                        right: '20px', // Align to the right
                        marginTop: '10px'
                    }}
                >
                    FILTER DATA BY
                </Button>

                <Sidebar
                    open={sidebarOpen}
                    onClose={toggleSidebar}
                    anchor="right"
                    style={{ width: '300px' }}
                >
                    <div style={{ padding: '20px', width: '250px' }}>
                        <h3>Filter Options</h3>

                        {/* Vehicle Make Filter */}
                        <FormControl fullWidth margin="normal">
                            <Select
                                value={selectedMake}
                                onChange={handleMakeChange}
                                displayEmpty
                                fullWidth
                            >
                                <MenuItem value="">Vehicle Make</MenuItem>
                                {uniqueMakes.map((make, index) => (
                                    <MenuItem key={index} value={make}>
                                        {make}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Duration Filter */}
                        <FormControl component="fieldset" margin="normal">
                            <RadioGroup
                                value={selectedDuration}
                                onChange={handleDurationChange}
                                row
                            >
                                <FormControlLabel value="last_month" control={<Radio />} label="Last Month" />
                                <FormControlLabel value="this_month" control={<Radio />} label="This Month" />
                                <FormControlLabel value="last_3_months" control={<Radio />} label="Last 3 Months" />
                                <FormControlLabel value="last_6_months" control={<Radio />} label="Last 6 Months" />
                                <FormControlLabel value="this_year" control={<Radio />} label="This Year" />
                                <FormControlLabel value="last_year" control={<Radio />} label="Last Year" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Sidebar>
            </div>
        </>
    );
};

export default Dashboard;