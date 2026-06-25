import { api } from "./authentication";

const requestServices = {
    saveReq: async (params) => {
        try {
            const response = await api.post(`/api/requests/v1/save`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al guardar la solicitud";
            throw new Error(message);
        }
    },
    checkSerieExists: async (serie) => {
        try {
            const response = await api.get(`/api/items/v1/check-serie/${serie}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al validar el no. serie";
            throw new Error(message);
        }
    },
    getRequests: async (params) => {
        try {
            const response = await api.get(`/api/requests/v1/list`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener las solicitudes";
            throw new Error(message);
        }
    },
    getCountRequests: async (params) => {
        try {
            const response = await api.get(`/api/requests/v1/count`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el total de solicitudes";
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
            const response = await api.delete(`/api/items/v1/schedule/${_id}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al programar solicitud";
            throw new Error(message);
        }
    },
};

export default requestServices;