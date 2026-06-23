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
import FilterItems from "../components/items/FilterItems";
import ModalFormUsers from "../components/users/ModalFormUsers";
import SkeletonTable from "../components/common/skeletonTable";
import itemServices from "../../services/item";
import { C, AVA_STYLES, AREA_CHIP, STATUS } from "../../theme/variables";
import useNotification from "../../../hooks/useNotification";
import AppSnackbar from "../components/common/appSnackbar";
import PaginationCmp from '../components/common/pagination';
import ConfirmDialog from "../components/common/confirmDialog";

export default function Items() {

  const {
    notification,
    showError,
    showSuccess,
    closeNotification
  } = useNotification();
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
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
  const [itemInfo, setItemInfo] = useState({});

  useEffect(() => {
    setLoading(true);
    getCountItems();
    getItems();
  }, [filters, pagination]);

  const getItems = async () => {
    try {
      const response = await itemServices.getItems({
        search: filters.search,
        page: pagination.page,
        limit: pagination.limit
      });
      setItems(response?.data.items || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener los equipos: ", err);
      showError("Hubo un error al obtener los equipos");
    }
  }

  const getCountItems = async () => {
    try {
      const response = await itemServices.getCountItems({
        search: filters.search
      });
      setTotal(response?.data.count || 0);
    } catch (err) {
      console.error("Error al obtener el total de equipos: ", err);
      showError("Hubo un error al obtener el total de equipos");
    }
  }

  const handleDelete = async () => {
    try {
      const response = await itemServices.deleteItem(itemInfo._id);
      showSuccess(`Equipo ${itemInfo.name} se ha eliminado correctamente`);
      setOpenConfDiag(false);
      setItemInfo({});
    } catch (err) {
      console.error("Error al obtener el total de equipos: ", err);
      showError("Hubo un error al obtener el total de equipos");
    }
  };

  const handleSetFilters = (params) => {
    setFilters(params);
    setPagination(prev => ({ ...prev, page: 1 }));
  }

  return (
    <>
      <PageHeader
        title="Equipos médicos"
        subtitle="Lista de equipos registrados en el sistema"
      />

      {/* Filtros de búsqueda */}
      <FilterItems
        filters={filters}
        setFilters={handleSetFilters}
      />

      {/* Tabla de items */}
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
                  onClick={() => navigate("/items/new")}
                >
                  Nuevo Equipo
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
                        {["Equipo", "Marca", "Hospital", "Área", "Estado", ""].map(h => (
                          <TableCell key={h}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map(row => {
                        return (
                          <TableRow key={row._id}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: 11, fontWeight: 600, ...AVA_STYLES[row.speciality?.value.substring(0, 1)] }}>
                                  {row.initials}
                                </Avatar>
                                <Box>
                                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.name}</Typography>
                                  <Typography sx={{ fontSize: 11, color: C.grayBlue }}>{row.serie}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.brand?.value}</Typography>
                              <Typography sx={{ fontSize: 11, fontWeight: 600, color: C.grayBlue }}>{row.model?.value}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.grayBlue }}>{row.hospital?.name}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={row.area?.value} size="small"
                                sx={{ ...(AREA_CHIP[row.area?.value] || {}), fontWeight: 600, fontSize: 11, borderRadius: 20 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: STATUS[row.active === true ? "Activo" : "Inactivo"]?.dot }} />
                                <Typography sx={{ fontSize: 12 }}>{row.active === true ? "Activo" : "Inactivo"}</Typography>
                              </Box>
                            </TableCell>

                            {row.active ?
                              (
                                <TableCell align="right">
                                  <Tooltip title="Editar">
                                    <IconButton size="small" onClick={() => navigate(`/items/edit/${row._id}`)}>
                                      <EditIcon fontSize="small" sx={{ color: C.grayBlue }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Eliminar">
                                    <IconButton
                                      size="small"
                                      onClick={() => { setOpenConfDiag(true); setItemInfo({ _id: row._id, name: row.name }) }}
                                    >
                                      <DeleteIcon fontSize="small" sx={{ color: C.danger, opacity: .7, "&:hover": { opacity: 1 } }} />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                              )
                              : null}

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
              table={"equipos"}
            />

          </CardContent>
        </Card>
      </Grid>

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
        title="ELIMINAR EQUIPO"
        description={`¿Seguro que quieres eliminar el equipo? \n ${itemInfo.name}`}
        textConfirm={"Eliminar"}
        textCancel={"Cancelar"}
        handleConfirmClose={() => { setOpenConfDiag(false); setItemInfo({}); }}
        handleClose={handleDelete}
      />

    </>
  );
}
