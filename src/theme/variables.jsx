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
    danger: "#DC3545",
    dangerBg: "#F8D7DA",
    info: "#17A2B8",
    infoBg: "#D1ECF1",
    neutral: "#E0E0E0",
    neutralBg: "#F5F5F5",
    extremBg: "#0A0A0A"
};

const APP_NAME = "Mantenimiento";
const APP_ABV_NAME = "Mtm";

const MENU_SECTIONS = [
    {
        items: [
            { key: "dashboard", label: "Dashboard",   icon: <DashboardIcon />, path: "/dashboard" },
            // { key: "tratamientos", label: "Tratamientos", icon: <MedicalIcon />, path: "/tratamientos" },
            // { key: "expedientes",  label: "Expedientes",  icon: <DescriptionIcon />, path: "/expedientes" },
        ],
    },
    {
        subheader: "Mantenimiento",
        items: [
            { key: "request", label: "Solicitudes",   icon: <WorkOrderIcon />, path: "/requests" },
            { key: "work-orders",  label: "Ordenes",  icon: <DescriptionIcon />, path: "/work-orders" },
        ],
    },
    {
        subheader: "Administración",
        items: [
            { key: "hospitals", label: "Hospitales", icon: <HospitalIcon />,     path: "/hospitals" },
            { key: "items", label: "Equipos", icon: <InventoryIcon />,     path: "/items" },
            { key: "users",  label: "Usuarios",   icon: <PeopleIcon />, path: "/users" },
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
    STATUS_REQ
}
