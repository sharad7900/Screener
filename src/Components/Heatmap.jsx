import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

const Heatmap = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://screener-back.vercel.app/MFInfo")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error loading data:", err));
  }, []);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const metrics = [
      "PE",
      "ROCE",
      "ROE",
      "PromHold",
      "Salesvar",
      "ProfitVar",
      "OPM",
      "CROIC",
    ];

    // Metrics where lower = better (so invert normalization)
    const invertedMetrics = ["PE"];

    const stocks = data.map((d) => d.Symbol);

    // Build numeric matrix
    const rawMatrix = data.map((row) =>
      metrics.map((col) => parseFloat(row[col]) || 0)
    );

    // --- Column-wise normalization with inversion ---
    const normalizedMatrix = rawMatrix[0].map((_, colIndex) => {
      const colValues = rawMatrix.map((row) => row[colIndex]);
      const min = Math.min(...colValues);
      const max = Math.max(...colValues);
      const metric = metrics[colIndex];

      return rawMatrix.map((row) => {
        const val = row[colIndex];
        if (max === min) return 0.5; // constant column → neutral yellow

        // normal case
        let normalized = (val - min) / (max - min);

        // invert if lower is better
        if (invertedMetrics.includes(metric)) {
          normalized = 1 - normalized;
        }

        return normalized;
      });
    });

    // transpose back to rows = stocks, columns = metrics
    const zMatrix = rawMatrix.map((_, rowIndex) =>
      metrics.map((_, colIndex) => normalizedMatrix[colIndex][rowIndex])
    );

    const plotData = [
      {
        z: zMatrix,
        x: metrics,
        y: stocks,
        type: "heatmap",
        colorscale: [
          [0, "red"],     // low (bad)
          [0.5, "yellow"],// mid
          [1, "green"],   // high (good)
        ],
        showscale: true,
        hoverongaps: true,
        hovertemplate:
          "<b>%{y}</b><br>%{x}: %{z:.2f}<extra></extra>",
        // normalized values
        xgap: 2,  // horizontal gap in pixels
    ygap: 2,
    line: {
      width: 1,        // thickness of border
      color: "black",  // color of border
    },
      },
    ];

    const layout = {
      title: "Normalized Stock Metrics Heatmap (Green = Better, Red = Worse)",
      xaxis: { title: "Metrics", side: "top" },
      yaxis: { title: "Stock Symbol", automargin: true },
      width: 1000,
      height: 600,
      margin: { l: 120, r: 50, t: 100, b: 100 },
    };

    Plotly.newPlot(chartRef.current, plotData, layout, { responsive: true, displaylogo: false });

    return () => Plotly.purge(chartRef.current);
  }, [data]);

  return (
    <div
      ref={chartRef}
      style={{ width: "1000px", height: "600px", margin: "auto" }}
    ></div>
  );
};

export default Heatmap;
