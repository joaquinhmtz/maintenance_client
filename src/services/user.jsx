import { api } from "./authentication";

const userServices = {
    saveUser: async (params) => {
        try {
            const response = await api.post(`/api/users/v1/save`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al guardar el usuario";
            throw new Error(message);
        }
    },
    getUsers: async (params) => {
        try {
            const response = await api.get(`/api/users/v1/list`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener los usuarios";
            throw new Error(message);
        }
    },
    getUserById: async (_id) => {
        try {
            const response = await api.get(`/api/users/v1/get/${_id}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el usuario";
            throw new Error(message);
        }
    },
    getCountUsers: async (params) => {
        try {
            const response = await api.get(`/api/users/v1/count`, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el total de usuarios";
            throw new Error(message);
        }
    },
    updateUser: async (_id, params) => {
        try {
            const response = await api.put(`/api/users/v1/update/${_id}`, params);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al actualizar el usuario";
            throw new Error(message);
        }
    },
    deleteUser: async (_id) => {
        try {
            const response = await api.delete(`/api/users/v1/delete/${_id}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al eliminar el usuario";
            throw new Error(message);
        }
    },
};

export default userServices;