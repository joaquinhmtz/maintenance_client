import {
    Box,
    Typography,
    Stack,
    Chip
} from "@mui/material";
import { C } from "./../../../theme/variables";
import { STATUS_CONFIG, PRIORITIES, PRIORITIES_LABEL, STATUS_WO } from "./../../../theme/configs/workOrderConfig";
import ToggleActionsWorkOrder from "./ToggleActionsWorkOrder";

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status];
    if (!cfg) return null;
    return (
        <Chip
            size="small"
            label={cfg.label}
            sx={{
                bgcolor: cfg.badge.bgcolor,
                color: cfg.badge.color,
                border: `0.5px solid ${cfg.badge.border}`,
                fontSize: 11, fontWeight: 500, height: 22,
                fontWeight: 600
            }}
        />
    );
}

function PriorityBadge({ priority }) {
    const cfg = PRIORITIES[priority];
    return (
        <Chip
            size="small"
            label={PRIORITIES_LABEL[priority]}
            sx={{ bgcolor: cfg.bgcolor, color: cfg.color, fontSize: 11, fontWeight: 500, height: 22 }}
        />
    );
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("es-MX", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function InfoField({ label, value, valueColor }) {
    return (
        <Box>
            <Typography sx={{ fontSize: 11, color: C.midGray }}>{label}</Typography>
            <Typography sx={{ fontSize: 13, color: valueColor ?? C.darkGray, mt: 0.25, fontWeight: 600 }}>
                {value ?? "—"}
            </Typography>
        </Box>
    );
}

export default function WOCard({
    order = null,
    handleRefresh
}) {
    const cfg = STATUS_CONFIG[order?.status];

    return (
        <>
            <Box sx={{
                bgcolor: C.white,
                border: `0.5px solid ${C.lightGray}`,
                borderLeft: `3px solid ${cfg?.borderColor ?? C.midGray}`,
                borderRadius: 1.3,
                overflow: "hidden",
            }}>

                {/* ── Cuerpo de la card ── */}
                <Box sx={{ px: 2, py: 1.75 }}>

                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, mb: 1.25 }}>
                        <Box>
                            <Typography sx={{ fontSize: 14, fontWeight: 600, color: C.black, mb: 0.75 }}>
                                {order?.folio}
                            </Typography>
                            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                                <StatusBadge status={order?.status} />
                                <PriorityBadge priority={order?.request?.priority} />
                                <Chip
                                    size="small"
                                    label={order?.typeService?.name}
                                    sx={{ bgcolor: C.offWhite, color: C.darkGray, border: `0.5px solid ${C.lightGray}`, fontSize: 11, height: 22 }}
                                />
                            </Stack>
                        </Box>

                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                            {order?.status === "Abierta" && (
                                <>
                                    <Typography sx={{ fontSize: 12, color: C.midGray }}>Programada</Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.darkGray }}>
                                        {/* el color de este texto deberá ir de acuerdo al color del estatus */}
                                        {formatDate(order?.visitDate)}
                                    </Typography>
                                </>
                            )}
                            {order?.status === "En proceso" && (
                                <>
                                    <Typography sx={{ fontSize: 11, color: C.midGray }}>Iniciada</Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.infoText }}>
                                        {formatDate(order?.initWorkOrder)}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.infoText }}>
                                        {new Date(order?.initWorkOrder).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                                    </Typography>
                                </>
                            )}
                            {order?.status === "Pendiente" && (
                                <>
                                    <Typography sx={{ fontSize: 11, color: C.midGray }}>En espera desde</Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.warningText }}>
                                        {formatDate(order?.initWaitingWorkOrder)}
                                    </Typography>
                                </>
                            )}
                            {order?.status === "Cerrada" && (
                                <>
                                    <Typography sx={{ fontSize: 11, color: C.midGray }}>Cerrada</Typography>
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.successText }}>
                                        {formatDate(order?.endWorkOrder)}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", mb: 1.25 }}>
                        <InfoField label="Hospital" value={order?.hospital?.name} />
                        <InfoField label="Equipo" value={order?.item?.name} />
                        <InfoField label="Resp. visita" value={order?.visitManager?.fullname} />
                        {order?.request?.folio && (
                            <InfoField label="Solicitud origen" value={order?.request?.folio} valueColor={C.info} />
                        )}
                    </Box>

                    {order?.status === "Abierta" && (
                        <Box sx={{
                            bgcolor: C.lightdark, borderRadius: 0.8,
                            px: 1.5, py: 1, mb: 1.5,
                        }}>
                            <Typography sx={{ fontSize: 12, color: C.midGray, lineHeight: 1.5 }}>
                                {order?.request?.description}
                            </Typography>
                        </Box>
                    )}
                    {order?.status === "Pendiente" && (
                        <Box sx={{
                            bgcolor: C.warningBg,
                            borderLeft: `2px solid ${C.warning}`,
                            borderRadius: "0 8px 8px 0",
                            px: 1.25, py: 1, mb: 1.5,
                        }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.warningText, mb: 0.25 }}>
                                Motivo de espera
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: C.warningText, lineHeight: 1.5 }}>
                                {order?.descriptionWaiting}
                            </Typography>
                        </Box>
                    )}
                    {order?.status === "Cerrada" && (
                        <Box sx={{
                            bgcolor: C.successBg,
                            borderLeft: `2px solid ${C.success}`,
                            borderRadius: "0 8px 8px 0",
                            px: 1.25, py: 1, mb: 1.5,
                        }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.successText, mb: 0.25 }}>
                                Diagnóstico
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: C.successText, lineHeight: 1.5 }}>
                                {order?.diagnosis}
                            </Typography>
                        </Box>
                    )}

                    <ToggleActionsWorkOrder
                        id={order?._id}
                        idReq={order?.request?._id}
                        status={order?.status}
                        refresh={handleRefresh}
                    />

                </Box>
            </Box>
        </>
    )
}