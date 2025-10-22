import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

const Heatmap = ({ heatmapData }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  // ✅ Define these at the top-level of your component (before useEffect)
  const metrics = ["PE", "ROCE", "ROE", "PromHold", "Salesvar", "ProfitVar", "OPM", "CROIC"];
  const invertedMetrics = ["PE"];

  useEffect(() => {
    setData(heatmapData || []);
  }, [heatmapData]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const stocks = data.map((d) => d.Symbol);
    const rawMatrix = data.map((row) => metrics.map((col) => parseFloat(row[col]) || 0));

    const normalizedMatrix = rawMatrix[0].map((_, colIndex) => {
      const colValues = rawMatrix.map((row) => row[colIndex]);
      const min = Math.min(...colValues);
      const max = Math.max(...colValues);
      const metric = metrics[colIndex];
      return rawMatrix.map((row) => {
        const val = row[colIndex];
        if (max === min) return 0.5;
        let normalized = (val - min) / (max - min);
        if (invertedMetrics.includes(metric)) normalized = 1 - normalized;
        return normalized;
      });
    });

    const zMatrix = rawMatrix.map((_, rowIndex) =>
      metrics.map((_, colIndex) => normalizedMatrix[colIndex][rowIndex])
    );
    // fixed pixel size per metric
    const cellHeight = 25; // fixed height per stock
    const layout = {
      // width: metrics.length * cellWidth,
      height: data.length * cellHeight,
      margin: { l: 100, r: 30, t: 80, b: 80 },
      xaxis: { 
    title: "Metrics", 
    side: "top",       // ✅ moves axis title and ticks to top
    automargin: true,
  },
    };

    const plotData = [
      {
        z: zMatrix,
        x: metrics,
        y: stocks,
        type: "heatmap",
        colorscale: [
          [0, "red"],
          [0.5, "yellow"],
          [1, "green"],
        ],
        showscale: true,
        xgap: 2,
        ygap: 2,
      },
    ];

    Plotly.newPlot(chartRef.current, plotData, layout, { responsive: false, displaylogo: false });
    return () => Plotly.purge(chartRef.current);
  }, [data, metrics]); // ✅ metrics included as dependency

  return (
    <div
      ref={chartRef}
      style={{
        width: "75%",
        height: "max-content",
        margin: "0 auto",
      }}
    ></div>
  );
};

export default Heatmap;
