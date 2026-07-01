import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Box
} from "@mui/material";

import PageHeader from "../components/common/pageHeader";
import FilterWorkOrder from "./../components/workOrder/FilterWorkOrder";
import PaginationCmp from '../components/common/pagination';
import WOCard from '../components/workOrder/WOCard';
import workOrderServices from '../../services/workOrders';
import useNotification from "./../../../hooks/useNotification";

export default function WorkOrders() {


  const [total, setTotal] = useState(0);
  const [workOrders, setWorkOrders] = useState([]);
  const [filters, setFilters] = useState({
    search: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15
  });
  const [loading, setLoading] = useState(false);

  const { notification, showSuccess, showError, closeNotification } = useNotification();

  useEffect(() => {
    setLoading(true);
    getCountWorkOrders();
    getWorkOrders();
  }, [filters, pagination]);

  const getWorkOrders = async () => {
    try {
      const response = await workOrderServices.getWorkOrders({
        search: filters.search,
        page: pagination.page,
        limit: pagination.limit
      });
      setWorkOrders(response?.data.workOrders || []);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener las solicitudes: ", err);
      showError("Hubo un error al obtener las solicitudes");
    }
  }

  const getCountWorkOrders = async () => {
    try {
      const response = await workOrderServices.getCountWorkOrders({
        search: filters.search
      });
      setTotal(response?.data.count || 0);
    } catch (err) {
      console.error("Error al obtener el total de solicitudes: ", err);
      showError("Hubo un error al obtener el total de solicitudes");
    }
  }

  const handleRefresh = (refresh) => {
    if (refresh) setFilters({ search: "" });
  }

  const handleSetFilters = (params) => {
    setFilters(params);
    setPagination(prev => ({ ...prev, page: 1 }));
  }

  return (
    <>
      <PageHeader
        title="Ordenes de trabajo"
        subtitle="Resumen de hoy - lunes 01 de junio 2026"
      />

      {/* Filtros de búsqueda */}
      <FilterWorkOrder
        filters={filters}
        setFilters={handleSetFilters}
      />

      <Grid item xs={12}>
        <Box sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",                          
            sm: "repeat(2, 1fr)",               
            md: "repeat(2, 1fr)",               
            lg: "repeat(3, 1fr)",               
          },
          gap: { xs: 1.5, sm: 2 },
          alignItems: "start",
          mb: 3,
        }}>
          {workOrders.map((row) => (
            <WOCard
              key={row._id}
              order={row}
              handleRefresh={handleRefresh}
            />
          ))}
        </Box>
      </Grid>

      {/* Paginación */}
      <PaginationCmp
        pagination={pagination}
        setPagination={setPagination}
        limit={pagination.limit}
        total={total}
        table={"ordenes"}
      />
    </>
  );
}