import { useEffect, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Drawer,
  Button,
  useMediaQuery
} from "@mui/material";
import { Image } from "@chakra-ui/react";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters.jsx";
import CloseIcon from "@mui/icons-material/Close";

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
          backgroundColor: "rgba(255, 255, 255, 0.5)"
        }}
      >
        <CircularProgress />
      </Box>
    </GridOverlay>
  );
}

export default function Table() {
  const [rows, setRows] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const columns = [
    {
      field: "mfName",
      headerName: "Mutual Fund Name",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => <strong>{params.value}</strong>
    },
    { field: "score", headerName: "Score", flex: 0.5, minWidth: 80 },
    { field: "cat", headerName: "Category", flex: 0.75, minWidth: 120 },
    { field: "assetClass", headerName: "Asset Class", flex: 0.5, minWidth: 100 },
    { field: "nav", headerName: "NAV", flex: 0.4, minWidth: 80 },
    { field: "aum", headerName: "AUM (Cr.)", flex: 0.5, minWidth: 100 },
    { field: "ter", headerName: "Expense Ratio", flex: 0.6, minWidth: 120 },
    { field: "per", headerName: "% Equity", flex: 0.5, minWidth: 100 }
  ];

  const handelRowClick = (id) => {
    navigate("/MFinfo", { state: { id } });
  };

  const batchFetchFundData = async (keysMap, nvdt) => {
    const entries = Object.entries(keysMap);
    const promises = entries.map(async ([key, mfObj]) => {
      const [mfName, score] = Object.entries(mfObj)[0];
      const per = Object?.entries(mfObj)?.[1]?.[1] || "N/A";
      const assetClass = Object?.entries(mfObj)?.[2]?.[1] || "N/A";
      const cat = Object?.entries(mfObj)?.[3]?.[1] || "NA";
      const aum = Object?.entries(mfObj)?.[4]?.[1] || "NA";
      const ter = Object?.entries(mfObj)?.[5]?.[1] || "NA";
      const nav = nvdt[key];
      console.log(nvdt);

      return {
        id: key,
        mfName,
        score: parseFloat(score.toFixed(2)),
        per: parseFloat(per.toFixed(2)),
        assetClass,
        cat,
        aum: parseFloat(aum),
        ter: parseFloat(ter),
        nav: parseFloat(nav)
      };
    });
    return (await Promise.all(promises)).filter((d) => d !== null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/Final_Table.json");
        const data = await res.json();
        const response = await fetch(`https://screener-back.vercel.app/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        const navs = await response.json();
        const formatted = await batchFetchFundData(data, navs);
        setRows(formatted);
        console.log()
        setAllRows(formatted);
      } catch (err) {
        console.error("Initial data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = allRows.filter((row) => {
      const matchFund = !filters.mfName || row.mfName === filters.mfName;
      const matchAsset =
        !filters.assetClass || row.assetClass === filters.assetClass;
      const matchCategory = !filters.category || row.cat === filters.category;
      const matchNav = row.nav >= filters.nav[0] && row.nav <= filters.nav[1];
      const matchAum = row.aum >= filters.aum[0] && row.aum <= filters.aum[1];
      const matchTer = row.ter >= filters.ter[0] && row.ter <= filters.ter[1];
      const matchEquity =
        row.per >= filters.equity[0] && row.per <= filters.equity[1];

      return (
        matchFund &&
        matchAsset &&
        matchCategory &&
        matchNav &&
        matchAum &&
        matchTer &&
        matchEquity
      );
    });

    setRows(filtered);
  };

  const handleClearFilters = () => {
    setRows(allRows);
  };

  return (
    <>
      {/* Navbar */}
      <Box
  sx={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "100%",
    backgroundColor: "white",
    borderBottom: "2px solid gray",
    zIndex: 2000,
    overflowX: "hidden",
  }}
>
  <ul
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "0.3% 1%",
      margin: 0,
      listStyle: "none",
      flexWrap: "wrap",
    }}
  >
    <li>
      <Image
        rounded="md"
        src="sgc.png"
        alt="SGC"
        style={{
          height: "50px",
          maxWidth: "100%",
          display: "block",
        }}
      />
    </li>
  </ul>
</Box>

      <Box sx={{ display: "flex", px: isMobile ? 0 : 3, py: 2 }} mt={8}>
        {/* Sidebar filters only on desktop */}
        {!isMobile && (
          <Box
            sx={{
              flex: "0 0 300px",
              position: "sticky",
              top: 20,
              height: "fit-content",
              mr: 3
            }}
          >
            <Filters
              fundOptions={[...new Set(allRows.map((r) => r.mfName))]}
              assetClassOptions={[...new Set(allRows.map((r) => r.assetClass))]}
              categoryOptions={[...new Set(allRows.map((r) => r.cat))]}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </Box>
        )}

        {/* Table full width on mobile */}
        <Box sx={{ flex: 1 }} pb={isMobile ? 8 : 10}>
          <Typography variant="h5" gutterBottom>
            Mutual Fund Scores
          </Typography>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
            onRowClick={(params) => handelRowClick(params.id)}
            rowHeight={40}
            loading={loading}
            initialState={{
              sorting: { sortModel: [{ field: "score", sort: "desc" }] }
            }}
            slots={{
              loadingOverlay: CustomLoadingOverlay
            }}
            style={{
              border: "2px solid #000000ff",
              fontFamily: "revert-layer",
              cursor: "pointer",
              height: "100vh",
              overflowY:"scroll"
            }}
          />
        </Box>
      </Box>

      {/* Sticky bottom filter button for mobile */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "white",
            p: 1,
            borderTop: "1px solid #ccc",
            zIndex: 1000
          }}
        >
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setDrawerOpen(true)}
          >
            Filters
          </Button>
        </Box>
      )}

      {/* Drawer for filters on mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Filters
            fundOptions={[...new Set(allRows.map((r) => r.mfName))]}
            assetClassOptions={[...new Set(allRows.map((r) => r.assetClass))]}
            categoryOptions={[...new Set(allRows.map((r) => r.cat))]}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </Box>
      </Drawer>
    </>
  );
}
