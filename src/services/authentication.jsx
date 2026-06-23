import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isVerifySession = error.config?.url?.includes("/auth/v1/me");

        if (error.response?.status === 401 && !isVerifySession) {
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

const authenticationService = {
    login: async (username, password) => {
        try {
            const response = await api.post(`/api/auth/v1/authentication`, { username, password });
            return response.data;   
        } catch (error) {
            const message = error.response?.data?.message || "Error al iniciar sesión";
            throw new Error(message);
        }
    },
    logout: async () => {
        try {
            const response = await api.post(`/api/auth/v1/logout`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Error al cerrar sesión";
            throw new Error(message);
        }
    },
    verifySession: async () => {
        try {
            const response = await api.get(`/api/auth/v1/me`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) return null;
            const message = error.response?.data?.message || "Error al verificar sesión";
            throw new Error(message);
        }
    }
};

export default authenticationService;
export { api };