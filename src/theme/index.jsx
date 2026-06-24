import { createTheme } from "@mui/material/styles";

// ── Paleta ────────────────────────────────────────────────────────
const C = {
  teal50:     "#E6F7F7",
  teal200:    "#80D6D6",
  teal500:    "#00ADAC",
  teal700:    "#007D7C",
  teal900:    "#004E4D",
  lav50:      "#F1EDF6",
  lav200:     "#C4AEDD",
  lav500:     "#8963A1",
  lav700:     "#644880",
  lav900:     "#3E2C52",
  menta:      "#F0FAF9",
  white:      "#FFFFFF",
  slate:      "#2E3A3A",
  grayBlue:   "#7A9090",
  success:    "#28A745",
  successBg:  "#D4EDDA",
  warning:    "#FFC107",
  warningBg:  "#FFF3CD",
  danger:     "#DC3545",
  dangerBg:   "#F8D7DA",
  info:       "#17A2B8",
  infoBg:     "#D1ECF1",
};

const theme = createTheme({
  palette: {
    primary:   { main: C.teal500, dark: C.teal700, light: C.teal200, contrastText: "#fff" },
    secondary: { main: C.lav500,  dark: C.lav700,  light: C.lav200,  contrastText: "#fff" },
    background:{ default: C.menta, paper: C.white },
    text:      { primary: C.slate, secondary: C.grayBlue },
    success:   { main: C.success,  light: C.successBg },
    warning:   { main: C.warning,  light: C.warningBg },
    error:     { main: C.danger,   light: C.dangerBg },
    info:      { main: C.info,     light: C.infoBg },
  },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    h6:  { fontWeight: 600, color: C.slate },
    subtitle1: { fontWeight: 500 },
    caption:   { color: C.grayBlue },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
        containedPrimary: { boxShadow: "none", "&:hover": { boxShadow: "none", background: C.teal700 } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: "none" },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { "& th": { background: C.teal50, color: C.teal900, fontWeight: 600, fontSize: 12, letterSpacing: "0.04em" } },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&:hover td": { background: C.teal50 }, "&:last-child td": { borderBottom: 0 } },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 8, margin: "1px 8px", width: "auto" },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 8, height: 8 },
        bar:  { borderRadius: 8 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 20, fontWeight: 600, fontSize: 11 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { background: C.teal700, color: "#fff", borderRight: "none" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: C.white,
          color: C.slate,
          boxShadow: `0 1px 8px rgba(0,173,172,0.08)`,
          borderBottom: `1px solid ${C.teal50}`,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(255,255,255,0.1)" },
      },
    },
  },
});

export default theme;