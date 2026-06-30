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
    getReqById: async (_id) => {
        try {
            const response = await api.get(`/api/requests/v1/get/${_id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener la solicitud";
            throw new Error(message);
        }
    },
    updateReq: async (_id, params) => {
        try {
            const response = await api.put(`/api/requests/v1/update/${_id}`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al actualizar el equipo";
            throw new Error(message);
        }
    },
    scheduleReq: async (_id, params) => {
        try {
            const response = await api.put(`/api/requests/v1/scheduleReq/${_id}`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al programar solicitud";
            throw new Error(message);
        }
    },
};

export default workOrderServices;