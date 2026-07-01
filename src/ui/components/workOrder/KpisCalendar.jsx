import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography
} from '@mui/material';
import {
    Description as FileIcon,
    CheckCircle as CheckIcon,
    HourglassEmpty as PendingIcon,
    ErrorOutline as OverdueIcon
} from "@mui/icons-material";
import { C } from "./../../../theme/variables";

export default function KpisCalendar ({ total = 0, completed = 0, pending = 0, overdue = 0 }) {

    const percentOf = (value) => (total === 0 ? 0 : Math.round((value / total) * 100));

    const METRICS = [
        {
            label: "Total OTs",
            value: total,
            sub: "",
            icon: <FileIcon />,
            color: C.teal500,
            bg: C.teal50
        },
        {
            label: "Completadas",
            value: completed,
            sub: `${percentOf(completed)}% del total`,
            icon: <CheckIcon />,
            color: C.success,
            bg: C.successBg
        },
        {
            label: "Pendientes",
            value: pending,
            sub: `${percentOf(pending)}% del total`,
            icon: <PendingIcon />,
            color: C.warning,
            bg: C.warningBg
        },
        {
            label: "Vencidas",
            value: overdue,
            sub: overdue > 0 ? "Requiere atención" : "",
            icon: <OverdueIcon />,
            color: C.danger,
            bg: C.dangerBg
        },
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