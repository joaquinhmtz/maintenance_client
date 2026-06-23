import {
    Box, Typography
} from '@mui/material';
import { C } from "../../theme/variables";

export default function Footer({ nameApp }) {
    return (
        <Box component="footer" sx={{
            py: 1.75, px: 3,
            borderTop: `1px solid ${C.teal200}`,
            bgcolor: C.teal50,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
            flexWrap: "wrap",
        }}>
            {[
                { text: `${nameApp} © 2026`, color: C.grayBlue, pipe: true },
                { text: "Versión: ", color: C.grayBlue, pipe: true },
                { text: "2.4.1", color: C.teal700, pipe: false },
            ].map((f, i) => (
                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {i > 0 && f.pipe && <Box sx={{ width: "2px", height: "1rem", bgcolor: C.teal200 }} />}
                    <Typography sx={{ fontSize: 12, color: f.color, fontWeight: f.color === C.teal700 ? 600 : 400 }}>
                        {f.text}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
}