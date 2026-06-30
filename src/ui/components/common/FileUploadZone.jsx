import { useRef, useState, useCallback } from "react";
import {
  Box, Typography, IconButton, LinearProgress, Tooltip,
} from "@mui/material";
import {
  CameraAlt as CameraIcon,
  InsertDriveFile as FileIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  ErrorOutline as ErrorIcon,
} from "@mui/icons-material";
import { C } from "./../../../theme/variables";
import { uploadFiles } from "../../../services/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/**
 * FileUploadZone — Zona de carga de archivos reutilizable.
 * Sube automáticamente al backend al seleccionar archivo(s).
 *
 * @param {Object}   props
 * @param {string}   props.label        - Texto del label superior (ej. "Evidencia fotográfica")
 * @param {string}   props.modulo       - "ordenes-trabajo" | "solicitudes"
 * @param {string}   props.entidadId    - _id del documento padre
 * @param {string}   props.categoria    - "evidencias" | "firmas" | "adjuntos"
 * @param {boolean}  [props.multiple=true]
 * @param {boolean}  [props.capture]    - true habilita cámara directa en móvil
 * @param {Function} [props.onUploaded] - (attachments[]) => void — se llama tras subir con éxito
 * @param {Array}    [props.initialFiles] - Attachments ya existentes (modo edición)
 */
export default function FileUploadZone({
  label = "Adjuntos",
  modulo,
  entidadId,
  categoria,
  multiple = true,
  capture = false,
  onUploaded,
  initialFiles = [],
}) {
  const inputRef = useRef(null);
  const [files, setFiles] = useState(initialFiles); // archivos ya subidos (con url del server)
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const validateFiles = (fileList) => {
    for (const file of fileList) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `"${file.name}" no es un tipo permitido. Usa JPG, PNG o PDF.`;
      }
      if (file.size > MAX_SIZE_BYTES) {
        return `"${file.name}" excede el límite de ${MAX_SIZE_MB} MB.`;
      }
    }
    return null;
  };

  const handleFiles = useCallback(async (fileList) => {
    setError(null);
    const arr = Array.from(fileList);
    if (arr.length === 0) return;

    const validationError = validateFiles(arr);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setUploading(true);
      const uploaded = await uploadFiles({ modulo, entidadId, categoria, files: arr });
      const next = [...files, ...uploaded];
      setFiles(next);
      onUploaded?.(next);
    } catch (err) {
      setError(err.response?.data?.message ?? "Error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  }, [files, modulo, entidadId, categoria, onUploaded]);

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = ""; // permite volver a seleccionar el mismo archivo
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (id) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f._id !== id);
      onUploaded?.(next);
      return next;
    });
    // Llama a tu servicio de delete si quieres borrarlo también del servidor:
    // deleteAttachment(id);
  };

  return (
    <Box>
      <Typography sx={{ fontSize: 12, fontWeight: 500, color: C.darkGray, mb: 0.75 }}>
        {label}
      </Typography>

      {/* ── Zona de drop / click ── */}
      <Box
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        sx={{
          display: "flex", alignItems: "center", gap: 1,
          border: `0.5px dashed ${dragOver ? C.black : C.midGray}`,
          borderRadius: 1.5,
          bgcolor: dragOver ? C.offWhite : C.white,
          px: 1.5, py: 1.1,
          cursor: uploading ? "default" : "pointer",
          transition: "border-color .15s, background-color .15s",
          opacity: uploading ? 0.7 : 1,
        }}
      >
        <CameraIcon sx={{ fontSize: 17, color: C.midGray }} />
        <Typography sx={{ fontSize: 12.5, color: C.midGray }}>
          {uploading ? "Subiendo..." : "Tomar foto o seleccionar archivo"}
        </Typography>
      </Box>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple={multiple}
        capture={capture ? "environment" : undefined}
        onChange={handleInputChange}
        style={{ display: "none" }}
      />

      {uploading && (
        <LinearProgress
          sx={{
            mt: 0.75, height: 2, borderRadius: 1,
            bgcolor: C.lightGray,
            "& .MuiLinearProgress-bar": { bgcolor: C.black },
          }}
        />
      )}

      <Typography sx={{ fontSize: 11, color: C.midGray, mt: 0.5 }}>
        JPG, PNG o PDF · Máx. {MAX_SIZE_MB} MB por archivo
      </Typography>

      {error && (
        <Typography sx={{ fontSize: 11, color: C.dangerText, mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
          <ErrorIcon sx={{ fontSize: 13 }} />
          {error}
        </Typography>
      )}

      {/* ── Lista de archivos subidos ── */}
      {files.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, mt: 1 }}>
          {files.map((f) => (
            <Box
              key={f._id}
              sx={{
                display: "flex", alignItems: "center", gap: 1,
                bgcolor: C.offWhite, borderRadius: 1.5,
                px: 1.25, py: 0.75,
              }}
            >
              <FileIcon sx={{ fontSize: 16, color: C.midGray, flexShrink: 0 }} />
              <Typography
                component="a"
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  fontSize: 12, color: C.infoText, flex: 1,
                  textDecoration: "none", overflow: "hidden",
                  textOverflow: "ellipsis", whiteSpace: "nowrap",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {f.originalName}
              </Typography>
              <CheckIcon sx={{ fontSize: 14, color: C.success, flexShrink: 0 }} />
              <Tooltip title="Quitar">
                <IconButton size="small" onClick={() => handleRemove(f._id)} sx={{ p: 0.25 }}>
                  <CloseIcon sx={{ fontSize: 14, color: C.midGray }} />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}