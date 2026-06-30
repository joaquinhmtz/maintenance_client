import { C } from "../variables";

const STATUS_WO = {
    Abierta: { bgcolor: C.neutral, color: C.slate },
    Proceso: { bgcolor: C.infoBg, color: C.info },
    Pendiente: { bgcolor: C.extremBg, color: C.white },
    Cancelada: { bgcolor: C.dangerBg, color: C.danger },
    Cerrada: { bgcolor: C.successBg, color: C.success }
};

const STATUS_CONFIG = {
    ["Abierta"]: {
        borderColor: C.infoBg,
        badge: { bgcolor: C.offWhite, color: C.darkGray, border: C.lightGray },
        label: "Abierta",
    },
    ["En proceso"]: {
        borderColor: C.grayBlue,
        badge: { bgcolor: C.infoBg, color: C.infoText, border: "transparent" },
        label: "En proceso",
    },
    ["Pendiente"]: {
        borderColor: C.warning,
        badge: { bgcolor: C.warningBg, color: C.warning, border: "transparent" },
        label: "Pendiente",
    },
    [STATUS_WO.Cerrada]: {
        borderColor: C.success,
        badge: { bgcolor: C.successBg, color: C.successText, border: "transparent" },
        label: "Cerrada",
    },
    [STATUS_WO.Cancelada]: {
        borderColor: C.danger,
        badge: { bgcolor: C.dangerBg, color: C.dangerText, border: "transparent" },
        label: "Cancelada",
    },
};

const PRIORITIES = {
    HIGH: { bgcolor: "#F8D7DA", color: C.danger },
    MEDIUM: { bgcolor: C.warningBg, color: C.warning },
    LOW: { bgcolor: C.successBg, color: C.success }
};

const PRIORITIES_LABEL = {
    HIGH: "Alta",
    MEDIUM: "Media",
    LOW: "Baja"
};

export {
    STATUS_CONFIG,
    PRIORITIES,
    PRIORITIES_LABEL,
    STATUS_WO
}