import * as React from "react";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./App.css"; // We'll use this for custom row styling

export default function App() {
  
  const [rows, setRows] = useState([]);
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100);

  const columns = [
    { field: "mfName", headerName: "Mutual Fund Name", width: 300 },
    { field: "score", headerName: "Score", width: 150 },
  ];

  useEffect(() => {
    fetch("/Final_Table.json")
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([key, mfObj], index) => {
          const [mfName, score] = Object.entries(mfObj)[0];
          return {
            id: index + 1,
            mfName,
            score: parseFloat(score.toFixed(2)),
          };
        });

        formatted.sort((a, b) => b.score - a.score);

        const scores = formatted.map((row) => row.score);
        setMinScore(Math.min(...scores));
        setMaxScore(Math.max(...scores));

        setRows(formatted);
      });
  }, []);

  const getRowClassName = (params) => {
  const score = params.row.score;
  const ratio = (score - minScore) / (maxScore - minScore);
  const hue = 120 - ratio * 120; // 120 (green) → 0 (red)
  const hueRounded = Math.round(hue / 10) * 10;
  return `score-row-${hueRounded}`;
};

  return (
    <Box sx={{height: 800, p: 2}}>
      <Typography variant="h5" gutterBottom>
        Mutual Fund Scores
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        getRowClassName={getRowClassName}
        rowHeight={40}
        style={{border:"2px", borderStyle:"solid",fontFamily:"revert-layer"}}
      />
    </Box>
  );
}
