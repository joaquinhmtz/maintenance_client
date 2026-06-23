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
  Delete as DeleteIcon,
  Folder as FolderIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import PageHeader from "../components/common/pageHeader";
import FilterUsers from "../components/users/FilterUsers";
import ModalFormUsers from "../components/users/ModalFormUsers";
import SkeletonTable from "../components/common/skeletonTable";
import userServices from '../../services/user';
import { C, AVA_STYLES, ROL_CHIP, STATUS } from "../../theme/variables";
import useNotification from "../../../hooks/useNotification";
import AppSnackbar from "../components/common/appSnackbar";
import PaginationCmp from '../components/common/pagination';
import ConfirmDialog from "../components/common/confirmDialog";

export default function Doctors() {

  const theme = useTheme();
  const {
    notification,
    showError,
    closeNotification
  } = useNotification();
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
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
    getCountUsers();
    getUsers();
  }, [filters, pagination]);

  const getUsers = async () => {
    try {
      const response = await userServices.getUsers({ 
        search: filters.search,
        page: pagination.page,
        limit: pagination.limit
      });
      setUsers(response?.data.users || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener los doctores: ", err);
      showError("Hubo un error al obtener los doctorres");
    }
  }

  const getCountUsers = async () => {
    try {
      const response = await userServices.getCountUsers({ 
        search: filters.search
      });
      setTotal(response?.data.count || 0);
    } catch (err) {
      console.error("Error al obtener el total de doctores: ", err);
      showError("Hubo un error al obtener el total de doctores");
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
        title="Usuarios"
        subtitle="Lista de usuarios registrados en el sistema"
      />

      {/* Filtros de búsqueda */}
      <FilterUsers 
        filters={filters} 
        setFilters={handleSetFilters} 
      />

      {/* Tabla de citas */}
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
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  sx={{ whiteSpace: "nowrap" }}
                  onClick={() => setOpen(true)}
                >
                  Nuevo Usuario
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
                        {["Usuario", "Especialidad", "Estado", ""].map(h => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map(row => {
                        return (
                          <TableRow key={row._id}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, ...AVA_STYLES[row.speciality?.value.substring(0,1)] }}>
                                  {row.initials}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.fullname}</Typography>
                                  <Typography sx={{ fontSize: 11, color: C.grayBlue }}>{row.email}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            
                            <TableCell>
                              <Chip
                                label={row.speciality?.value} size="small"
                                sx={{ ...(ROL_CHIP[row.speciality?.value] || {}), fontWeight: 600, fontSize: 11, borderRadius: 20 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: STATUS[row.active === true ? "Activo" : "No Activo"]?.dot }} />
                                <Typography sx={{ fontSize: 12 }}>{row.active === true ? "Activo" : "No Activo"}</Typography>
                              </Box>
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
                                <IconButton 
                                  size="small"
                                  onClick={() => { setOpenConfDiag(true); setNameUser(row.fullname) }}
                                >
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
        handleConfirmClose={()=> { setOpenConfDiag(false); setNameUser(""); }}
      />

    </>
  );
}
