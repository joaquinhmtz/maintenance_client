import { api } from "./authentication";

const utilServices = {
    getCatalogByKey: async (key) => {
        try {
            const response = await api.get(`/api/catalogs/v1/${key}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo";
            throw new Error(message);
        }
    },
    getCatalogProfiles: async () => {
        try {
            const response = await api.get(`/api/catalogs/v1/profiles`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de perfiles";
            throw new Error(message);
        }
    },
    getCatalogBrands: async () => {
        try {
            const response = await api.get(`/api/catalogs/v1/brands`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de marcas";
            throw new Error(message);
        }
    },
    getModelsByBrand: async (brandId) => {
        try {
            const response = await api.get(`/api/catalogs/v1/models/${brandId}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de modelos";
            throw new Error(message);
        }
    },
    getHospitalsByUser: async () => {
        try {
            const response = await api.get(`/api/catalogs/v1/hospitals/byUser`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de hospitales";
            throw new Error(message);
        }
    },
    getHospitals: async () => {
        try {
            const response = await api.get(`/api/catalogs/v1/hospitals`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de hospitales";
            throw new Error(message);
        }
    },
    getItemsByHosp: async (hospitalId) => {
        try {
            const response = await api.get(`/api/catalogs/v1/items/${hospitalId}`);
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de equipos por hospital";
            throw new Error(message);
        }
    },
    getResponsibles: async (type = "requests") => {
        try {
            const response = await api.get(`/api/catalogs/v1/responsibles`, { params: { type } });
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al obtener el catálogo de equipos por hospital";
            throw new Error(message);
        }
    },
};

export default utilServices;