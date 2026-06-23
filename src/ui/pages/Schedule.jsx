import { useState, useCallback } from "react";
import {
  Box, Card, CardContent, Grid, Typography, Chip,
  IconButton, Button, TextField, Snackbar, Alert,
  Tooltip, Divider,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  AccessTime as TimeIcon,
  EventBusy as EventBusyIcon,
  CheckCircleOutline as CheckCircleIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "./../components/common/pageHeader";
import SectionLabel from "./../components/common/sectionLabel";
import { C } from "./../../theme/variables";

// ── Constantes ────────────────────────────────────────────────────
const DAYS = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 7, name: "Domingo" },
];

const MONTHS = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// ── Estado inicial ────────────────────────────────────────────────
const INITIAL_STATE = {
  activeDays: [1, 3, 5],
  blocks: {
    1: [{ id: 1, start: "10:00", end: "12:00" }, { id: 2, start: "13:00", end: "18:00" }],
    3: [{ id: 3, start: "10:00", end: "12:00" }],
    5: [{ id: 4, start: "15:00", end: "19:00" }],
  },
  nonWorkingDays: [
    { id: 1, date: "2025-12-25" },
    { id: 2, date: "2025-12-31" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────
let nextId = 20;
const uid = () => nextId++;

function formatDate(dateStr) {
  if (!dateStr) return "Sin fecha seleccionada";
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)} ${MONTHS[parseInt(m)]} ${y}`;
}

// ── Subcomponente: Pill de día ────────────────────────────────────
function DayPill({ day, active, onToggle }) {
  return (
    <Box
      onClick={() => onToggle(day.id)}
      role="checkbox"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={e => e.key === " " && onToggle(day.id)}
      sx={{
        display: "flex", alignItems: "center", gap: 0.75,
        px: 1.75, py: 0.75, borderRadius: 20, cursor: "pointer",
        border: `0.5px solid`,
        borderColor: active ? C.teal500 : "divider",
        bgcolor: active ? C.teal50 : "background.paper",
        userSelect: "none", transition: "all .15s",
        "&:hover": { borderColor: C.teal200, bgcolor: C.teal50 },
      }}
    >
      {/* Check box */}
      <Box sx={{
        width: 16, height: 16, borderRadius: "4px", flexShrink: 0,
        border: `0.5px solid`, display: "flex", alignItems: "center", justifyContent: "center",
        borderColor: active ? C.teal500 : "divider",
        bgcolor: active ? C.teal500 : "transparent",
        transition: "all .15s",
      }}>
        {active && <CheckIcon sx={{ fontSize: 11, color: "#fff" }} />}
      </Box>
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: active ? C.teal700 : "text.secondary" }}>
        {day.name}
      </Typography>
    </Box>
  );
}

// ── Subcomponente: Fila de bloque horario ─────────────────────────
function BlockRow({ block, dayId, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [start, setStart] = useState(block.start);
  const [end, setEnd]     = useState(block.end);

  const confirm = () => {
    onUpdate(dayId, block.id, start, end);
    setEditing(false);
  };

  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 1,
      px: 1.25, py: 0.875, borderRadius: 1.5,
      border: `0.5px solid`,
      borderColor: editing ? C.teal500 : "divider",
      bgcolor: editing ? C.teal50 : "background.paper",
      mb: 0.75, "&:last-child": { mb: 0 },
      "&:hover": { borderColor: C.teal200, bgcolor: C.teal50 },
      transition: "all .12s",
    }}>
      {editing ? (
        <>
          <TextField
            type="time" size="small" value={start}
            onChange={e => setStart(e.target.value)}
            inputProps={{ "aria-label": "Hora inicio" }}
            sx={{ flex: 1, "& input": { fontSize: 12, py: 0.5, px: 1 } }}
          />
          <Typography sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0 }}>→</Typography>
          <TextField
            type="time" size="small" value={end}
            onChange={e => setEnd(e.target.value)}
            inputProps={{ "aria-label": "Hora fin" }}
            sx={{ flex: 1, "& input": { fontSize: 12, py: 0.5, px: 1 } }}
          />
          <Tooltip title="Confirmar">
            <IconButton size="small" onClick={confirm} sx={{ bgcolor: C.teal500, color: "#fff", "&:hover": { bgcolor: C.teal700 }, width: 28, height: 28 }}>
              <CheckIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <TimeIcon sx={{ fontSize: 14, color: C.teal500, flexShrink: 0 }} />
          <Typography
            sx={{ flex: 1, fontSize: 13, fontWeight: 500, cursor: "pointer", "&:hover": { color: C.teal700 } }}
            onClick={() => setEditing(true)}
            title="Clic para editar"
          >
            {block.start} – {block.end}
          </Typography>
        </>
      )}
      <Tooltip title="Eliminar bloque">
        <IconButton
          size="small"
          onClick={() => onDelete(dayId, block.id)}
          sx={{
            flexShrink: 0,
            color: "text.secondary",
            "&:hover": { bgcolor: C.dangerBg, color: C.danger },
          }}
        >
          <DeleteIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ── Subcomponente: Tarjeta de día ─────────────────────────────────
function DayCard({ day, blocks, onAddBlock, onDeleteBlock, onUpdateBlock }) {
  return (
    <Box sx={{ border: `0.5px solid`, borderColor: "divider", borderRadius: 2, overflow: "hidden" }}>
      {/* Cabecera */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 1.5, py: 1, bgcolor: C.teal50,
        borderBottom: `0.5px solid ${C.teal200}`,
      }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: C.teal900 }}>
          {day.name}
        </Typography>
        <Button
          size="small"
          startIcon={<AddIcon sx={{ fontSize: "13px !important" }} />}
          onClick={() => onAddBlock(day.id)}
          sx={{
            borderRadius: 20, bgcolor: C.teal500, color: "#fff", fontSize: 11,
            px: 1.25, py: 0.4, minWidth: 0,
            "&:hover": { bgcolor: C.teal700 },
          }}
        >
          Bloque
        </Button>
      </Box>

      {/* Lista de bloques */}
      <Box sx={{ p: 1 }}>
        {blocks.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 2 }}>
            <TimeIcon sx={{ fontSize: 22, color: "text.disabled", display: "block", mx: "auto", mb: 0.5 }} />
            <Typography sx={{ fontSize: 12, color: "text.disabled" }}>Sin bloques. Agrega uno.</Typography>
          </Box>
        ) : (
          blocks.map(block => (
            <BlockRow
              key={block.id}
              block={block}
              dayId={day.id}
              onDelete={onDeleteBlock}
              onUpdate={onUpdateBlock}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

// ── Componente principal ──────────────────────────────────────────
export default function Schedule() {
  const navigate = useNavigate();
  const [activeDays,      setActiveDays]      = useState(INITIAL_STATE.activeDays);
  const [blocks,          setBlocks]          = useState(INITIAL_STATE.blocks);
  const [nonWorkingDays,  setNonWorkingDays]  = useState(INITIAL_STATE.nonWorkingDays);
  const [saving,          setSaving]          = useState(false);
  const [toast,           setToast]           = useState(false);

  // ── Días ────────────────────────────────────────────────────
  const toggleDay = useCallback((id) => {
    setActiveDays(prev => {
      if (prev.includes(id)) {
        setBlocks(b => { const c = { ...b }; delete c[id]; return c; });
        return prev.filter(d => d !== id);
      }
      setBlocks(b => ({ ...b, [id]: [] }));
      return [...prev, id];
    });
  }, []);

  // ── Bloques ─────────────────────────────────────────────────
  const addBlock = useCallback((dayId) => {
    setBlocks(prev => ({
      ...prev,
      [dayId]: [...(prev[dayId] || []), { id: uid(), start: "09:00", end: "13:00" }],
    }));
  }, []);

  const deleteBlock = useCallback((dayId, blockId) => {
    setBlocks(prev => ({ ...prev, [dayId]: prev[dayId].filter(b => b.id !== blockId) }));
  }, []);

  const updateBlock = useCallback((dayId, blockId, start, end) => {
    setBlocks(prev => ({
      ...prev,
      [dayId]: prev[dayId].map(b => b.id === blockId ? { ...b, start, end } : b),
    }));
  }, []);

  // ── Días no hábiles ─────────────────────────────────────────
  const addNwd    = () => setNonWorkingDays(prev => [...prev, { id: uid(), date: "" }]);
  const deleteNwd = (id) => setNonWorkingDays(prev => prev.filter(n => n.id !== id));
  const updateNwd = (id, date) => setNonWorkingDays(prev => prev.map(n => n.id === id ? { ...n, date } : n));

  // ── Guardar ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    // Reemplaza con tu llamada real a la API
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setToast(true);
  };

  const activeDayObjects = DAYS.filter(d => activeDays.includes(d.id));

  return (
    <>
      <PageHeader
        title="Mi Horario"
        subtitle="Gestiona tu horario de trabajo y disponibilidad"
      />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <SectionLabel icon={<SettingsIcon />}>Configuración</SectionLabel>

          {/* Pills de días */}
          <Box sx={{
            display: "flex", flexWrap: "wrap", gap: 1,
            pb: 2, mb: 2, borderBottom: `0.5px solid`, borderColor: "divider",
          }}>
            {DAYS.map(day => (
              <DayPill
                key={day.id}
                day={day}
                active={activeDays.includes(day.id)}
                onToggle={toggleDay}
              />
            ))}
          </Box>

          {/* Grid de días activos */}
          {activeDayObjects.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <EventBusyIcon sx={{ fontSize: 32, color: "text.disabled", display: "block", mx: "auto", mb: 1 }} />
              <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                Selecciona al menos un día para configurar los bloques de atención
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={1.5} sx={{ mb: 2 }}>
              {activeDayObjects.map(day => (
                <Grid item xs={12} sm={6} md={4} key={day.id}>
                  <DayCard
                    day={day}
                    blocks={blocks[day.id] || []}
                    onAddBlock={addBlock}
                    onDeleteBlock={deleteBlock}
                    onUpdateBlock={updateBlock}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Días no hábiles */}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography sx={{
              fontSize: 11, fontWeight: 600, letterSpacing: "0.07em",
              textTransform: "uppercase", color: "text.secondary",
              display: "flex", alignItems: "center", gap: 0.75,
            }}>
              <EventBusyIcon sx={{ fontSize: 15 }} />
              Días no hábiles
            </Typography>
            <Button
              size="small"
              startIcon={<AddIcon sx={{ fontSize: "13px !important" }} />}
              onClick={addNwd}
              sx={{
                borderRadius: 20, fontSize: 11, px: 1.5,
                bgcolor: C.lav500, color: "#fff",
                "&:hover": { bgcolor: C.lav700 },
              }}
            >
              Agregar
            </Button>
          </Box>

          {nonWorkingDays.length === 0 ? (
            <Typography sx={{ fontSize: 12, color: "text.disabled", textAlign: "center", py: 1.5 }}>
              Sin días no hábiles registrados
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
              {nonWorkingDays.map(nwd => (
                <Box key={nwd.id} sx={{
                  display: "flex", alignItems: "center", gap: 1.25,
                  px: 1.5, py: 0.875, borderRadius: 1.5,
                  border: `0.5px solid`, borderColor: "divider",
                  bgcolor: "background.paper",
                  "&:hover": { borderColor: C.lav200, bgcolor: C.lav50 },
                  transition: "all .12s",
                }}>
                  <EventBusyIcon sx={{ fontSize: 15, color: C.lav500, flexShrink: 0 }} />
                  <Typography sx={{ flex: 1, fontSize: 13, color: "text.primary" }}>
                    {formatDate(nwd.date)}
                  </Typography>
                  <TextField
                    type="date" size="small" value={nwd.date}
                    onChange={e => updateNwd(nwd.id, e.target.value)}
                    inputProps={{ "aria-label": "Fecha día no hábil" }}
                    sx={{ width: 150, "& input": { fontSize: 12, py: 0.5, px: 1 } }}
                  />
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => deleteNwd(nwd.id)}
                      sx={{ color: "text.secondary", "&:hover": { bgcolor: C.dangerBg, color: C.danger } }}
                    >
                      <DeleteIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>

        {/* Footer */}
        <Box sx={{
          display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1.5,
          px: 3, py: 2, borderTop: `0.5px solid`, borderColor: "divider",
          bgcolor: "background.default",
        }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 20, borderColor: C.teal200, color: C.grayBlue }}
          >
            Regresar
          </Button>
          <Button
            variant="contained"
            startIcon={saving ? null : <SaveIcon />}
            onClick={handleSave}
            disabled={saving}
            sx={{ borderRadius: 20, minWidth: 120 }}
          >
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </Box>
      </Card>

      {/* Toast */}
      <Snackbar
        open={toast}
        autoHideDuration={3000}
        onClose={() => setToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" icon={<CheckCircleIcon />} sx={{ borderRadius: 2 }}>
          Horario guardado correctamente.
        </Alert>
      </Snackbar>
    </>
  );
}