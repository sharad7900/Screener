import React, { useEffect, useRef, useState } from "react";
import Plotly from "plotly.js-dist-min";

const Heatmap = ({ heatmapData }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const metrics = ["PE", "ROCE", "ROE", "PromHold", "Salesvar", "ProfitVar", "OPM", "CROIC"];

  useEffect(() => {
    setData(Array.isArray(heatmapData) ? heatmapData : []);
  }, [heatmapData]);

  // ✅ Metric based threshold coloring
 const clamp = (num) => Math.min(1, Math.max(0, num));

const getColorValue = (metric, value) => {
  if (isNaN(value)) return 0.5;

  let result;

  switch (metric) {

    /* ========= PE (LOW GOOD, HIGH BAD) ========= */
    case "PE":
      if (value < 30) {
        result = 1 - (value / 30) * 0.5;
      } else if (value <= 100) {
        result = 0.5 - ((value - 30) / 70) * 0.5;
      } else {
        result = 0;
      }
      break;

    /* ========= ROCE / ROE / OPM / CROIC (HIGH GOOD) ========= */
    case "ROCE":
    case "ROE":
    case "OPM":
    case "CROIC":
      if (value <= 12) {
        result = (value / 12) * 0.5;
      } else if (value <= 50) {
        result = 0.5 + ((value - 12) / 38) * 0.5;
      } else {
        result = 1;
      }
      break;

    /* ========= PROM HOLD ========= */
    case "PromHold":
      if (value <= 50) {
        result = (value / 50) * 0.5;
      } else if (value <= 100) {
        result = 0.5 + ((value - 50) / 50) * 0.5;
      } else {
        result = 1;
      }
      break;

    /* ========= SALES & PROFIT ========= */
    case "Salesvar":
    case "ProfitVar":
      if (value <= 8) {
        result = (value / 8) * 0.5;
      } else if (value <= 50) {
        result = 0.5 + ((value - 8) / 42) * 0.5;
      } else {
        result = 1;
      }
      break;

    default:
      result = 0.5;
  }

  // ✅ THIS IS THE KEY LINE
  return clamp(result);
};




  useEffect(() => {
    if (!chartRef.current || !data.length) {
      Plotly.purge(chartRef.current);
      return;
    }

    const displayedData = showAll ? data : data.slice(0, 30);
    const reversedData = [...displayedData].reverse();

    const stocks = reversedData.map(d => d.Symbol || "N/A");

    const rawMatrix = reversedData.map(row =>
      metrics.map(col => parseFloat(row[col]) || 0)
    );

    // ✅ Apply custom threshold logic
    const zMatrix = rawMatrix.map(row =>
      row.map((val, colIndex) => getColorValue(metrics[colIndex], val))
    );

    const textMatrix = rawMatrix.map(row =>
      row.map(val => val.toFixed(2))
    );

    const layout = {
      height: displayedData.length * 25,
      margin: { l: 100, r: 40, t: 50, b: 20 },
      xaxis: { side: "top" },
      yaxis: { tickfont: { size: 10 } },
    };

    const plotData = [{
      z: zMatrix,
      text: textMatrix,
      texttemplate: "%{text}",
      type: "heatmap",
      x: metrics,
      y: stocks,
      colorscale: [
        [0, "red"],
        [0.5, "yellow"],
        [1, "green"],
      ],
      showscale: true,
      hovertemplate:
        "Stock: %{y}<br>Metric: %{x}<br>Value: %{text}<extra></extra>",
      xgap: 2,
      ygap: 2
    }];

    Plotly.react(chartRef.current, plotData, layout, {
      responsive: true,
      displayModeBar: false
    });

    return () => Plotly.purge(chartRef.current);
  }, [data, showAll]);

  return (
    <>
      <div
        ref={chartRef}
        style={{
          width: "65%",
          minHeight: "250px",
          margin: "0 auto",
        }}
      />

      {data.length > 30 && (
        <div style={{ textAlign: "center", marginTop: 5 }}>
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid #6e27ff",
              backgroundColor: showAll ? "#fff" : "#6e27ff",
              color: showAll ? "#6e27ff" : "#fff",
              cursor: "pointer",
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
