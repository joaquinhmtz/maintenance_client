import {
    Dashboard as DashboardIcon,
    CalendarMonth as CalendarIcon,
    People as PeopleIcon,
    LocationCity as HospitalIcon,
    ContentPaste as WorkOrderIcon,
    Inventory as InventoryIcon,
    MedicalServices as MedicalIcon,
    Description as DescriptionIcon,
    Favorite as FavoriteIcon,
    BarChart as BarChartIcon,
    Money as MoneyIcon,
    Settings as SettingsIcon,
    AccessTimeFilled as TimeIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;
const C = {
    teal50: "#E6F7F7",
    teal200: "#80D6D6",
    teal500: "#00ADAC",
    teal700: "#007D7C",
    teal900: "#004E4D",
    lav50: "#F1EDF6",
    lav200: "#C4AEDD",
    lav500: "#8963A1",
    lav700: "#644880",
    lav900: "#3E2C52",
    menta: "#F0FAF9",
    white: "#FFFFFF",
    slate: "#2E3A3A",
    grayBlue: "#7A9090",


    success: "#28A745",
    successBg: "#D4EDDA",
    warning: "#FFC107",
    warningBg: "#FFF3CD",
    warningText: "#92400E",
    danger: "#DC3545",
    dangerBg: "#F8D7DA",
    info: "#17A2B8",
    infoBg: "#D1ECF1",
    neutral: "#E0E0E0",
    neutralBg: "#F5F5F5",
    extremBg: "#0A0A0A",


    lightdark: "#f5f4ed",

    // Chips colors
    correctiveBg: "#faece7",
    corrective: "#712b13",
    preventiveBg: "#E0F2F1",
    preventive: "#00695C",
    defeatedBg: "#F8D7DA",
    defeated: "#DC3545",
    
    //Chips status
    purpleChipBg: "#f1e9fa",
    purpleChip: "#5b2d91",
    blueChipBg: "#e6f0fb",
    blueChip: "#1d4d8f",
    yellowChipBg: "#fdf6df",
    yellowChip: "#8a6d1a",
    greenChipBg: "#eaf3de",
    greenChip: "#27500a"

};

const APP_NAME = "Mantenimiento";
const APP_ABV_NAME = "Mtm";

const MENU_SECTIONS = [
    {
        items: [
            { key: "dashboard", label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            // { key: "expedientes",  label: "Expedientes",  icon: <DescriptionIcon />, path: "/expedientes" },
        ],
    },
    {
        subheader: "Mantenimiento",
        items: [
            { key: "calendar", label: "Calendario", icon: <CalendarIcon />, path: "/calendar" },
            { key: "request", label: "Solicitudes", icon: <WorkOrderIcon />, path: "/requests" },
            { key: "work-orders", label: "Ordenes", icon: <DescriptionIcon />, path: "/work-orders" },
        ],
    },
    {
        subheader: "Administración",
        items: [
            { key: "hospitals", label: "Hospitales", icon: <HospitalIcon />, path: "/hospitals" },
            { key: "items", label: "Equipos", icon: <InventoryIcon />, path: "/items" },
            { key: "users", label: "Usuarios", icon: <PeopleIcon />, path: "/users" },
            // { key: "finanzas", label: "Finanzas", icon: <MoneyIcon />, path: "/finanzas" },
        ],
    },
    // {
    //     subheader: "Sistema",
    //     items: [
    //         { key: "configuracion", label: "Configuración", icon: <SettingsIcon />, path: "/configuracion" },
    //     ],
    // },
];

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

const STATUS_REQ = {
    Nueva: { bgcolor: C.neutral, color: C.slate },
    Programada: { bgcolor: C.infoBg, color: C.info },
    Convertida: { bgcolor: C.extremBg, color: C.white },
    Cancelada: { bgcolor: C.dangerBg, color: C.danger }
};

const STATUS_WO = {
    Abierta: { bgcolor: C.neutral, color: C.slate },
    Proceso: { bgcolor: C.infoBg, color: C.info },
    Pendiente: { bgcolor: C.extremBg, color: C.white },
    Cancelada: { bgcolor: C.dangerBg, color: C.danger },
    Cerrada: { bgcolor: C.successBg, color: C.success }
};

const AVA_STYLES = {
    G: { bgcolor: C.lav50, color: C.lav700 },
    P: { bgcolor: C.teal50, color: C.teal700 },
    E: { bgcolor: "#FFF3CD", color: "#856404" },
};
const AREA_CHIP = {
    URGENCIAS: { bgcolor: "#F8D7DA", color: C.danger },
    UCI: { bgcolor: C.teal50, color: C.teal700 },
    NEONATOS: { bgcolor: C.lav50, color: C.lav700 },
    QUIRÓFANO: { bgcolor: "#FFF3CD", color: "#856404" },
    IMAGENOLOGÍA: { bgcolor: C.infoBg, color: C.info },
    LABORATIO: { bgcolor: "#FFF3CD", color: "#856404" },
};
const ROL_CHIP = {
    ADMINISTRADOR: { bgcolor: "#FFF3CD", color: "#856404" },
    COORDINADOR: { bgcolor: C.teal50, color: C.teal700 },
    OPERACIÓN: { bgcolor: C.lav50, color: C.lav700 },
};
const STATUS = {
    Activo: { dot: C.success, label: "Activo" },
    Pendiente: { dot: C.warning, label: "Pendiente" },
    Inactivo: { dot: C.danger, label: "Inactivo" },
};
const TYPES_CHIPS = {
    TYPE_SERVICES: {
        CORRECTIVO: { dot: C.corrective, label: "Correctivo", bgcolor: C.correctiveBg, color: C.corrective },
        PREVENTIVO: { dot: C.preventive, label: "Preventivo", bgcolor: C.preventiveBg, color: C.preventive },
        VENCIDO: { label: "Vencida", bgcolor: C.defeatedBg, color: C.defeated }
    },
    STATUS_WORK_ORDERS: {
        ABIERTA: { label: "Abierta", subLabel: "Programada", bgcolor: C.purpleChip, color: C.white },
        "EN PROCESO": { label: "En proceso", subLabel: "Iniciada", bgcolor: C.blueChip, color: C.white },
        PENDIENTE: { label: "Pendiente", subLabel: "En espera desde", bgcolor: C.yellowChip, color: C.white },
        CANCELADA: { label: "Cancelada", subLabel: "", bgcolor: C.defeated, color: C.white },
        CERRADA: { label: "Cerrada", subLabel: "", bgcolor: C.greenChip, color: C.white }
    },
    PRIORITIES: {
        HIGH: { dot: C.defeated, label: "Alta", bgcolor: C.defeatedBg, color: C.defeated },
        MEDIUM: { dot: C.yellowChip, label: "Media", bgcolor: C.yellowChipBg, color: C.yellowChip },
        LOW: { dot: C.success, label: "Baja", bgcolor: C.successBg, color: C.success }
    }
}

const PATH_TO_KEY = MENU_SECTIONS.flatMap(s => s.items)
    .reduce((acc, item) => ({ ...acc, [item.path]: item.key }), {});

const PATH_TO_LABEL = MENU_SECTIONS
    .flatMap(s => s.items)
    .reduce((acc, item) => ({ ...acc, [item.path]: item.label }), {});

export {
    DRAWER_WIDTH,
    COLLAPSED_WIDTH,
    C,
    APP_NAME,
    MENU_SECTIONS,
    PATH_TO_KEY,
    PATH_TO_LABEL,
    AVA_STYLES,
    ROL_CHIP,
    STATUS,
    APP_ABV_NAME,
    AREA_CHIP,
    PRIORITIES,
    PRIORITIES_LABEL,
    STATUS_REQ,
    STATUS_WO,
    TYPES_CHIPS
}
