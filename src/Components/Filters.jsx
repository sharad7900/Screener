import { useState, useEffect } from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  TextField,
  Slider,
  Button,
} from "@mui/material";
import { Separator } from "@chakra-ui/react";
import "./Filters.css";

// ---------- Utility ----------
function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const ITEM_HEIGHT = 48;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5,
      width: 250,
    },
  },
};

const assetClassOptions = ["Equity", "Debt", "Solution Oriented", "Others"];
const categoryOptions = ["Large Cap", "Mid Cap", "Small Cap", "Sectoral", "Retirement"];

const Filters = ({ rows, onFilterChange }) => {
  const [assetClass, setAssetClass] = useState([]);
  const [category, setCategory] = useState([]);
  const [mfName, setMfName] = useState("");
  const [aum, setAum] = useState([0, 100000]);
  const [ter, setTer] = useState([0, 4]);
  const [equity, setEquity] = useState([0, 100]);
  const [score, setScore] = useState([0, 100]);

  const debouncedMfName = useDebounce(mfName);
  const debouncedAum = useDebounce(aum);
  const debouncedTer = useDebounce(ter);
  const debouncedEquity = useDebounce(equity);
  const debouncedScore = useDebounce(score);

  const clearAllFilters = () => {
    setAssetClass([]);
    setCategory([]);
    setMfName("");
    setAum([0, 100000]);
    setTer([0, 4]);
    setEquity([0, 100]);
    setScore([0, 100]);
    onFilterChange(rows);
  };

  useEffect(() => {
    if (!rows) return;

    const filtered = rows.filter((row) => {
      if (assetClass.length && !assetClass.includes(row.assetClass)) return false;
      if (category.length && !category.some((cat) => row.cat?.toLowerCase().includes(cat.toLowerCase()))) return false;
      if (debouncedMfName && !row.mfName.toLowerCase().includes(debouncedMfName.toLowerCase())) return false;
      if (row.aum < debouncedAum[0] || row.aum > debouncedAum[1]) return false;
      if (row.ter < debouncedTer[0] || row.ter > debouncedTer[1]) return false;
      if (row.per < debouncedEquity[0] || row.per > debouncedEquity[1]) return false;
      if (row.score < debouncedScore[0] || row.score > debouncedScore[1]) return false;
      return true;
    });

    onFilterChange(filtered);
  }, [
    assetClass,
    category,
    debouncedMfName,
    debouncedAum,
    debouncedTer,
    debouncedEquity,
    debouncedScore,
    rows,
  ]);

  return (
    <div className="filter-container">
      <Typography variant="h5" gutterBottom fontWeight={"bold"}>
        🔎 Filters
      </Typography>
      <Separator mb={5} w={"100%"} />

      {/* Asset Class */}
      <FormControl fullWidth>
        <InputLabel>Asset Class</InputLabel>
        <Select
          multiple
          value={assetClass}
          onChange={(e) => setAssetClass(e.target.value)}
          input={<OutlinedInput label="Asset Class" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {assetClassOptions.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={assetClass.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Category */}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          multiple
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          input={<OutlinedInput label="Category" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {categoryOptions.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={category.includes(name)} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* MF Name Search */}
      <TextField
        label="Mutual Fund Name"
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        value={mfName}
        onChange={(e) => setMfName(e.target.value)}
      />

      {/* AUM */}
      <Typography sx={{ mt: 3 }}>AUM (Cr.)</Typography>
      <Slider
        value={aum}
        onChange={(e, val) => setAum(val)}
        valueLabelDisplay="auto"
        getAriaValueText={(val) => `${val}Cr`}
        min={0}
        max={100000}
        step={1000}
      />

      {/* TER */}
      <Typography sx={{ mt: 3 }}>Expense Ratio</Typography>
      <Slider
        value={ter}
        onChange={(e, val) => setTer(val)}
        valueLabelDisplay="auto"
        getAriaValueText={(val) => `${val}%`}
        min={0}
        max={4}
        step={0.1}
      />

      {/* Equity */}
      <Typography sx={{ mt: 3 }}>Equity %</Typography>
      <Slider
        value={equity}
        onChange={(e, val) => setEquity(val)}
        valueLabelDisplay="auto"
        getAriaValueText={(val) => `${val}%`}
        min={0}
        max={100}
        step={1}
      />

      {/* Score */}
      <Typography sx={{ mt: 3 }}>Score</Typography>
      <Slider
        value={score}
        onChange={(e, val) => setScore(val)}
        valueLabelDisplay="auto"
        getAriaValueText={(val) => `${val}`}
        min={0}
        max={100}
        step={1}
      />

      {/* Clear Button */}
      <Button
        variant="outlined"
        color="secondary"
        fullWidth
        sx={{ mt: 3 }}
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default Filters;
