import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

const Heatmap = ({ heatmapData }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const metrics = ["PE", "ROCE", "ROE", "PromHold", "Salesvar", "ProfitVar", "OPM", "CROIC"];
  const invertedMetrics = ["PE"]; // ✅ PE should be opposite color logic

  useEffect(() => {
    setData(Array.isArray(heatmapData) ? heatmapData : []);
  }, [heatmapData]);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!Array.isArray(data) || data.length === 0) {
      Plotly.purge(chartRef.current);
      return;
    }

    const displayedData = showAll ? data : data.slice(0, 30);
    if (!displayedData.length) return;

    const descDisplayedData = [...displayedData].reverse();

    const stocks = descDisplayedData.map(d => d.Symbol || "N/A");

    const rawMatrix = descDisplayedData.map(row =>
      metrics.map(col => {
        const val = parseFloat(row[col]);
        return isNaN(val) ? 0 : val;
      })
    );

    if (!rawMatrix.length || !rawMatrix[0]?.length) return;

    // ✅ Column-wise normalization with PE inversion
    const normalizedMatrix = rawMatrix[0].map((_, colIndex) => {
      const colValues = rawMatrix.map(row => row[colIndex]);
      const min = Math.min(...colValues);
      const max = Math.max(...colValues);
      const metric = metrics[colIndex];

      return rawMatrix.map(row => {
        if (max === min) return 0.5;
        let normalized = (row[colIndex] - min) / (max - min);

        // ✅ PE: high = red, low = green
        if (invertedMetrics.includes(metric)) {
          normalized = 1 - normalized;
        }
        return normalized;
      });
    });

    const zMatrix = rawMatrix.map((_, rowIndex) =>
      metrics.map((_, colIndex) => normalizedMatrix[colIndex][rowIndex])
    );

    const textMatrix = rawMatrix.map(row =>
      row.map(val => val.toFixed(2))
    );

    const layout = {
      height: displayedData.length * 25,
      margin: { l: 100, r: 30, t: 50, b: 20 },
      xaxis: {
        title: "Metrics",
        side: "top",
        automargin: true,
      },
      yaxis: {
        tickfont: { size: 10 },
      },
    };

    const plotData = [{
      z: zMatrix,
      text: textMatrix,
      texttemplate: "%{text}",
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
        "Stock: %{y}<br>Metric: %{x}<br>Value: %{text}<extra></extra>",
    }];

    Plotly.react(chartRef.current, plotData, layout, {
      responsive: true,
      displayModeBar: false
    });

    return () => {
      if (chartRef.current) Plotly.purge(chartRef.current);
    };
  }, [data, showAll, metrics]);

  return (
    <>
      {/* ✅ Container must always exist to avoid null errors */}
      <div
        ref={chartRef}
        style={{
          width: "65%",
          minHeight: "250px",
          margin: "0 auto",
        }}
      ></div>

      {data.length > 30 && (
        <div style={{ textAlign: "center", marginTop: 5 }}>
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
