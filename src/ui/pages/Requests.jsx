import React, { useState, useEffect } from 'react';
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
  Button,
  useTheme
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
  Cancel as CancelIcon,
  Folder as FolderIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import PageHeader from "../components/common/pageHeader";
import FilterRequest from "../components/requests/FilterRequest";
import ModalFormUsers from "../components/users/ModalFormUsers";
import SkeletonTable from "../components/common/skeletonTable";
import requestServices from "./../../services/request";
import { C, AVA_STYLES, ROL_CHIP, STATUS, PRIORITIES, PRIORITIES_LABEL, STATUS_REQ } from "../../theme/variables";
import useNotification from "../../../hooks/useNotification";
import AppSnackbar from "../components/common/appSnackbar";
import PaginationCmp from '../components/common/pagination';
import ConfirmDialog from "../components/common/confirmDialog";
import GridMetricsReq from "./../components/requests/GridMetricsReq";

export default function Requests() {

  const theme = useTheme();
  const {
    notification,
    showError,
    closeNotification
  } = useNotification();
  const [total, setTotal] = useState(0);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15
  });
  const [loading, setLoading] = useState(false);
  const [openConfDiag, setOpenConfDiag] = useState(false);
  const [nameUser, setNameUser] = useState("");

  useEffect(() => {
    setLoading(true);
    getCountRequests();
    getRequests();
  }, [filters, pagination]);

  const getRequests = async () => {
    try {
      const response = await requestServices.getRequests({
        search: filters.search,
        page: pagination.page,
        limit: pagination.limit
      });
      setRequests(response?.data.requests || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener las solicitudes: ", err);
      showError("Hubo un error al obtener las solicitudes");
    }
  }

  const getCountRequests = async () => {
    try {
      const response = await requestServices.getCountRequests({
        search: filters.search
      });
      setTotal(response?.data.count || 0);
    } catch (err) {
      console.error("Error al obtener el total de solicitudes: ", err);
      showError("Hubo un error al obtener el total de solicitudes");
    }
  }

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetFilters = (params) => {
    setFilters(params);
    setPagination(prev => ({ ...prev, page: 1 }));
  }

  return (
    <>
      <PageHeader
        title="Solicitudes"
        subtitle="Resumen de hoy - lunes 01 de junio 2026"
      />

      <GridMetricsReq />

      {/* Filtros de búsqueda */}
      <FilterRequest
        filters={filters}
        setFilters={handleSetFilters}
      />

      {/* Tabla de hospitales */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FolderIcon sx={{ color: C.teal500, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 15 }}>Registros</Typography>
                <Chip label={total} size="small" sx={{ bgcolor: C.teal50, color: C.teal700, fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => navigate("/requests/new")}
                >
                  Nueva Solicitud
                </Button>
              </Box>
            </Box>

            {loading ?
              (<SkeletonTable />)
              :
              (
                <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${C.teal50}`, borderRadius: 2, mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        {["Folio", "Hospital", "Equipo", "Prioridad", "Estatus", "Responsable", ""].map(h => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map(row => {
                        return (
                          <TableRow key={row._id}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                <Box>
                                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.folio}</Typography>
                                  <Typography sx={{ fontSize: 11, color: C.grayBlue }}>{row.typeService?.name}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.hospital?.name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                <Box>
                                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.item?.name}</Typography>
                                  <Typography variant='body2' sx={{ fontSize: 13, fontWeight: 500, color: C.grayBlue }}>{row.item?.serie}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={PRIORITIES_LABEL[row.priority]} size="small"
                                sx={{ ...(PRIORITIES[row.priority] || {}), fontWeight: 600, fontSize: 11, borderRadius: 20 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.status} size="small"
                                sx={{ ...(STATUS_REQ[row.status] || {}), fontWeight: 600, fontSize: 11, borderRadius: 20 }}
                              />
                            </TableCell>
                            <TableCell>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.responsible?.fullname}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Editar">
                                <IconButton size="small" onClick={() => navigate(`/requests/edit/${row._id}`)}>
                                  <EditIcon fontSize="small" sx={{ color: C.grayBlue }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancelar">
                                <IconButton
                                  size="small"
                                  onClick={() => { setOpenConfDiag(true); setNameUser(row.fullname) }}
                                >
                                  <CancelIcon fontSize="small" sx={{ color: C.danger, opacity: .7, "&:hover": { opacity: 1 } }} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )
            }

            {/* Paginación */}
            <PaginationCmp
              pagination={pagination}
              setPagination={setPagination}
              limit={pagination.limit}
              total={total}
            />

          </CardContent>
        </Card>
      </Grid>

      {/* Form de doctores */}
      <ModalFormUsers
        open={open}
        onClose={handleClose}
        theme={theme}
      />

      {/* Snackbar notification */}
      <AppSnackbar
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={closeNotification}
      />

      {/* Confirmation dialog */}
      <ConfirmDialog
        open={openConfDiag}
        title="ELIMINAR DOCTOR"
        description={`¿Seguro que quieres eliminar el doctor? \n ${nameUser}?`}
        textConfirm={"Eliminar"}
        textCancel={"Cancelar"}
        handleConfirmClose={() => { setOpenConfDiag(false); setNameUser(""); }}
      />

    </>
  );
}
