import { api } from "./authentication";

const itemServices = {
    saveItem: async (params) => {
        try {
            const response = await api.post(`/api/items/v1/save`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al guardar el equipo";
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
    getItems: async (params) => {
        try {
            const response = await api.get(`/api/items/v1/list`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los equipos";
            throw new Error(message);
        }
    },
    getCountItems: async (params) => {
        try {
            const response = await api.get(`/api/items/v1/count`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el total de equipos";
            throw new Error(message);
        }
    },
    getItemById: async (_id) => {
        try {
            const response = await api.get(`/api/items/v1/get/${_id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el equipo";
            throw new Error(message);
        }
    },
    updateItem: async (_id, params) => {
        try {
            const response = await api.put(`/api/items/v1/update/${_id}`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al actualizar el equipo";
            throw new Error(message);
        }
    },
    deleteItem: async (_id, params) => {
        try {
            const response = await api.delete(`/api/items/v1/delete/${_id}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al actualizar el equipo";
            throw new Error(message);
        }
    },
};

export default itemServices;