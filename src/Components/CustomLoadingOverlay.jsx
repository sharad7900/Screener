// CustomLoadingOverlay.jsx
import { GridOverlay } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CustomLoadingOverlay() {
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
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <CircularProgress />
      </Box>
    </GridOverlay>
  );
}
