import { useState, useRef, useEffect } from "react";
import {
    Typography,
    Box,
    TextField,
    Button,
    Stack
} from "@mui/material";
import {
    PlayArrow as PlayIcon,
    PauseCircleOutline as PauseIcon,
    CheckCircleOutline as CheckIcon,
} from "@mui/icons-material";
import { C } from "./../../../theme/variables";
import FileUploadZone from "../common/FileUploadZone";

/**
 * @param {Object}   props
 * @param {string}   props.type        - "start" | "waiting" | "resume" | "end"
 * @param {Function} props.onConfirm   - (payload) => void
 * @param {Function} props.onCancel    - () => void
 * @param {string}   props.otId        - _id de la orden de trabajo (requerido para subir evidencias en "end")
 */
export default function ActionWorkOrder({ type, onConfirm, onCancel, otId }) {
    console.log("ActionWorkOrder:::otId:::", otId)

    const [descriptionWaiting, setDescriptionWaiting] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [waitingDescError, setWaitingDescError] = useState(false);
    const [diagError, setDiagError] = useState(false);
    const [evidencias, setEvidencias] = useState([]);
    const textareaRef = useRef(null);

    useEffect(() => {
        setTimeout(() => textareaRef.current?.focus(), 50);
    }, []);

    const handleConfirm = () => {
        if (type === "waiting") {
            if (descriptionWaiting.trim().length < 10) { setWaitingDescError(true); return; }
            onConfirm({ descriptionWaiting });
        } else if (type === "end") {
            if (diagnosis.trim().length < 20) { setDiagError(true); return; }
            // Se envían los _id de las evidencias ya subidas al servidor
            onConfirm({ diagnosis, evidencias: evidencias.map((e) => e._id) });
        } else {
            onConfirm({});
        }
    };

    const panelConfig = {
        start: {
            icon: <PlayIcon sx={{ fontSize: 15, color: C.infoText }} />,
            title: "Iniciar orden de trabajo",
            body: (
                <Typography sx={{ fontSize: 12, color: C.midGray, lineHeight: 1.6 }}>
                    Al iniciar, la OT cambiará a{" "}
                    <Box component="span" sx={{ fontWeight: 500, color: C.darkGray }}>En proceso</Box>{" "}
                    y se registrará tu hora de entrada. Asegúrate de estar en el sitio antes de confirmar.
                </Typography>
            ),
            confirmLabel: "Confirmar inicio",
            confirmSx: { bgcolor: C.black, color: C.white, "&:hover": { bgcolor: C.darkGray } },
        },
        waiting: {
            icon: <PauseIcon sx={{ fontSize: 15, color: C.warningText }} />,
            title: "Poner en espera",
            body: (
                <Box>
                    <Typography sx={{ fontSize: 11, color: C.midGray, mb: 0.5 }}>
                        Motivo de espera <Box component="span" sx={{ color: C.dangerText }}>*</Box>
                    </Typography>
                    <TextField
                        inputRef={textareaRef}
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Ej: Esperando refacción, pendiente de autorización del hospital..."
                        value={descriptionWaiting}
                        onChange={(e) => {
                            setDescriptionWaiting(e.target.value.slice(0, 300));
                            if (e.target.value.trim().length >= 10) setWaitingDescError(false);
                        }}
                        error={waitingDescError}
                        helperText={
                            waitingDescError
                                ? "El motivo es requerido (mínimo 10 caracteres)."
                                : `${descriptionWaiting.length} / 300`
                        }
                        size="small"
                    />
                </Box>
            ),
            confirmLabel: "Confirmar espera",
            confirmSx: { bgcolor: C.warning, color: C.white, "&:hover": { bgcolor: "#d97706" } },
        },
        resume: {
            icon: <PlayIcon sx={{ fontSize: 15, color: C.infoText }} />,
            title: "Reanudar orden de trabajo",
            body: (
                <Typography sx={{ fontSize: 12, color: C.midGray, lineHeight: 1.6 }}>
                    La OT regresará a{" "}
                    <Box component="span" sx={{ fontWeight: 500, color: C.darkGray }}>En proceso</Box>{" "}
                    y se registrará la hora de reanudación.
                </Typography>
            ),
            confirmLabel: "Confirmar",
            confirmSx: { bgcolor: C.black, color: C.white, "&:hover": { bgcolor: C.darkGray } },
        },
        end: {
            icon: <CheckIcon sx={{ fontSize: 15, color: C.successText }} />,
            title: "Finalizar orden de trabajo",
            body: (
                <Stack spacing={1.5}>
                    <Box>
                        <Typography sx={{ fontSize: 11, color: C.midGray, mb: 0.5 }}>
                            Diagnóstico / actividades realizadas{" "}
                            <Box component="span" sx={{ color: C.dangerText }}>*</Box>
                        </Typography>
                        <TextField
                            inputRef={textareaRef}
                            multiline
                            rows={4}
                            fullWidth
                            placeholder="Describe las actividades realizadas, fallas encontradas y solución aplicada..."
                            value={diagnosis}
                            onChange={(e) => {
                                setDiagnosis(e.target.value.slice(0, 500));
                                if (e.target.value.trim().length >= 20) setDiagError(false);
                            }}
                            error={diagError}
                            helperText={
                                diagError
                                    ? "El diagnóstico es requerido (mínimo 20 caracteres)."
                                    : `${diagnosis.length} / 500`
                            }
                            size="small"
                        />
                    </Box>

                    {/* ── Subida de evidencia fotográfica ── */}
                    <FileUploadZone
                        label="Evidencia fotográfica"
                        module="workOrders"
                        referencesId={otId}
                        category="evidence"
                        multiple
                        capture
                        onUploaded={(files) => setEvidencias(files)}
                    />
                </Stack>
            ),
            confirmLabel: "Cerrar orden",
            confirmSx: { bgcolor: C.success, color: C.white, "&:hover": { bgcolor: "#16a34a" } },
        },
    };

    const cfg = panelConfig[type];
    if (!cfg) return null;

    return (
        <Box sx={{
            borderTop: `0.5px solid ${C.lightGray}`,
            py: 1.75,
            mt: 1.5
        }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1.25 }}>
                {cfg.icon}
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.darkGray }}>
                    {cfg.title}
                </Typography>
            </Box>

            <Box sx={{ borderTop: `0.5px solid ${C.lightGray}`, mb: 1.5 }} />

            {cfg.body}

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1.5 }}>
                <Button
                    size="small"
                    onClick={onCancel}
                    sx={{ color: C.midGray, fontSize: 12, textTransform: "none" }}
                >
                    Cancelar
                </Button>
                <Button
                    size="small"
                    onClick={handleConfirm}
                    sx={{ fontSize: 12, textTransform: "none", boxShadow: "none", px: 2, ...cfg.confirmSx }}
                >
                    {cfg.confirmLabel}
                </Button>
            </Box>
        </Box>
    );
}