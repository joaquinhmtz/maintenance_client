import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box, Typography, Chip, Button, Divider,
    Paper, Stack, Tooltip,
} from "@mui/material";
import {
    Edit as EditIcon,
    CalendarMonth as CalendarIcon,
    Assignment as OTIcon,
    LocalHospital as HospitalIcon,
    MedicalServices as EquipoIcon,
    Timeline as TimelineIcon,
    InfoOutlined as MetaIcon,
    ArrowBack as BackIcon,
} from "@mui/icons-material";
import { C, PRIORITIES_LABEL } from "../../theme/variables";
import requestServices from "../../services/request";
import useNotification from "./../../../hooks/useNotification";

// ─── Sub-componentes ───────────────────────────────────────────────────────

/** Fila de campo de solo lectura */
function FieldRO({ label, children }) {
    return (
        <Box>
            <Typography sx={{ fontSize: 11, color: C.midGray, mb: 0.5 }}>
                {label}
            </Typography>
            <Typography sx={{ fontSize: 13, color: C.darkGray, fontWeight: 400 }}>
                {children}
            </Typography>
        </Box>
    );
}

/** Card con título e ícono */
function SectionCard({ icon, title, children, sx }) {
    return (
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 2,
                borderColor: C.lightGray,
                overflow: "hidden",
                ...sx,
            }}
        >
            <Box
                sx={{
                    px: 2, py: 1.5,
                    display: "flex", alignItems: "center", gap: 1,
                    borderBottom: `0.5px solid ${C.lightGray}`,
                }}
            >
                <Box sx={{ color: C.midGray, display: "flex", fontSize: 16 }}>{icon}</Box>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.darkGray }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ p: 2 }}>{children}</Box>
        </Paper>
    );
}

/** Pill de prioridad */
function PrioridadChip({ prioridad }) {
    const map = {
        Alta: { bgcolor: C.dangerBg, color: C.dangerText, dot: C.danger },
        Media: { bgcolor: C.warningBg, color: C.warningText, dot: C.warning },
        Baja: { bgcolor: C.successBg, color: C.successText, dot: C.success },
    };
    const s = map[prioridad] ?? map.Media;
    return (
        <Chip
            component="span"
            size="small"
            label={prioridad}
            icon={
                <Box
                    component="span"
                    sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: s.dot, ml: "6px !important" }}
                />
            }
            sx={{ bgcolor: s.bgcolor, color: s.color, fontWeight: 500, fontSize: 11, height: 22 }}
        />
    );
}

/** Pill de estado */
function StatusChip({ status }) {
    const map = {
        Nueva: { bgcolor: C.offWhite, color: C.darkGray, border: C.lightGray },
        Programada: { bgcolor: C.infoBg, color: C.infoText, border: "transparent" },
        Convertida: { bgcolor: C.successBg, color: C.successText, border: "transparent" },
        Cancelada: { bgcolor: C.dangerBg, color: C.dangerText, border: "transparent" },
    };
    const s = map[status] ?? map.Nueva;
    return (
        <Chip
            size="small"
            label={status}
            sx={{
                bgcolor: s.bgcolor, color: s.color,
                fontWeight: 500, fontSize: 11, height: 22,
                border: `0.5px solid ${s.border}`,
            }}
        />
    );
}

/** Entrada del timeline */
function TimelineItem({ event, isLast }) {

    const dotColors = {
        Nueva: C.slate,
        prioridad: C.danger,
        revision: C.midGray,
        programada: C.warning,
        Cancelada: C.danger,
        regreso: C.midGray,
        convertida: C.success,
        default: C.midGray,
    };
    
    const dotColor = dotColors[event.status] ?? dotColors.default;

    return (
        <Box sx={{ display: "flex", gap: 1.5, pb: isLast ? 0 : 2, position: "relative" }}>
            {/* línea vertical */}
            {!isLast && (
                <Box sx={{
                    position: "absolute",
                    left: 6, top: 14,
                    width: "0.5px",
                    height: "100%",
                    bgcolor: C.lightGray,
                }} />
            )}

            {/* dot */}
            <Box sx={{
                width: 13, height: 13, borderRadius: "50%",
                bgcolor: dotColor, flexShrink: 0,
                border: `2px solid ${C.white}`,
                outline: `1px solid ${dotColor}20`,
                mt: "2px",
                zIndex: 1,
            }} />

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.darkGray, lineHeight: 1.4 }}>
                    {event.note}
                    {event.chip && (
                        <Box component="span" sx={{ ml: 0.75, verticalAlign: "middle" }}>
                            <StatusChip status={event.chip} />
                        </Box>
                    )}
                    {event.priChip && (
                        <Box component="span" sx={{ ml: 0.75, verticalAlign: "middle" }}>
                            <PrioridadChip prioridad={event.priChip} />
                        </Box>
                    )}
                </Typography>
                <Typography sx={{ fontSize: 11, color: C.midGray, mt: 0.25 }}>
                    {new Date(event?.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                </Typography>
                <Typography sx={{ fontSize: 11, color: C.midGray, mt: 0.25 }}>
                    {event?.changedBy?.fullname}
                </Typography>

                {/* {event.note && (
                    <Box sx={{
                        mt: 0.75, px: 1.25, py: 0.75,
                        bgcolor: C.offWhite,
                        borderLeft: `2px solid ${C.lightGray}`,
                        borderRadius: "0 6px 6px 0",
                    }}>
                        <Typography sx={{ fontSize: 12, color: C.darkGray, lineHeight: 1.5 }}>
                            {event.note}
                        </Typography>
                    </Box>
                )} */}
            </Box>
        </Box>
    );
}

// ─── Componente principal ──────────────────────────────────────────────────

/**
 * SolicitudDetail
 *
 * @param {Object}   props
 * @param {Object}   props.solicitud   - Documento de solicitud (populado)
 * @param {Function} props.onEdit      - Callback botón Editar
 * @param {Function} props.onProgramar - Callback botón Programar
 * @param {Function} props.onCrearOT   - Callback botón Crear OT
 * @param {Function} props.onBack      - Callback botón Volver
 */
export default function RequestDetail() {

    const navigate = useNavigate();
    const { id } = useParams();
    const { notification, showSuccess, showError, closeNotification } = useNotification();

    const [request, setRequest] = useState({ statusHistory:[] });
    const [workOrder, setWorkOrder] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadRequest();
        }
    }, [id]);

    const loadRequest = async () => {
        try {
            setLoading(true);
            const response = await requestServices.getReqById(id);
            const item = response?.data?.request;
            if (!item) throw new Error("Solicitud no encontrada");

            setRequest(response?.data?.request);
        } catch (err) {
            console.error("Error al cargar la solicitud:", err);
            showError("No se pudo cargar la información de la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box sx={{ bgcolor: C.offWhite, minHeight: "100vh", p: { xs: 2, md: 3 } }}>

                {/* ── Topbar ── */}
                <Box sx={{
                    display: "flex", alignItems: "flex-start",
                    justifyContent: "space-between", gap: 2, mb: 2.5,
                    flexWrap: "wrap",
                }}>
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                            <Tooltip title="Volver">
                                <Button
                                    size="small"
                                    startIcon={<BackIcon />}
                                    onClick={()=>navigate("/requests")}
                                    sx={{ color: C.midGray, minWidth: 0, p: 0.5, mr: 0.5 }}
                                />
                            </Tooltip>
                            <Typography sx={{ fontSize: 24, fontWeight: 500, color: C.black }}>
                                {request?.folio}
                            </Typography>
                            <PrioridadChip prioridad={PRIORITIES_LABEL[request?.priority]} />
                            <StatusChip status={request?.status} />
                        </Box>
                        <Typography sx={{ fontSize: 12, color: C.midGray }}>
                            Creada el {new Date(request?.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}
                            {request?.hospital?.name ? ` · ${request?.hospital?.name}` : ""}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {request?.status === 'Nueva' && (
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={()=>navigate(`/requests/edit/${request._id}`)}
                                sx={{
                                    borderColor: C.lightGray, color: C.darkGray,
                                    fontSize: 12, textTransform: "none",
                                    "&:hover": { borderColor: C.darkGray, bgcolor: "transparent" },
                                }}
                            >
                                Editar
                            </Button>
                        )}
                        {request?.status === 'Nueva' && (
                            <Button
                                color="secondary"
                                size="small"
                                variant="contained"
                                startIcon={<CalendarIcon />}
                                // onClick={onProgramar}
                            >
                                Programar
                            </Button>
                        )}
                        {/* {canCrearOT && (
                            <Button
                                size="small"
                                variant="contained"
                                startIcon={<OTIcon />}
                                onClick={onCrearOT}
                                sx={{
                                    bgcolor: C.black, color: C.white,
                                    fontSize: 12, textTransform: "none", boxShadow: "none",
                                    "&:hover": { bgcolor: C.darkGray, boxShadow: "none" },
                                }}
                            >
                                Crear OT
                            </Button>
                        )} */}
                    </Stack>
                </Box>

                {/* ── Layout ── */}
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 280px" }, gap: 1.75 }}>

                    {/* Columna izquierda */}
                    <Stack spacing={1.75}>

                        {/* Hospital */}
                        <SectionCard icon={<HospitalIcon fontSize="small" />} title="Información del hospital">
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                                <FieldRO label="Hospital">{request?.hospital?.name ?? "—"}</FieldRO>
                            </Box>
                        </SectionCard>

                        {/* Equipo */}
                        <SectionCard icon={<EquipoIcon fontSize="small" />} title="Equipo">
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
                                <FieldRO label="Equipo">{request?.item?.name ?? "—"}</FieldRO>
                                {/* <FieldRO label="Marca">{request?.item?.brand ?? "—"}</FieldRO>
                                <FieldRO label="Modelo">{request?.item?.model ?? "—"}</FieldRO> */}
                                <FieldRO label="Serie">{request?.item?.serie ?? "—"}</FieldRO>
                                <FieldRO label="Tipo de servicio">
                                    <Chip
                                        component="span"
                                        size="small"
                                        label={request?.typeService?.name}
                                        sx={{ bgcolor: C.offWhite, color: C.darkGray, fontSize: 11, height: 22, border: `0.5px solid ${C.lightGray}` }}
                                    />
                                </FieldRO>
                                <FieldRO label="Prioridad">
                                    <PrioridadChip prioridad={PRIORITIES_LABEL[request?.priority]} />
                                </FieldRO>
                            </Box>
                        </SectionCard>

                        {/* Descripción */}
                        <SectionCard icon={<MetaIcon fontSize="small" />} title="Descripción del problema">
                            <Box sx={{
                                bgcolor: C.offWhite,
                                border: `0.5px solid ${C.lightGray}`,
                                borderRadius: 1.5, p: 1.5,
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.darkGray, lineHeight: 1.7 }}>
                                    {request?.description}
                                </Typography>
                            </Box>
                        </SectionCard>

                    </Stack>

                    {/* Columna derecha */}
                    <Stack spacing={1.75}>

                        {/* Metadatos */}
                        <SectionCard icon={<MetaIcon fontSize="small" />} title="Metadatos">
                            {[
                                { label: "Folio", value: request?.folio },
                                { label: "Creado por", value: request?.userCreated?.fullname ?? "—" },
                                {
                                    label: "Fecha creación",
                                    value: new Date(request?.createdAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
                                },
                                {
                                    label: "Última actualización",
                                    value: new Date(request?.updatedAt).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" }),
                                },
                            ].map(({ label, value }, i, arr) => (
                                <Box key={label}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75 }}>
                                        <Typography sx={{ fontSize: 12, color: C.midGray }}>{label}</Typography>
                                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: C.darkGray, textAlign: "right", maxWidth: "55%" }}>
                                            {value}
                                        </Typography>
                                    </Box>
                                    {i < arr.length - 1 && <Divider sx={{ borderColor: C.lightGray }} />}
                                </Box>
                            ))}
                            <Divider sx={{ borderColor: C.lightGray }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75 }}>
                                <Typography sx={{ fontSize: 12, color: C.midGray }}>Estado actual</Typography>
                                <StatusChip status={request?.status} />
                            </Box>
                            <Divider sx={{ borderColor: C.lightGray }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.75 }}>
                                <Typography sx={{ fontSize: 12, color: C.midGray }}>OT generada</Typography>
                                {workOrder ? (
                                    <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.infoText }}>
                                        {workOrder.folio || '-'}
                                    </Typography>
                                ) : (
                                    <Typography sx={{ fontSize: 12, color: C.midGray }}>—</Typography>
                                )}
                            </Box>
                        </SectionCard>

                        {/* Timeline */}
                        <SectionCard icon={<TimelineIcon fontSize="small" />} title="Timeline">
                            {request?.statusHistory.length === 0 ? (
                                <Typography sx={{ fontSize: 12, color: C.midGray }}>Sin movimientos registrados.</Typography>
                            ) : (
                                request?.statusHistory.map((event, i) => (
                                    <TimelineItem
                                        key={event._id ?? i}
                                        event={event}
                                        isLast={i === request?.statusHistory.length - 1}
                                    />
                                ))
                            )}
                        </SectionCard>

                    </Stack>
                </Box>
            </Box>
        </>
    );
}