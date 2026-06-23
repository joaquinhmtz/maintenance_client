import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from "@mui/material";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Add as AddIcon,
  Notifications as NotifIcon,
  ManageAccounts as ManageAccountsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { DRAWER_WIDTH, C, PATH_TO_LABEL, APP_NAME, APP_ABV_NAME } from "../../theme/variables";

export default function TopBar({ theme, sideOpen, anchorEl, setSideOpen, setAnchorEl, isMobile }) {

  const location  = useLocation();
  const activeKey = PATH_TO_LABEL[location.pathname] ?? "dashboard";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          md: `calc(100% - ${sideOpen ? DRAWER_WIDTH : 64}px)`
        },
        ml: {
          md: `${sideOpen ? DRAWER_WIDTH : 64}px`
        },
        transition: theme.transitions.create(
          ["width", "margin-left"],
          {
            duration: 150,
            easing: theme.transitions.easing.easeInOut
          }
        ),
      }}
    >
      <Toolbar sx={{ gap: 2, px: { xs: 2, sm: 3 } }}>

        {/* Toggle sidebar */}
        <IconButton onClick={() => setSideOpen(prev => !prev)} sx={{ color: C.teal700 }}>
          {sideOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>

        {/* Breadcrumb */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ color: C.grayBlue, fontSize: 13 }}>{ isMobile ? APP_ABV_NAME : APP_NAME}</Typography>
          <Typography sx={{ color: C.grayBlue, fontSize: 13 }}>›</Typography>
          <Typography sx={{ color: C.teal700, fontSize: 13, fontWeight: 600 }}>{activeKey}</Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Acciones */}
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="small"
          sx={{ whiteSpace: "nowrap" }}
        >
          Nueva cita
        </Button>

        <IconButton>
          <Badge badgeContent={3} sx={{ "& .MuiBadge-badge": { bgcolor: C.lav500, color: "#fff" } }}>
            <NotifIcon sx={{ color: C.slate, fontSize: 22 }} />
          </Badge>
        </IconButton> */}

        {/* Avatar de usuario */}
        <Box
          onClick={e => setAnchorEl(e.currentTarget)}
          sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", userSelect: "none" }}
        >
          <Avatar sx={{
            width: 36, height: 36, fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg, ${C.teal500}, ${C.lav500})`,
          }}>AG</Avatar>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: C.slate, lineHeight: 1.2 }}>Dra. García</Typography>
            <Typography sx={{ fontSize: 11, color: C.grayBlue }}>Administradora</Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" } }}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><ManageAccountsIcon fontSize="small" sx={{ color: C.teal500 }} /></ListItemIcon>
            Mi perfil
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><SettingsIcon fontSize="small" sx={{ color: C.teal500 }} /></ListItemIcon>
            Configuración
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => setAnchorEl(null)} sx={{ color: C.danger }}>
            <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: C.danger }} /></ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>

      </Toolbar>
    </AppBar>
  );
}
