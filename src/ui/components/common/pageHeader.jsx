import { Box, Typography } from "@mui/material";
import { C } from "../../../theme/variables";

/**
 * PageHeader — encabezado reutilizable para cada pantalla.
 *
 * Props:
 *  title    — string, título principal
 *  subtitle — string (opcional)
 *  action   — ReactNode (opcional) — botón u otro elemento a la derecha
 */
export default function PageHeader({ title, subtitle, action }) {
    return (
        <Box sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            mb: 3,
        }}>
            <Box>
                <Typography variant="h5" sx={{ fontSize: { xs: 18, sm: 22 }, mb: subtitle ? 0.25 : 0, color: C.slate }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography sx={{ fontSize: 13, color: C.grayBlue }}>{subtitle}</Typography>
                )}
            </Box>
            {action && <Box>{action}</Box>}
        </Box>
    );
}