import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    AddCircle as AddIcon,
    CheckCircle as CheckIcon,
    Description as FileIcon
} from "@mui/icons-material";
import { C } from "./../../../theme/variables";

export default function GridMetricsReq() {

    const METRICS = [
        { label: "Total", value: "158", sub: "", icon: <FileIcon />, color: C.teal500, bg: C.teal50, trend: "+2 vs ayer" },
        { label: "Nuevas", value: "13", sub: "", icon: <AddIcon />, color: C.lav500, bg: C.lav50, trend: "+14 este mes" },
        { label: "Programadas", value: "33", sub: "", icon: <CalendarIcon />, color: C.info, bg: C.infoBg, trend: "+8% vs anterior" },
        { label: "Finalizadas", value: "7", sub: "", icon: <CheckIcon />, color: C.success, bg: C.successBg, trend: "Promedio 4.8★" },
    ];

    return (
        <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {METRICS.map((s, i) => (
                    <Grid item xs={12} sm={3} lg={3} key={i}>
                        <Card>
                            <CardContent sx={{ p: "15px 20px !important" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <Box>
                                        <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.grayBlue, mb: 0.5 }}>
                                            {s.label}
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                                            <Typography sx={{ fontSize: 28, fontWeight: 700, color: s.color, lineHeight: 1.1 }}>{s.value}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{
                                        width: 44, height: 44, borderRadius: "12px",
                                        bgcolor: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Box sx={{ color: s.color, display: "flex" }}>{s.icon}</Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    )
}