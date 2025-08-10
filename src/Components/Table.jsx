import { useEffect, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import "./Table.css";
import { Flex, Image } from "@chakra-ui/react";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const columns = [
    {
      field: "mfName",
      headerName: "Mutual Fund Name",
      flex: 2,
      minWidth: 200,
      renderCell: (params) => (
        <span style={{ fontWeight: 550 }}>{params.value}</span>
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const navs = await response.json();
        const formatted = await batchFetchFundData(data, navs);
        formatted.sort((a, b) => b.score - a.score);
        const scores = formatted.map((row) => row.score);
        setMinScore(Math.min(...scores));
        setMaxScore(Math.max(...scores));
        setRows(formatted);
      } catch (err) {
        console.error("Initial data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="navbar">
        <ul>
          <li>
            <Image
              rounded="md"
              src="sgc.png"
              alt="SGC"
              style={{ height: "50px" }}
            />
          </li>
        </ul>
      </div>

      {/* 📱 Responsive Table Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "5%",
          overflowX: isMobile ? "auto" : "visible",
        }}
        className="tableOuter"
      >
        <Box
          sx={{
            height: 800,
            width: isMobile ? "150%" : "60%",
            p: 2,
            overflowX: isMobile ? "auto" : "visible",
          }}
          className="tablebox"
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontSize: isMobile ? "1rem" : "1.25rem" }}
          >
            Mutual Fund Scores
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
            onRowClick={(params) => {
              handelRowClick(params.id);
            }}
            rowHeight={40}
            loading={loading}
            slots={{
              loadingOverlay: CustomLoadingOverlay,
            }}
            style={{
              border: "2px",
              borderStyle: "solid",
              fontFamily: "revert-layer",
              cursor: "pointer",
            }}
          />
        </Box>
      </div>

      <div
        style={{
          border: "2px",
          borderStyle: "solid",
          fontFamily: "revert-layer",
        }}
        className="footer"
      >
        <Footer />
      </div>
    </>
  );
}
