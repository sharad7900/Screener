import { useEffect, useState, useCallback } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import "./Table.css";
import { Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Filters from "./Filters.jsx";
import { Button, Drawer } from "@mui/material";
import Tablenav from "./Tablenav.jsx";
import Footer from "./Footer.jsx";

// Custom loading overlay
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

  // Handle filters
  const handleFilterChange = useCallback((newRows) => {
    setFilteredRows(newRows);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your API endpoint that executes the SQL query
        const res = await fetch("https://screener-back.vercel.app");
        const data = await res.json();

        // Format rows
        const formatted = data.map((item, index) => ({
          id: item.ISIN || index,
          isin: item.ISIN,
          scheme: item.Scheme,
          category: item.Category,
          assetClass: item.Asset_Class,
          aum: parseFloat(item.AUM || 0).toFixed(2),
          pe: parseFloat(item.PE || 0).toFixed(2),
          nav: parseFloat(item.NAV || 0).toFixed(2),
          equity: parseFloat(item.Equity || 0).toFixed(2),
          score: parseFloat(item.Score || 0).toFixed(2),
        }));

        setRows(formatted);
        setFilteredRows(formatted);
      } catch (err) {
        console.error("Data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (id) => {
    // console.log("Row clicked:", id);
    navigate("/MFinfo", { state: { id } });
  };

  const columns = [
    { field: "scheme", headerName: "Scheme", flex: 1.5, minWidth: 200 },
    { field: "score", headerName: "Score", flex: 0.6, minWidth: 100 },
    { field: "category", headerName: "Category", flex: 1, minWidth: 120 },
    { field: "nav", headerName: "NAV", flex: 0.5, minWidth: 80 },
    { field: "assetClass", headerName: "Asset Class", flex: 1, minWidth: 120 },
    { field: "aum", headerName: "AUM (Cr.)", flex: 0.7, minWidth: 100 },
    { field: "pe", headerName: "P/E", flex: 0.5, minWidth: 80 },
    { field: "equity", headerName: "% Equity", flex: 0.6, minWidth: 100 },
    
  ];

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
      <Tablenav />

      <Box
        className="tableOuter"
        style={{
          marginBottom: "5%",
          marginTop: isMobile ? "15%" : "1%",
          overflowX: isMobile ? "auto" : "visible",
        }}
      >
        <Flex>
          {/* Filters Sidebar */}
          <Box
            flex={1}
            position="sticky"
            top={64}
            height="fit-content"
            maxWidth={isMobile ? "0" : "20%"}
            visibility={isMobile ? "hidden" : "visible"}
          >
            <Filters rows={rows} onFilterChange={handleFilterChange} />
          </Box>

          {/* DataGrid */}
          <Box
            flex={4}
            sx={{
              height: 900,
              p: 2,
              overflowX: isMobile ? "auto" : "visible",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              backdropFilter: "blur(16px)",
              borderRadius: "18px",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: isMobile ? "1rem" : "1.25rem",
                mb: 3,
                fontFamily: "Montserrat",
                color: "#4a4a7b",
              }}
            >
              Mutual Fund Summary
            </Typography>

            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              getRowId={(row) => row.id}
              onRowClick={(params) => handleRowClick(params.id)}
              rowHeight={40}
              columnBuffer={2}
              loading={loading}
              slots={{ loadingOverlay: CustomLoadingOverlay }}
              initialState={{
                sorting: {
                  sortModel: [{ field: "score", sort: "desc" }],
                },
              }}
              sx={{
                border: "none",
                fontFamily: "Montserrat",
                backgroundColor: "#fff",
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

      {/* Mobile Filters Drawer */}
      <Box
        visibility={isMobile ? "visible" : "hidden"}
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1500}
        boxShadow="md"
        display="flex"
        justifyContent="center"
        p={1}
        backgroundColor="white"
      >
        {isMobile && (
          <>
            <Button
              variant="contained"
              onClick={toggleDrawer(true)}
              sx={{ width: "100%", bgcolor: "#6e27ff", color: "white", fontWeight: "bold" }}
            >
              Apply Filters
            </Button>
            <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
              {DrawerList}
            </Drawer>
          </>
        )}
      </Box>

      <Footer />
    </>
  );
}
