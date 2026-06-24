import { api } from "./authentication";

const hospitalServices = {
    saveHospital: async (params) => {
        try {
            const response = await api.post(`/api/hospitals/v1/save`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al guardar el hospital";
            throw new Error(message);
        }
    },
    getHospitals: async (params) => {
        try {
            const response = await api.get(`/api/hospitals/v1/list`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los hospitales";
            throw new Error(message);
        }
    },
    getCountHospitals: async (params) => {
        try {
            const response = await api.get(`/api/hospitals/v1/count`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el total de hospitales";
            throw new Error(message);
        }
    },
    getHospById: async (_id) => {
        try {
            const response = await api.get(`/api/hospitals/v1/get/${_id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el hospital";
            throw new Error(message);
        }
    },
    updateHospital: async (_id, params) => {
        try {
            const response = await api.put(`/api/hospitals/v1/update/${_id}`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al actualizar el hospital";
            throw new Error(message);
        }
    },
    deleteHospital: async (_id) => {
        try {
            const response = await api.delete(`/api/hospitals/v1/delete/${_id}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar el hospital";
            throw new Error(message);
        }
    },
};

export default hospitalServices;