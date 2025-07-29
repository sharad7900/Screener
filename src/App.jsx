import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import "./App.css";

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

export default function App() {
  const [rows, setRows] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);
  const [loading, setLoading] = useState(true);

  const columns = [
    { field: "mfName", headerName: "Mutual Fund Name", width: 500 },
    { field: "score", headerName: "Score", width: 152 },
    { field: "cat", headerName: "Category", width: 300 },
    { field: "assetClass", headerName: "Asset Class", width: 200 },
    { field: "nav", headerName: "NAV", width: 200 },
    { field: "aum", headerName: "AUM", width: 300 },
    { field: "ter", headerName: "Expense Ratio", width: 200 },
  ];

  const getRowClassName = (params) => {
    const score = params.row.score;
    const ratio = (score - minScore) / (maxScore - minScore);
    const hue = 120 - ratio * 120;
    const hueRounded = Math.round(hue / 10) * 10;
    return `score-row-${hueRounded}`;
  };

  // 📦 Simulated batch fetcher
  const batchFetchFundData = async (keysMap) => {
    const entries = Object.entries(keysMap);

    const promises = entries.map(async ([key, mfObj], index) => {
      const [mfName, score] = Object.entries(mfObj)[0];

      try {
        const [res1, res2] = await Promise.all([
          fetch(`https://dotnet.ngenmarkets.com/ngenindia.asmx/ReturnSQLResult?sql=exec%20c_getFundMetaData%${key}`).then((res) => res.json()),
          fetch(`https://dotnet.ngenmarkets.com/ngenindia.asmx/ReturnSQLResult?sql=exec%20c_getSchemeNavJSON%${key}`).then((res) => res.json()),
        ]);

        return {
          id: index + 1,
          mfName,
          score: parseFloat(score.toFixed(2)),
          assetClass: res1?.meta?.[0]?.assetClass || "N/A",
          cat: res1?.meta?.[0]?.category || "N/A",
          aum: res1?.meta?.[0]?.aum || "N/A",
          ter: res1?.meta?.[0]?.ter || "N/A",
          nav: res2?.[res2.length - 1].nav || "N/A",
        };
      } catch (err) {
        console.error(`Fetch failed for ${key}`, err);
        return null;
      }
    });

    const allData = await Promise.all(promises);
    return allData.filter((d) => d !== null);
  };

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const res = await fetch("/Final_Table.json");
        const data = await res.json();

        const formatted = await batchFetchFundData(data);
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
    <Box sx={{ height: 800, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Mutual Fund Scores
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        getRowId={(row) => row.id}
        getRowClassName={getRowClassName}
        rowHeight={40}
        loading={loading}
        slots={{
          loadingOverlay: CustomLoadingOverlay,
        }}
        style={{ border: "2px", borderStyle: "solid", fontFamily: "revert-layer" }}
      />
    </Box>
  );
}
