import { useState } from "react";

export default function useNotification() {

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showSuccess = (message) => {
        setNotification({
            open: true,
            message,
            severity: "success"
        });
    };

    const showError = (message) => {
        setNotification({
            open: true,
            message,
            severity: "error"
        });
    };

    const closeNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    return {
        notification,
        showSuccess,
        showError,
        closeNotification
    };
}