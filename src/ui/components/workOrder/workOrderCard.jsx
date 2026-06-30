import { useState, useEffect, useRef } from "react";
import {
  Box, Typography, Chip, Button, Collapse,
  TextField, Stack,
} from "@mui/material";
import {
  PlayArrow as PlayIcon,
  PauseCircleOutline as PauseIcon,
  CheckCircleOutline as CheckIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  CameraAlt as CameraIcon,
  Draw as SignIcon,
} from "@mui/icons-material";
import { C, STATUS_WO } from "./../../../theme/variables";

// ─── Helpers ──────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");

function formatElapsed(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ─── Config de estado ─────────────────────────────────────────────────────

const STATUS_CONFIG = {
  [STATUS_WO.Abierta]: {
    borderColor: C.midGray,
    badge: { bgcolor: C.offWhite, color: C.darkGray, border: C.lightGray },
    label: "Abierta",
  },
  [STATUS_WO.Proceso]: {
    borderColor: C.info,
    badge: { bgcolor: C.infoBg, color: C.infoText, border: "transparent" },
    label: "En proceso",
  },
  [STATUS_WO.Pendiente]: {
    borderColor: C.warning,
    badge: { bgcolor: C.warningBg, color: C.warningText, border: "transparent" },
    label: "En espera",
  },
  [STATUS_WO.Cerrada]: {
    borderColor: C.success,
    badge: { bgcolor: C.successBg, color: C.successText, border: "transparent" },
    label: "Cerrada",
  },
  [STATUS_WO.Cancelada]: {
    borderColor: C.danger,
    badge: { bgcolor: C.dangerBg, color: C.dangerText, border: "transparent" },
    label: "Cancelada",
  },
};

const PRIORIDAD_CONFIG = {
  Alta:  { bgcolor: C.dangerBg,  color: C.dangerText  },
  Media: { bgcolor: C.warningBg, color: C.warningText },
  Baja:  { bgcolor: C.successBg, color: C.successText },
};

// ─── Sub-componentes ───────────────────────────────────────────────────────

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
      }}
    />
  );
}

function PrioridadBadge({ prioridad }) {
  const cfg = PRIORIDAD_CONFIG[prioridad] ?? PRIORIDAD_CONFIG.Media;
  return (
    <Chip
      size="small"
      label={prioridad}
      sx={{ bgcolor: cfg.bgcolor, color: cfg.color, fontSize: 11, fontWeight: 500, height: 22 }}
    />
  );
}

function InfoField({ label, value, valueColor }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11, color: C.midGray }}>{label}</Typography>
      <Typography sx={{ fontSize: 13, color: valueColor ?? C.darkGray, mt: 0.25 }}>
        {value ?? "—"}
      </Typography>
    </Box>
  );
}

// ─── Timer ─────────────────────────────────────────────────────────────────

function ElapsedTimer({ startedAt }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startedAt) return;
    const base = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    setElapsed(base);
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <Typography sx={{ fontSize: 11, color: C.infoText, fontVariantNumeric: "tabular-nums" }}>
      {formatElapsed(elapsed)}
    </Typography>
  );
}

// ─── Panel de acción ───────────────────────────────────────────────────────

function ActionPanel({ type, onConfirm, onCancel }) {
  const [motivo,      setMotivo]      = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [motivoError, setMotivoError] = useState(false);
  const [diagError,   setDiagError]   = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  const handleConfirm = () => {
    if (type === "espera") {
      if (motivo.trim().length < 10) { setMotivoError(true); return; }
      onConfirm({ motivo });
    } else if (type === "end") {
      if (diagnostico.trim().length < 20) { setDiagError(true); return; }
      onConfirm({ diagnostico });
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
    espera: {
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
            value={motivo}
            onChange={(e) => {
              setMotivo(e.target.value.slice(0, 300));
              if (e.target.value.trim().length >= 10) setMotivoError(false);
            }}
            error={motivoError}
            helperText={
              motivoError
                ? "El motivo es requerido (mínimo 10 caracteres)."
                : `${motivo.length} / 300`
            }
            size="small"
          />
        </Box>
      ),
      confirmLabel: "Confirmar espera",
      confirmSx: { bgcolor: C.warning, color: C.white, "&:hover": { bgcolor: "#d97706" } },
    },
    reanudar: {
      icon: <PlayIcon sx={{ fontSize: 15, color: C.infoText }} />,
      title: "Reanudar orden de trabajo",
      body: (
        <Typography sx={{ fontSize: 12, color: C.midGray, lineHeight: 1.6 }}>
          La OT regresará a{" "}
          <Box component="span" sx={{ fontWeight: 500, color: C.darkGray }}>En proceso</Box>{" "}
          y se registrará la hora de reanudación.
        </Typography>
      ),
      confirmLabel: "Confirmar reanudación",
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
              value={diagnostico}
              onChange={(e) => {
                setDiagnostico(e.target.value.slice(0, 500));
                if (e.target.value.trim().length >= 20) setDiagError(false);
              }}
              error={diagError}
              helperText={
                diagError
                  ? "El diagnóstico es requerido (mínimo 20 caracteres)."
                  : `${diagnostico.length} / 500`
              }
              size="small"
            />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, color: C.midGray, mb: 0.5 }}>
              Evidencia fotográfica
            </Typography>
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1,
              border: `0.5px dashed ${C.midGray}`, borderRadius: 1.5,
              px: 1.5, py: 1, cursor: "pointer",
              bgcolor: C.white, color: C.midGray, fontSize: 12,
            }}>
              <CameraIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 12, color: C.midGray }}>
                Tomar foto o seleccionar archivo
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 11, color: C.midGray, mt: 0.5 }}>
              JPG, PNG o PDF · Máx. 10 MB por archivo
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 11, color: C.midGray, mb: 0.5 }}>
              Firma del responsable del hospital
            </Typography>
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1,
              border: `0.5px dashed ${C.midGray}`, borderRadius: 1.5,
              px: 1.5, py: 1, cursor: "pointer",
              bgcolor: C.white, color: C.midGray,
            }}>
              <SignIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 12, color: C.midGray }}>
                Adjuntar firma o constancia de conformidad
              </Typography>
            </Box>
          </Box>
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
      bgcolor: C.offWhite,
      px: 2, py: 1.75,
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
          sx={{
            color: C.midGray, fontSize: 12, textTransform: "none",
            border: `0.5px solid ${C.lightGray}`,
            "&:hover": { bgcolor: C.lightGray },
          }}
        >
          Cancelar
        </Button>
        <Button
          size="small"
          onClick={handleConfirm}
          sx={{
            fontSize: 12, textTransform: "none",
            boxShadow: "none", px: 2,
            ...cfg.confirmSx,
          }}
        >
          {cfg.confirmLabel}
        </Button>
      </Box>
    </Box>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────

/**
 * OTCard — Card de Orden de Trabajo para vista de campo.
 *
 * @param {Object}   props
 * @param {Object}   props.ot           - Documento OT populado
 * @param {Function} props.onIniciar    - (id) => void
 * @param {Function} props.onEspera     - (id, { motivo }) => void
 * @param {Function} props.onReanudar   - (id) => void
 * @param {Function} props.onFinalizar  - (id, { diagnostico }) => void
 * @param {Function} props.onVerDetalle - (id) => void
 * @param {Function} props.onDescargar  - (id) => void
 */
export default function WorkOrderCard({
  ot,
  onIniciar,
  onEspera,
  onReanudar,
  onFinalizar,
  onVerDetalle,
  onDescargar,
}) {
  const [activePanel, setActivePanel] = useState(null); // 'start'|'espera'|'end'|'reanudar'|null

  if (!ot) return null;

  const {
    _id, folio, status, prioridad, tipoServicio,
    hospital, equipo, tecnico, solicitud,
    descripcion, startedAt, waitSince, closedAt,
    diagnostico: diagFinal, motivoEspera,
  } = ot;

  const cfg = STATUS_CONFIG[status];

  const togglePanel = (type) =>
    setActivePanel((prev) => (prev === type ? null : type));

  const handleConfirm = (type) => (payload) => {
    setActivePanel(null);
    switch (type) {
      case "start":    onIniciar?.(_id);                  break;
      case "espera":   onEspera?.(_id, payload);          break;
      case "reanudar": onReanudar?.(_id);                 break;
      case "end":      onFinalizar?.(_id, payload);       break;
    }
  };

  return (
    <Box sx={{
      bgcolor: C.white,
      border: `0.5px solid ${C.lightGray}`,
      borderLeft: `3px solid ${cfg?.borderColor ?? C.midGray}`,
      borderRadius: 2,
      overflow: "hidden",
    }}>

      {/* ── Cuerpo de la card ── */}
      <Box sx={{ px: 2, py: 1.75 }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5, mb: 1.25 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: C.black, mb: 0.75 }}>
              {folio}
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              <StatusBadge status={status} />
              <PrioridadBadge prioridad={prioridad} />
              {tipoServicio && (
                <Chip
                  size="small"
                  label={tipoServicio}
                  sx={{ bgcolor: C.offWhite, color: C.darkGray, border: `0.5px solid ${C.lightGray}`, fontSize: 11, height: 22 }}
                />
              )}
            </Stack>
          </Box>

          {/* Fecha / timer según estado */}
          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            {status === STATUS_WO.EN_PROCESO && startedAt && (
              <>
                <Typography sx={{ fontSize: 11, color: C.midGray }}>Iniciada</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.infoText }}>
                  {formatDate(startedAt)}
                </Typography>
                <ElapsedTimer startedAt={startedAt} />
              </>
            )}
            {status === STATUS_WO.EN_ESPERA && waitSince && (
              <>
                <Typography sx={{ fontSize: 11, color: C.midGray }}>En espera desde</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.warningText }}>
                  {formatDate(waitSince)}
                </Typography>
              </>
            )}
            {status === STATUS_WO.CERRADA && closedAt && (
              <>
                <Typography sx={{ fontSize: 11, color: C.midGray }}>Cerrada</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.successText }}>
                  {formatDate(closedAt)}
                </Typography>
              </>
            )}
            {status === STATUS_WO.ABIERTA && ot.fechaProgramada && (
              <>
                <Typography sx={{ fontSize: 11, color: C.midGray }}>Programada</Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.darkGray }}>
                  {formatDate(ot.fechaProgramada)}
                </Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Info grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", mb: 1.25 }}>
          <InfoField label="Hospital" value={hospital?.nombre} />
          <InfoField label="Equipo"   value={equipo?.nombre}   />
          <InfoField label="Técnico"  value={tecnico?.nombre}  />
          {solicitud?.folio && (
            <InfoField label="Solicitud origen" value={solicitud.folio} valueColor={C.infoText} />
          )}
        </Box>

        {/* Descripción */}
        {descripcion && (
          <Box sx={{
            bgcolor: C.offWhite, borderRadius: 1.5,
            px: 1.5, py: 1, mb: 1.5,
          }}>
            <Typography sx={{ fontSize: 12, color: C.midGray, lineHeight: 1.5 }}>
              {descripcion}
            </Typography>
          </Box>
        )}

        {/* Nota de espera */}
        {/* {status === STATUS_WO.EN_ESPERA && motivoEspera && ( */}
          <Box sx={{
            bgcolor: C.warningBg,
            borderLeft: `2px solid ${C.warning}`,
            borderRadius: "0 8px 8px 0",
            px: 1.25, py: 1, mb: 1.5,
          }}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: C.warningText, mb: 0.25 }}>
              Motivo de espera
            </Typography>
            <Typography sx={{ fontSize: 12, color: C.warningText, lineHeight: 1.5 }}>
              {motivoEspera}
            </Typography>
          </Box>
        {/* )} */}

        {/* Diagnóstico (cerrada) */}
        {status === STATUS_WO.CERRADA && diagFinal && (
          <Box sx={{
            bgcolor: C.successBg,
            borderLeft: `2px solid ${C.success}`,
            borderRadius: "0 8px 8px 0",
            px: 1.25, py: 1, mb: 1.5,
          }}>
            <Typography sx={{ fontSize: 11, fontWeight: 500, color: C.successText, mb: 0.25 }}>
              Diagnóstico
            </Typography>
            <Typography sx={{ fontSize: 12, color: C.successText, lineHeight: 1.5 }}>
              {diagFinal}
            </Typography>
          </Box>
        )}

        {/* Acciones */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {/* {status === STATUS_WO.Abierta && ( */}
            <>
              <Button size="small" startIcon={<PlayIcon />}
                onClick={() => togglePanel("start")}
                sx={{ bgcolor: C.black, color: C.white, fontSize: 12, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: C.darkGray, boxShadow: "none" } }}>
                Iniciar
              </Button>
              <Button size="small" startIcon={<PauseIcon />}
                onClick={() => togglePanel("espera")}
                sx={{ bgcolor: C.warningBg, color: C.warningText, border: `0.5px solid ${C.warning}`, fontSize: 12, textTransform: "none" }}>
                En espera
              </Button>
            </>
        {/* )} */}
          {/* {status === STATUS_WO.Proceso && ( */}
            <>
              <Button size="small" startIcon={<CheckIcon />}
                onClick={() => togglePanel("end")}
                sx={{ bgcolor: C.successBg, color: C.successText, border: `0.5px solid ${C.success}`, fontSize: 12, textTransform: "none" }}>
                Finalizar
              </Button>
              <Button size="small" startIcon={<PauseIcon />}
                onClick={() => togglePanel("espera")}
                sx={{ bgcolor: C.warningBg, color: C.warningText, border: `0.5px solid ${C.warning}`, fontSize: 12, textTransform: "none" }}>
                En espera
              </Button>
            </>
        {/* )} */}
          {/* {status === STATUS_WO.EN_ESPERA && ( */}
            <Button size="small" startIcon={<PlayIcon />}
              onClick={() => togglePanel("reanudar")}
              sx={{ bgcolor: C.black, color: C.white, fontSize: 12, textTransform: "none", boxShadow: "none", "&:hover": { bgcolor: C.darkGray, boxShadow: "none" } }}>
              Reanudar
            </Button>
            {/* )} */}
          <Button size="small" startIcon={<ViewIcon />}
            onClick={() => onVerDetalle?.(_id)}
            sx={{ color: C.midGray, fontSize: 12, textTransform: "none", border: `0.5px solid ${C.lightGray}` }}>
            Ver detalle
          </Button>
          {/* {status === STATUS_WO.CERRADA && ( */}
            <Button size="small" startIcon={<DownloadIcon />}
              onClick={() => onDescargar?.(_id)}
              sx={{ color: C.midGray, fontSize: 12, textTransform: "none", border: `0.5px solid ${C.lightGray}` }}>
              Reporte
            </Button>
          {/* )} */}
        </Stack>
      </Box>

      {/* ── Panel de acción ── */}
      <Collapse in={!!activePanel} unmountOnExit>
        {activePanel && (
          <ActionPanel
            type={activePanel}
            onConfirm={handleConfirm(activePanel)}
            onCancel={() => setActivePanel(null)}
          />
        )}
      </Collapse>
    </Box>
  );
}