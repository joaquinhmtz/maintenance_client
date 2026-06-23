import React, { useState, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Grid,
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar,
    Tooltip,
    IconButton,
    Pagination,
    Button,
    useTheme
} from "@mui/material";
import {
    Favorite as FavoriteIcon,
    AccessTime as TimeIcon,
    Edit as EditIcon,
    Visibility as ViewIcon,
    Delete as DeleteIcon,
    Folder as FolderIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import PageHeader from "./../components/common/pageHeader";
import FilterPatients from "../components/patients/FilterPatients";
import ModalFormPatients from "./../components/patients/ModalFormPatients";
import { C, AVA_STYLES, ROL_CHIP, STATUS } from "../../theme/variables";

export default function Patients() {

    const theme = useTheme();
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    const [filter, setFilter] = useState({
        search: ""
    });
    const [page, setPage] = useState(1);
    const DOCTORS = [
        { id: 1, nombre: "Dra. Ana García", email: "ana.garcia@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "AG", avatarType: "t" },
        { id: 2, nombre: "Dr. Carlos Méndez", email: "c.mendez@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "CM", avatarType: "d" },
        { id: 3, nombre: "Dra. Sofía Reyes", email: "s.reyes@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "SR", avatarType: "t" },
        { id: 4, nombre: "Dr. Luis Herrera", email: "l.herrera@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "LH", avatarType: "d" },
        { id: 5, nombre: "Enf. María Torres", email: "m.torres@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "MT", avatarType: "e" },
        { id: 6, nombre: "Dra. Patricia Leal", email: "p.leal@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Pendiente", initials: "PL", avatarType: "t" },
        { id: 7, nombre: "Dr. Roberto Vega", email: "r.vega@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "RV", avatarType: "d" },
        { id: 8, nombre: "Enf. Jorge Soto", email: "j.soto@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Inactivo", initials: "JS", avatarType: "e" },
        { id: 9, nombre: "Dra. Elena Cruz", email: "e.cruz@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Pendiente", initials: "EC", avatarType: "t" },
        { id: 10, nombre: "Dr. Marco Ríos", email: "m.rios@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "MR", avatarType: "d" },
        { id: 11, nombre: "Enf. Sandra Mora", email: "s.mora@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Activo", initials: "SM", avatarType: "e" },
        { id: 12, nombre: "Dr. Andrés Peña", email: "a.pena@dentalcare.mx", phoneNumber: "5510109099", lastAppointment: "14/09/2025", estado: "Inactivo", initials: "AP", avatarType: "d" },
    ];
    const filtered = useMemo(() => {
        const q = filter.search.toLowerCase();
        return DOCTORS.filter(u =>
            (!q || u.nombre.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
            (!filter.rol || u.rol === filter.rol) &&
            (!filter.estado || u.estado === filter.estado)
        );
    }, [filter]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
    const currentPage = Math.min(page, totalPages);
    const slice = filtered.slice((currentPage - 1) * 10, currentPage * 10);
    const STATUS_MAP = {
        confirmed: { label: "Confirmada", color: "success" },
        pending: { label: "Pendiente", color: "warning" },
        cancelled: { label: "Cancelada", color: "error" },
    };

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <PageHeader
                title="Pacientes"
                subtitle="Lista de pacientes registrados en el sistema"
            />

            {/* Filtros de búsqueda */}
            <FilterPatients filter={filter} setFilter={setFilter} />

            {/* Tabla de citas */}
            <Grid item xs={12} lg={8}>
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <FolderIcon sx={{ color: C.teal500, fontSize: 20 }} />
                                <Typography variant="h6" sx={{ fontSize: 15 }}>Registros</Typography>
                                <Chip label="10" size="small" sx={{ bgcolor: C.teal50, color: C.teal700, fontWeight: 600 }} />
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    sx={{ whiteSpace: "nowrap" }}
                                    onClick={() => setOpen(true)}
                                >
                                    Nuevo paciente
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${C.teal50}`, borderRadius: 2, mt: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {["Paciente", "Contacto", "Últ. cita", ""].map(h => (
                                            <TableCell key={h}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {DOCTORS.map(row => {
                                        const s = STATUS_MAP[row.status];
                                        return (
                                            <TableRow key={row.id}>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                                        <Avatar sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, ...AVA_STYLES[row.avatarType] }}>
                                                            {row.initials}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.nombre}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                                        <Box>
                                                            <Typography sx={{ fontSize: 13, color: C.slate }}>
                                                                <b>Tél:</b> {row.phoneNumber}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 13, color: C.slate }}>
                                                                <b>Email:</b>    {row.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: 12, color: C.grayBlue }}>{row.lastAppointment}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="Editar">
                                                        <IconButton size="small" onClick={() => navigate(`/usuarios/${row.id}/editar`)}>
                                                            <EditIcon fontSize="small" sx={{ color: C.grayBlue }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Ver detalle">
                                                        <IconButton size="small" onClick={() => navigate(`/usuarios/${row.id}`)}>
                                                            <ViewIcon fontSize="small" sx={{ color: C.grayBlue }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Eliminar">
                                                        <IconButton size="small">
                                                            <DeleteIcon fontSize="small" sx={{ color: C.danger, opacity: .7, "&:hover": { opacity: 1 } }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Paginación */}
                        <Box sx={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            px: 2, py: 1.5, borderTop: "0.5px solid", borderColor: "divider", flexWrap: "wrap", gap: 1,
                        }}>
                            <Typography sx={{ fontSize: 11, color: C.grayBlue }}>
                                Mostrando {Math.min((currentPage - 1) * 10 + 1, filtered.length)}–{Math.min(currentPage * 10, filtered.length)} de {filtered.length} pacientes
                            </Typography>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, p) => setPage(p)}
                                size="small"
                                sx={{
                                    "& .MuiPaginationItem-root.Mui-selected": { bgcolor: C.teal500, color: "#fff" },
                                    "& .MuiPaginationItem-root.Mui-selected:hover": { bgcolor: C.teal700 },
                                }}
                            />
                        </Box>

                    </CardContent>
                </Card>
            </Grid>

            {/* Form de pacientes */}
            <ModalFormPatients
                open={open}
                onClose={handleClose}
                theme={theme}
            />

        </>
    );
}
