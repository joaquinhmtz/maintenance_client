import {
  Drawer, Box, Typography, Avatar, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText,
  Tooltip, Divider, Badge,
} from "@mui/material";
import { MedicalServices as MedicalIcon, Circle as CircleIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { C, DRAWER_WIDTH, COLLAPSED_WIDTH, MENU_SECTIONS, PATH_TO_KEY, APP_NAME } from "../../theme/variables";
import iconLogo from "./../../assets/iconLogo.png";

export default function Sidebar({ open, onClose, isMobile, theme }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const activeKey = PATH_TO_KEY[location.pathname] ?? "dashboard";

  const handleSelect = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: !isMobile ? (open ? DRAWER_WIDTH : COLLAPSED_WIDTH) : DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: !isMobile ? (open ? DRAWER_WIDTH : COLLAPSED_WIDTH) : DRAWER_WIDTH,
          overflowX: "hidden",
          transition: theme.transitions.create(["width"], {
            duration: 200,
            easing: theme.transitions.easing.easeInOut,
          }),
        },
      }}
    >
      {/* Logo */}
      <Box sx={{
        px: open ? 2.5 : 1, py: 2.5,
        display: "flex", alignItems: "center", gap: 1.5,
        borderBottom: "0.5px solid rgba(255,255,255,0.1)",
        minHeight: 54, transition: "padding 0.2s",
      }}>
        <Box 
          component="img"
          src={iconLogo}
        sx={{
          width: 36, height: 36, borderRadius: "10px", flexShrink: 0,
          //background: `linear-gradient(135deg, ${C.teal200}, ${C.lav500})`,
          background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "2px",
                        objectFit: "contain"
        }}>
          {/* <MedicalIcon sx={{ color: "#fff", fontSize: 20 }} /> */}
        </Box>
        {open && (
          <Box sx={{ overflow: "hidden" }}>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 15, lineHeight: 1.2, whiteSpace: "nowrap" }}>
              {APP_NAME}
            </Typography>
            <Typography sx={{ color: C.teal200, fontSize: 11, whiteSpace: "nowrap" }}>
              Sistema clínico dental
            </Typography>
          </Box>
        )}
      </Box>

      {/* Usuario activo */}
      {/* {open && (
        <Box sx={{
          px: 2.5, py: 1.5,
          borderBottom: "0.5px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", gap: 1.5,
        }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: C.lav500, fontSize: 13, fontWeight: 700 }}>
            AG
          </Avatar>
          <Box>
            <Typography sx={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>
              Dra. Ana García
            </Typography>
            <Typography sx={{ color: C.teal200, fontSize: 11 }}>Administradora</Typography>
          </Box>
        </Box>
      )} */}

      {/* Menú */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", py: 1 }}>
        {MENU_SECTIONS.map((section, si) => (
          <Box key={si}>
            {section.subheader && open && (
              <Typography sx={{
                px: 2.5, pt: 2, pb: 0.5,
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
              }}>
                {section.subheader}
              </Typography>
            )}
            {si > 0 && !open && <Divider sx={{ my: 1, mx: 1, borderColor: "rgba(255,255,255,0.1)" }} />}
            <List dense disablePadding>
              {section.items.map(item => (
                <Tooltip key={item.key} title={!open ? item.label : ""} placement="right" arrow>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      selected={activeKey === item.key}
                      onClick={() => handleSelect(item.path)}
                      sx={{
                        minHeight: 40,
                        px: open ? 1.5 : 1,
                        justifyContent: open ? "initial" : "center",
                        "&.Mui-selected": {
                          bgcolor: C.lav700,
                          "& .MuiListItemIcon-root": { color: "#fff" },
                          "& .MuiListItemText-primary": { color: "#fff" },
                          "&:hover": { bgcolor: C.lav700 },
                        },
                        "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                      }}
                    >
                      <ListItemIcon sx={{
                        minWidth: open ? 36 : "auto",
                        color: "rgba(255,255,255,0.65)",
                        justifyContent: "center",
                      }}>
                        {item.badge ? (
                          <Badge
                            badgeContent={item.badge}
                            sx={{ "& .MuiBadge-badge": { bgcolor: C.lav500, color: "#fff", fontSize: 9, minWidth: 16, height: 16 } }}
                          >
                            {item.icon}
                          </Badge>
                        ) : item.icon}
                      </ListItemIcon>
                      {open && (
                        <ListItemText
                          primary={item.label}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: activeKey === item.key ? 600 : 400,
                            color: "rgba(255,255,255,0.8)",
                            noWrap: true,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* Estado del sistema */}
      <Box sx={{
        px: open ? 2.5 : 0, py: 1.5,
        borderTop: "0.5px solid rgba(255,255,255,0.1)",
        display: "flex", alignItems: "center",
        justifyContent: open ? "flex-start" : "center",
        gap: 1,
      }}>
        <CircleIcon sx={{ fontSize: 8, color: C.success }} />
        {open && (
          <Typography sx={{ color: "rgba(255,255,255,0.4)", fontSize: 11, whiteSpace: "nowrap" }}>
            Sistema en línea
          </Typography>
        )}
      </Box>
    </Drawer>
  );
}