import { useEffect, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import "./Table.css";
import {Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Filters from "./Filters.jsx";
import { Button, Drawer } from "@mui/material";

// 🔄 Custom loading overlay


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
          backgroundColor: "rgba(255, 255, 255, 0.5)",
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

  const handleFilterChange = (newRows) => {
    setFilteredRows(newRows);
  };

  const columns = [
    {
      field: "mfName", headerName: "Mutual Fund Name", flex: 2, minWidth: 200, renderCell: (params) => (
        <strong>{params.value}</strong>
      ),
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
        per: parseFloat(per.toFixed(2)),
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/Final_Table.json");
        const data = await res.json();
        const response = await fetch(`https://screener-back.vercel.app/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const navs = await response.json();
        const formatted = await batchFetchFundData(data, navs);
        setRows(formatted);
        setFilteredRows(formatted); // initialize with full data
      } catch (err) {
        console.error("Initial data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box mt={5} position="sticky" top={20} height="fit-content">
      <Filters rows={rows} onFilterChange={handleFilterChange} />
    </Box>
  );


  return (
    <>
      <div className="navbar">
        <ul>
          <li>
            <Image rounded="md" src="sgc.png" alt="SGC" style={{ height: "50px" }} />
          </li>
        </ul>
      </div>

      <div className="tableOuter" style={{ marginBottom: "5%", marginTop: isMobile ? "15%" : "5%", overflowX: isMobile ? "auto" : "visible" }}>
        <Flex>
          <Box flex={1} mt={5} position="sticky" top={20} height="fit-content" maxWidth={isMobile ? "0%" : "19%"} visibility={isMobile ? "hidden" : "visible"}>
            <Filters rows={rows} onFilterChange={handleFilterChange} />
          </Box>

          <Box flex={4} sx={{ height: 900, p: 2, overflowX: isMobile ? "auto" : "visible" }} className="tablebox">
            <Typography variant="h5" gutterBottom sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}>
              Mutual Fund Scores
            </Typography>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSize={10}
              getRowId={(row) => row.id}
              onRowClick={(params) => handleRowClick(params.id)}
              rowHeight={40}
              loading={loading}
              initialState={{
                sorting: {
                  sortModel: [{ field: "score", sort: "desc" }],
                },
              }}
              slots={{ loadingOverlay: CustomLoadingOverlay }}
              style={{
                border: "2px solid",
                fontFamily: "revert-layer",
                cursor: "pointer",
              }}
            />
          </Box>
        </Flex>
      </div>
      <Box visibility={isMobile ? "visible" : "hidden"} position="fixed" bottom={0} left={0} right={0} zIndex={1000} boxShadow="md" display="flex" justifyContent="center">
        {/* <Drawer.Root>
          <Drawer.Trigger asChild>
            <Button variant="outline" size="sm" style={{ backgroundColor: "#007bffff", color: "#ffffffff", width: "100%" }}>
              Apply Filters
            </Button>
          </Drawer.Trigger>
          <Portal>
            <Drawer.Backdrop />
            <Drawer.Positioner>
              <Drawer.Content>
                <Drawer.Header>
                </Drawer.Header>
                <Drawer.Body>
                  <Box flex={1} mt={5} position="sticky" top={20} height="fit-content">
                    <Filters rows={rows} onFilterChange={handleFilterChange} />
                  </Box>
                </Drawer.Body>
                <Drawer.Footer>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Content>
            </Drawer.Positioner>
          </Portal>
        </Drawer.Root> */}
        {isMobile && (<><Button onClick={toggleDrawer(true)} style={{backgroundColor:"#0095ffff", width:"100%", color:"white"}}>Apply Filters</Button>
          <Drawer open={open} onClose={toggleDrawer(false)} >
            {DrawerList}
          </Drawer></>)}

      </Box>
    </>
  );
}
