import { api } from "./authentication";

const userServices = {
    saveUser: async (params) => {
        try {
            const response = await api.post(`/api/users/v1/save`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al guardar el doctor";
            throw new Error(message);
        }
    },
    getUsers: async (params) => {
        try {
            const response = await api.get(`/api/users/v1/list`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los doctores";
            throw new Error(message);
        }
    },
    getCountUsers: async (params) => {
        try {
            const response = await api.get(`/api/users/v1/count`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el total de doctores";
            throw new Error(message);
        }
    }
};

export default userServices;