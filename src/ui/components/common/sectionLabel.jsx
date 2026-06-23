import { Box, Typography } from "@mui/material";
import { C } from "./../../../theme/variables";

export default function SectionLabel({ icon, children }) {

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Box sx={{ color: C.teal500, display: "flex", fontSize: 14 }}>{icon}</Box>
            <Typography sx={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: C.grayBlue,
            }}>
                {children}
            </Typography>
            <Box sx={{ flex: 1, height: "0.5px", bgcolor: "divider", ml: 1 }} />
        </Box>
    );
}