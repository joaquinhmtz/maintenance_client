import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Snackbar,
  Badge,
  InputBase,
  Grid,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress,
  Tooltip,
  ListItemButton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  AccountBalance as PropertyIcon,
  Assignment as ContractIcon,
  People as PeopleIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  AccountCircle,
  ExitToApp,
  Person,
  Public as PublicIcon,
  Build as BuildIcon,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  SwapHoriz as SwitchIcon,
  Clear as ClearIcon,
  Receipt as ReceiptIcon,
  AccountBalanceWallet as WalletIcon,
  AccountBalance as AccountBalanceIcon,
  Description as DescriptionIcon,
  Message as MessageIcon,
  Assignment as AssignmentIcon,
  CalendarMonth as CalendarIcon,
  MedicalServices as MedicalIcon,
  Favorite as FavoriteIcon,
  BarChart as BarChartIcon,
  Money as MoneyIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Notifications as NotifIcon,
  ManageAccounts as ManageAccountsIcon,
  Logout as LogoutIcon,
  Star as StarIcon,
  Check as CheckIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  AccessTime as TimeIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

import { C, APP_NAME, DRAWER_WIDTH, COLLAPSED_WIDTH } from "../../theme/variables";
import PageHeader from "./../components/common/pageHeader";

export default function Dashboard() {

  const STATS = [
    { label: "Citas hoy", value: "12", sub: "pacientes", icon: <CalendarIcon />, color: C.teal500, bg: C.teal50, trend: "+2 vs ayer" },
    { label: "Pacientes activos", value: "348", sub: "total", icon: <PeopleIcon />, color: C.lav500, bg: C.lav50, trend: "+14 este mes" },
    { label: "Ingresos del mes", value: "$84,500", sub: "", icon: <MoneyIcon />, color: C.success, bg: C.successBg, trend: "+8% vs anterior" },
    { label: "Satisfacción", value: "96%", sub: "", icon: <StarIcon />, color: C.warning, bg: C.warningBg, trend: "Promedio 4.8★" },
  ];

  const APPOINTMENTS = [
    { id: 1, patient: "María López", initials: "ML", time: "09:00", treatment: "Limpieza dental", doctor: "Dra. García", status: "confirmed" },
    { id: 2, patient: "Carlos Ruiz", initials: "CR", time: "10:30", treatment: "Ortodoncia", doctor: "Dr. Méndez", status: "pending" },
    { id: 3, patient: "Ana Martínez", initials: "AM", time: "11:15", treatment: "Blanqueamiento", doctor: "Dra. García", status: "confirmed" },
    { id: 4, patient: "Luis Fernández", initials: "LF", time: "13:00", treatment: "Extracción", doctor: "Dr. Herrera", status: "cancelled" },
    { id: 5, patient: "Sofía Castro", initials: "SC", time: "15:00", treatment: "Revisión general", doctor: "Dra. García", status: "confirmed" },
  ];

  const STATUS_MAP = {
    confirmed: { label: "Confirmada", color: "success" },
    pending: { label: "Pendiente", color: "warning" },
    cancelled: { label: "Cancelada", color: "error" },
  };

  const ACTIVITY = [
    { icon: <CheckIcon sx={{ color: C.success, fontSize: 18 }} />, text: "Cita confirmada – María López", time: "hace 5 min" },
    { icon: <PersonIcon sx={{ color: C.teal500, fontSize: 18 }} />, text: "Nuevo paciente registrado – José Torres", time: "hace 18 min" },
    { icon: <WarningIcon sx={{ color: C.warning, fontSize: 18 }} />, text: "Cita pendiente – Carlos Ruiz", time: "hace 32 min" },
    { icon: <StarIcon sx={{ color: C.lav500, fontSize: 18 }} />, text: "Reseña 5 estrellas recibida", time: "hace 1 h" },
  ];

  const DOCTORS = [
    { name: "Dra. García", pct: 85, color: C.teal500 },
    { name: "Dr. Méndez", pct: 60, color: C.lav500 },
    { name: "Dr. Herrera", pct: 40, color: C.teal700 },
  ];

  return (

    <>
      <PageHeader
      title="Dashboard"
      subtitle="Resumen del día — lunes 01 de junio 2026"
    />


    {/* Stat cards */}
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {STATS.map((s, i) => (
        <Grid item xs={12} sm={6} lg={3} key={i}>
          <Card>
            <CardContent sx={{ p: "20px 24px !important" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography sx={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.grayBlue, mb: 0.5 }}>
                    {s.label}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: C.slate, lineHeight: 1.1 }}>{s.value}</Typography>
                    {s.sub && <Typography sx={{ fontSize: 13, color: C.grayBlue }}>{s.sub}</Typography>}
                  </Box>
                  <Typography sx={{ fontSize: 12, color: s.color, mt: 0.5, fontWeight: 500 }}>{s.trend}</Typography>
                </Box>
                <Box sx={{
                  width: 44, height: 44, borderRadius: "12px",
                  bgcolor: s.bg, display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Box sx={{ color: s.color, display: "flex" }}>{s.icon}</Box>
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ height: 3, bgcolor: s.color, borderRadius: "0 0 14px 14px", opacity: 0.7 }} />
          </Card>
        </Grid>
      ))}
    </Grid>

    <Grid container spacing={2}>

      {/* Tabla de citas */}
      <Grid item xs={12} lg={8}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon sx={{ color: C.teal500, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 15 }}>Citas de hoy</Typography>
                <Chip label="Lunes 01 Jun" size="small" sx={{ bgcolor: C.teal50, color: C.teal700, fontWeight: 600 }} />
              </Box>
              <Button variant="text" sx={{ color: C.teal500, fontWeight: 600, fontSize: 13 }}>Ver todas →</Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${C.teal50}`, borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["Paciente", "Hora", "Tratamiento", "Doctor", "Estado"].map(h => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {APPOINTMENTS.map(row => {
                    const s = STATUS_MAP[row.status];
                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Avatar sx={{ width: 30, height: 30, bgcolor: C.lav200, color: C.lav900, fontSize: 11, fontWeight: 700 }}>
                              {row.initials}
                            </Avatar>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{row.patient}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <TimeIcon sx={{ fontSize: 14, color: C.grayBlue }} />
                            <Typography sx={{ fontSize: 13, color: C.grayBlue }}>{row.time}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell><Typography sx={{ fontSize: 13 }}>{row.treatment}</Typography></TableCell>
                        <TableCell><Typography sx={{ fontSize: 13, color: C.teal700, fontWeight: 500 }}>{row.doctor}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={s.label}
                            size="small"
                            color={s.color}
                            variant="outlined"
                            sx={{ fontWeight: 700, fontSize: 11 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Panel derecho */}
      <Grid item xs={12} lg={4}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

          {/* Actividad reciente */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <TimeIcon sx={{ color: C.lav500, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 15 }}>Actividad reciente</Typography>
              </Box>
              <List disablePadding dense>
                {ACTIVITY.map((a, i) => (
                  <Box key={i}>
                    <ListItem disablePadding sx={{ py: 0.75, alignItems: "flex-start" }}>
                      <Box sx={{ mt: 0.25, mr: 1.25, flexShrink: 0 }}>{a.icon}</Box>
                      <Box>
                        <Typography sx={{ fontSize: 13, color: C.slate }}>{a.text}</Typography>
                        <Typography sx={{ fontSize: 11, color: C.grayBlue }}>{a.time}</Typography>
                      </Box>
                    </ListItem>
                    {i < ACTIVITY.length - 1 && <Divider sx={{ borderColor: "#F0F4F4" }} />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Ocupación */}
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <FavoriteIcon sx={{ color: C.teal500, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontSize: 15 }}>Ocupación hoy</Typography>
              </Box>
              {DOCTORS.map(d => (
                <Box key={d.name} sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate }}>{d.name}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.pct}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={d.pct}
                    sx={{
                      bgcolor: C.teal50,
                      "& .MuiLinearProgress-bar": { bgcolor: d.color },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

        </Box>
      </Grid>
    </Grid>
    </>
  )
}
