import { api } from "./authentication";

const workOrderServices = {
    initWorkOrder: async (params) => {
        try {
            const response = await api.put(`/api/workOrder/v1/init`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al iniciar la orden";
            throw new Error(message);
        }
    },
    initWaitingWorkOrder: async (params) => {
        try {
            const response = await api.put(`/api/workOrder/v1/waiting`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al poner en espera la orden";
            throw new Error(message);
        }
    },
    resumeWorkOrder: async (params) => {
        try {
            const response = await api.put(`/api/workOrder/v1/resume`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al reanudar la orden";
            throw new Error(message);
        }
    },
    closeWorkOrder: async (params) => {
        try {
            const response = await api.put(`/api/workOrder/v1/close`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al cerrar la orden";
            throw new Error(message);
        }
    },
    getWorkOrders: async (params) => {
        try {
            const response = await api.get(`/api/workOrders/v1/list`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener las ordenes";
            throw new Error(message);
        }
    },
    getCountWorkOrders: async (params) => {
        try {
            const response = await api.get(`/api/workOrders/v1/count`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el total de ordenes";
            throw new Error(message);
        }
    },
    pdfWorkOrder: async (_id) => {
        try {
            const response = await api.get(`/api/workOrder/v1/pdf/${_id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al descargar pdf de la orden";
            throw new Error(message);
        }
    },
};

export default workOrderServices;