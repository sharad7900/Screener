import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

const Heatmap = ({ heatmapData }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // ✅ Define these at the top-level of your component (before useEffect)
  const metrics = ["PE", "ROCE", "ROE", "PromHold", "Salesvar", "ProfitVar", "OPM", "CROIC"];
  const invertedMetrics = ["PE"];

  useEffect(() => {
    setData(heatmapData || []);
  }, [heatmapData]);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    const displayedData = showAll ? data : data.slice(0, 30);

    const descDisplayedData = [...displayedData].reverse(); // reverse for DESC order display

  const stocks = descDisplayedData.map((d) => d.Symbol);
  const rawMatrix = descDisplayedData.map((row) =>
    metrics.map((col) => parseFloat(row[col]) || 0)
  );

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
      height: displayedData.length * cellHeight,
      margin: { l: 100, r: 30, t: 50, b: 20 },
      xaxis: { 
    title: "Metrics", 
    side: "top",       // ✅ moves axis title and ticks to top
    automargin: true,
  },
  yaxis: {
    tickfont: {
      size: 10,  // change this value to your desired font size
    },
  }
    };
  const textMatrix = rawMatrix.map((row) =>
  row.map((val) => (val ? val.toFixed(2) : "0"))
);
console.log("Plot Data:", { stocks, zMatrix, textMatrix });
    const plotData = [
  {
    z: zMatrix, // normalized values for color
    text: textMatrix, // actual/original values for display
    texttemplate: "%{text}", // show text values inside cells
    textfont: {
      size: 10,
      color: "black",
    },
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
    hovertemplate:
      "Stock: %{y}<br>Metric: %{x}<br>Value: %{text}<extra></extra>", // better hover info
  },
];

    Plotly.newPlot(chartRef.current, plotData, layout, { responsive: false, displaylogo: false });
    return () => Plotly.purge(chartRef.current);
  }, [data, metrics, showAll]); // ✅ metrics included as dependency

  return (
    <>
    <div
      ref={chartRef}
      style={{
        width: "65%",
        height: "max-content",
        margin: "0 auto",
      }}
    ></div>

     {data.length > 30 && (
        <div style={{ textAlign: "center", marginTop: 1 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "1px solid #6e27ff",
              backgroundColor: showAll ? "#fff" : "#6e27ff",
              color: showAll ? "#6e27ff" : "#fff",
              marginBottom: "3%",
            }}
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        </div>
      )}
    </>
  );
};

export default Heatmap;
