import {
    Box,
    CircularProgress
} from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./../../../context/AuthContext";

export function ProtectedRoute({ redirectTo = "/", allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // No autenticado → al login
  if (!user) return <Navigate to={redirectTo} replace />;

  // Autenticado pero sin el rol requerido → al dashboard
//   if (allowedRoles && !allowedRoles.includes(user.rol)) {
//     return <Navigate to="/dashboard" replace />;
//   }

  return <Outlet />;
}

// Pantalla de carga mientras verifica la sesión
function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}