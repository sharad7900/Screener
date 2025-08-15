import React from "react";
import {
  Box,
  TextField,
  MenuItem,
  Slider,
  Typography,
  Button,
  Divider
} from "@mui/material";

export default function Filters({
  fundOptions = [],
  assetClassOptions = [],
  categoryOptions = [],
  onFilterChange,
  onClearFilters
}) {
  const [filters, setFilters] = React.useState({
    mfName: "",
    assetClass: "",
    category: "",
    nav: [0, 500],
    aum: [0, 5000],
    ter: [0, 5],
    equity: [0, 100]
  });

  const handleChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  const handleClear = () => {
    const cleared = {
      mfName: "",
      assetClass: "",
      category: "",
      nav: [0, 500],
      aum: [0, 5000],
      ter: [0, 5],
      equity: [0, 100]
    };
    setFilters(cleared);
    if (onClearFilters) onClearFilters(cleared);
  };

  const sliderBoxStyle = {
    flex: 1,
    minWidth: 200
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        p: 3,
        mb: 3,
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: "0 6px 25px rgba(0,0,0,0.12)" }
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: "#1a1a1a"
        }}
      >
        🔍 Filter
      </Typography>

      {/* Top Row - Dropdowns */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 2
        }}
      >
        <TextField
          select
          label="Mutual Fund"
          value={filters.mfName}
          onChange={(e) => handleChange("mfName", e.target.value)}
          size="small"
          sx={{ minWidth: 200, flex: 1 }}
        >
          <MenuItem value="">All</MenuItem>
          {fundOptions.map((fund) => (
            <MenuItem key={fund} value={fund}>
              {fund}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Asset Class"
          value={filters.assetClass}
          onChange={(e) => handleChange("assetClass", e.target.value)}
          size="small"
          sx={{ minWidth: 200, flex: 1 }}
        >
          <MenuItem value="">All</MenuItem>
          {assetClassOptions.map((ac) => (
            <MenuItem key={ac} value={ac}>
              {ac}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Category"
          value={filters.category}
          onChange={(e) => handleChange("category", e.target.value)}
          size="small"
          sx={{ minWidth: 200, flex: 1 }}
        >
          <MenuItem value="">All</MenuItem>
          {categoryOptions.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Sliders */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3
        }}
      >
        <Box sx={sliderBoxStyle}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            NAV
          </Typography>
          <Slider
            value={filters.nav}
            onChange={(_, val) => handleChange("nav", val)}
            valueLabelDisplay="auto"
            min={0}
            max={500}
          />
        </Box>

        <Box sx={sliderBoxStyle}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            AUM (Cr.)
          </Typography>
          <Slider
            value={filters.aum}
            onChange={(_, val) => handleChange("aum", val)}
            valueLabelDisplay="auto"
            min={0}
            max={5000}
          />
        </Box>

        <Box sx={sliderBoxStyle}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Expense Ratio (%)
          </Typography>
          <Slider
            value={filters.ter}
            onChange={(_, val) => handleChange("ter", val)}
            valueLabelDisplay="auto"
            step={0.1}
            min={0}
            max={5}
          />
        </Box>

        <Box sx={sliderBoxStyle}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            % Equity
          </Typography>
          <Slider
            value={filters.equity}
            onChange={(_, val) => handleChange("equity", val)}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={handleClear}
        >
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
}
