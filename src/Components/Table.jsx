import { useEffect, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import "./Table.css";
import { Flex, Image } from "@chakra-ui/react";
import { ColorModeButton } from "../Components/ui/color-mode.jsx";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";


// 🔄 Custom loading overlay
function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
  const d = new Date();
  const navigate = useNavigate();

  const columns = [
    { field: "mfName", headerName: "Mutual Fund Name", flex: 2 },
    { field: "score", headerName: "Score", flex: 0.5 },
    { field: "cat", headerName: "Category", flex: 0.75 },
    { field: "assetClass", headerName: "Asset Class", flex: 0.5 },
    { field: "nav", headerName: "NAV", flex: 0.4 },
    { field: "aum", headerName: "AUM (Cr.)", flex: 0.5 },
    { field: "ter", headerName: "Expense Ratio", flex: 0.6 },
    { field: "per", headerName: "% Equity", flex: 0.5 },
  ];

  const getRowClassName = (params) => {
    const score = params.row.score;
    const ratio = (score - minScore) / (maxScore - minScore);
    const hue = 120 - ratio * 120;
    const hueRounded = Math.round(hue / 10) * 10;
    return `score-row-${hueRounded}`;
  };

  const handelRowClick = (params)=>{

   navigate("/MFinfo",{ state: { id: params } });

  }

  // 📦 Simulated batch fetcher
  const batchFetchFundData = async (keysMap, nvdt) => {
    const entries = Object.entries(keysMap);

    const promises = entries.map(async ([key, mfObj], index) => {
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
        nav
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
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        })
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
          <li><Image rounded="md" src="sgc.png" alt="SGC" style={{ height: "50px" }} /></li>
          <li><ColorModeButton /></li>
        </ul>
      </div>
      {/* Apply Filters Here! */}
      {/* <div className="outerdiv" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box style={{ width: "75%" }} sx={{ height: 200, p: 2 }}>
       
        <div style={{border:"2px", borderColor:"gray", borderStyle:"solid", borderRadius:"3px", height:"100%"}}>

        </div>
      </Box>
      </div> */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5%" }}>

        <Box sx={{ height: 800, p: 2 }} style={{ width: "75%" }}>
          <Typography variant="h5" gutterBottom>
            Mutual Fund Scores
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.id}
            getRowClassName={getRowClassName}
            onRowClick={(params) => {
              handelRowClick(params.id);
            }}

            rowHeight={40}
            loading={loading}
            slots={{
              loadingOverlay: CustomLoadingOverlay,
            }}
            style={{ border: "2px", borderStyle: "solid", fontFamily: "revert-layer" }}
          />
        </Box>
      </div>
      <div style={{ border: "2px", borderStyle: "solid", fontFamily: "revert-layer" }}>
        <Footer />
      </div>

    </>);
}
