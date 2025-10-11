import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import "./Table.css";
import { Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Filters from "./Filters.jsx";
import { Button, Drawer } from "@mui/material";
import Navbar from "./Navbar.jsx";
import Tablenav from "./Tablenav.jsx";
import Footer from "./Footer.jsx";

// Custom loading overlay with blur background
function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <CircularProgress />
      </Box>
    </GridOverlay>
  );
}

export default function Table() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

  // Filter change handler for Filters component
  const handleFilterChange = useCallback((newRows) => {
    setFilteredRows(newRows);
  }, []);
  const batchFetchFundData = async (keysMap, nvdt) => {
   
    const entries = Object.entries(keysMap);
    
    const promises = entries.map(async ([key, mfObj]) => {
      const [mfName, score] = Object.entries(mfObj)[0];
      
      const per = Object.entries(mfObj)[1]?.[1] || "N/A";
    
      const assetClass = Object.entries(mfObj)[2]?.[1] || "N/A";
      const cat = Object.entries(mfObj)[3]?.[1] || "NA";
      const aum = Object.entries(mfObj)[4]?.[1] || "NA";
      const ter = Object.entries(mfObj)[5]?.[1] || "NA";
      const nav = nvdt[key];

      return {
        id: key,
        mfName,
        score: parseFloat(score.toFixed(2)),
        per: (per != null && !isNaN(per)) ? parseFloat(Number(per).toFixed(2)) : 0,

        assetClass,
        cat,
        aum,
        ter,
        nav,
      };
    });
    const allData = await Promise.all(promises);
    return allData.filter((d) => d !== null);
  };

  const columns = [
    {
      field: "mfName",
      headerName: "Mutual Fund Name",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => <strong>{params.value}</strong>,
    },
    { field: "score", headerName: "Score", flex: 0.5, minWidth: 80 },
    { field: "cat", headerName: "Category", flex: 0.75, minWidth: 120 },
    { field: "assetClass", headerName: "Asset Class", flex: 0.5, minWidth: 100 },
    { field: "nav", headerName: "NAV", flex: 0.4, minWidth: 80 },
    { field: "aum", headerName: "AUM (Cr.)", flex: 0.5, minWidth: 100 },
    { field: "ter", headerName: "Expense Ratio", flex: 0.6, minWidth: 120 },
    { field: "per", headerName: "% Equity", flex: 0.5, minWidth: 100 },
  ];

  const handleRowClick = (id) => {
    navigate("/MFinfo", { state: { id } });
  };

  // Fetch and process data, set initial states
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/Final_Table.json");
        const data = await res.json();
        //https://screener-back.vercel.app
        const response = await fetch(`https://screener-back.vercel.app/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const navs = await response.json();
        // process fetched data here (batchFetchFundData should be your data processing function)
        const formatted = await batchFetchFundData(data, navs); // Implement this function accordingly
        setRows(formatted);
        setFilteredRows(formatted);
      } catch (err) {
        console.error("Initial data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Drawer open/close toggles for mobile filters
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box position="sticky" top={64} height="fit-content" px={2} width={isMobile ? 280 : 320}>
      <Filters rows={rows} onFilterChange={handleFilterChange} />
    </Box>
  );

  return (
    <>
      {/* Navbar placeholder */}
      <Tablenav/>
      {/* <Box className="navbar" position="sticky" top={0} zIndex={1100} backgroundColor="rgba(255,255,255,0.9)" boxShadow="sm" px={2} py={1}>
        <Flex align="center">
          <Image src="sgc.png" alt="SGC" h="50px" rounded="md" />
          <Typography variant="h6" ml={2} fontWeight="bold" fontFamily="Montserrat" color="#6e27ff">
            ScreenerApp
          </Typography>
        </Flex>
      </Box> */}

      <Box className="tableOuter" style={{ marginBottom: "5%", marginTop: isMobile ? "15%" : "1%", overflowX: isMobile ? "auto" : "visible" }}>
        <Flex>
          {/* Filters sidebar for desktop */}
          <Box flex={1} position="sticky" top={64} height="fit-content" maxWidth={isMobile ? "0" : "20%"} visibility={isMobile ? "hidden" : "visible"}>
            <Filters rows={rows} onFilterChange={handleFilterChange} />
          </Box>

          {/* DataGrid and Title */}
          <Box
            flex={4}
            sx={{ height: 900, p: 2, overflowX: isMobile ? "auto" : "visible", backgroundColor: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(16px)", borderRadius: "18px", boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)" }}
            className="tablebox"
          >
            <Typography variant="h5" gutterBottom sx={{ fontSize: isMobile ? "1rem" : "1.25rem", mb: 3, fontFamily: "Montserrat", color: "#4a4a7b" }}>
              Mutual Fund Scores
            </Typography>
            <DataGrid
  rows={filteredRows}
  columns={columns}
  pageSize={10}
  getRowId={(row) => row.id}
  onRowClick={(params) => handleRowClick(params.id)}
  rowHeight={36}
  columnBuffer={2}
  loading={loading}
  sx={{
    border: "none",
    fontFamily: "Montserrat",
    backgroundColor: "#fff", // use solid or transparent, avoid blur
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#6e27ff18",
      fontWeight: "bold",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#eb03ff10",
      cursor: "pointer",
    },
  }}
/>
          </Box>
        </Flex>
      </Box>

      {/* Mobile filter button and drawer */}
      <Box visibility={isMobile ? "visible" : "hidden"} position="fixed" bottom={0} left={0} right={0} zIndex={1500} boxShadow="md" display="flex" justifyContent="center" p={1} backgroundColor="white">
        {isMobile && (
          <>
            <Button variant="contained" onClick={toggleDrawer(true)} sx={{ width: "100%", bgcolor: "#6e27ff", color: "white", fontWeight: "bold" }}>
              Apply Filters
            </Button>
            <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </>
        )}
      </Box>
      <Footer/>
    </>
  );
}
