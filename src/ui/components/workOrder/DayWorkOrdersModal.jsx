import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Stack,
    Button,
    Divider
} from "@mui/material";
import {
    Close as CloseIcon,
    LocalHospital as HospitalIcon,
    Person as PersonIcon,
    AccessTime as TimeIcon
} from "@mui/icons-material";
import ChipLabel from "./../common/ChipLabel";
import { isOverdue } from "./../../../../utils/calendar.helper";
import { C } from "./../../../theme/variables";

export default function DayWorkOrdersModal({
    open,
    onClose,
    date,
    orders = [],
    onViewDetail,
    onReschedule
}) {

    const formattedDate = date
        ? new Intl.DateTimeFormat("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date)
        : "";

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(a.start) - new Date(b.start)
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: 0.5 }}>
                <Box>
                    <Typography sx={{ fontSize: 16, fontWeight: 600, textTransform: "capitalize" }}>
                        {formattedDate}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: C.grayBlue }}>
                        {sortedOrders.length} orden{sortedOrders.length !== 1 ? "es" : ""} de trabajo programada{sortedOrders.length !== 1 ? "s" : ""}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {sortedOrders.length === 0 && (
                    <Typography sx={{ fontSize: 13, color: C.grayBlue, textAlign: "center", py: 3 }}>
                        No hay órdenes de trabajo programadas para este día.
                    </Typography>
                )}

                <Stack spacing={1.5}>
                    {sortedOrders.map((order) => {
                        const { folio, hospital, responsable, typeService, status } = order.extendedProps;
                        const defeated = isOverdue({ visitDate: order.start, status });

                        return (
                            <Box
                                key={order.id}
                                sx={{
                                    border: "1px solid",
                                    borderColor: defeated ? C.dangerBorder || C.danger : C.border || "#e0e0e0",
                                    bgcolor: defeated ? C.dangerBg : "transparent",
                                    borderRadius: 2,
                                    p: 1.5
                                }}
                            >
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                                            {folio}
                                        </Typography>
                                        <ChipLabel typeChip={"TYPE_SERVICES"} chip={typeService?.toUpperCase()} />
                                    </Stack>

                                    {defeated ? (
                                        <ChipLabel typeChip={"TYPE_SERVICES"} chip="VENCIDO" />
                                    ) : (
                                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: C.grayBlue }}>
                                            <ChipLabel typeChip={"STATUS_WORK_ORDERS"} chip={order?.status.toUpperCase()} />
                                        </Stack>
                                    )}
                                </Box>

                                <Stack spacing={0.5} sx={{ mb: 1.5 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <HospitalIcon sx={{ fontSize: 15, color: C.grayBlue }} />
                                        <Typography sx={{ fontSize: 13 }}>{hospital}</Typography>
                                    </Stack>
                                    {order?.extendedProps && order?.extendedProps.visitManager && (
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <PersonIcon sx={{ fontSize: 15, color: C.grayBlue }} />
                                            <Typography sx={{ fontSize: 13 }}>{order?.extendedProps.visitManager?.fullname}</Typography>
                                        </Stack>
                                    )}
                                </Stack>

                                <Divider sx={{ mb: 1.5 }} />

                                {/* <Stack direction="row" spacing={1}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => onViewDetail?.(order)}
                                    >
                                        Ver detalle
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        fullWidth
                                        onClick={() => onReschedule?.(order)}
                                    >
                                        Reprogramar
                                    </Button>
                                </Stack> */}
                            </Box>
                        );
                    })}
                </Stack>
            </DialogContent>
        </Dialog>
    );
}