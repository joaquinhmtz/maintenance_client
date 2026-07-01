import { Box, LinearProgress, Stack, Typography } from "@mui/material";

export default function MonthProgressBar({ total, completed, overdue, percentage }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Avance del mes ({completed} de {total} completadas)
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {percentage}%
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={percentage}
        sx={{
          height: 6,
          borderRadius: 4,
          bgcolor: "grey.200",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            bgcolor: "success.main"
          }
        }}
      />

      {overdue > 0 && (
        <Typography
          variant="caption"
          sx={{ color: "error.main", mt: 0.5, display: "block", fontWeight: 600, fontSize: 13 }}
        >
          {overdue} orden{overdue > 1 ? "es" : ""} vencida{overdue > 1 ? "s" : ""}
        </Typography>
      )}
    </Box>
  );
}