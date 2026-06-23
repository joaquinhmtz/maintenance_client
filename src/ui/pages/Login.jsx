import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  EmailOutlined as EmailOutlinedIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import logo from "./../../assets/logo.png";
import { useAuth } from "./../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { C } from "../../theme/variables";

export default function LoginPage() {

  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (val) => {
    if (!val) return "Ingresa tu correo electrónico";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return "Formato de correo no válido";
    return "";
  };

  const validatePassword = (val) => {
    if (!val) return "Ingresa tu contraseña";
    if (val.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      if (response && response.success === true) {
        navigate("/dashboard");
      }
    } catch (error) {
      setError("Credenciales incorrectas");
      console.error("Error al iniciar sesión: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  // Estilos reutilizables para los TextField con tema dark
  const textFieldSx = (hasError, hasValue) => ({
    "& .MuiOutlinedInput-root": {
      backgroundColor: C.card,
      borderRadius: 1.5,
      color: C.text,
      "& fieldset": {
        borderColor: hasError ? C.danger : C.border,
        borderWidth: "1px",
      },
      "&:hover fieldset": {
        borderColor: hasError ? C.danger : "#3F3F46",
      },
      "&.Mui-focused fieldset": {
        borderColor: hasError ? C.danger : C.primary,
        borderWidth: "1px",
      },
    },
    "& .MuiInputLabel-root": {
      color: C.textMuted,
      "&.Mui-focused": { color: hasError ? C.danger : C.primary },
    },
    "& .MuiFormHelperText-root": {
      color: C.danger,
      fontSize: "0.78rem",
    },
    "& input": {
      color: C.text,
      "&::placeholder": { color: C.textMuted },
      "&:-webkit-autofill": {
        WebkitBoxShadow: `0 0 0 100px ${C.card} inset`,
        WebkitTextFillColor: C.text,
      },
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: C.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          backgroundColor: C.surface,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 64px rgba(0,0,0,0.5)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            px: { xs: 3, sm: 5 },
            py: { xs: 5, sm: 6 },
          }}
        >
          {/* Logo */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              component="img"
              src={logo}
              alt="Zahn Molar Studio"
              sx={{
                width: { xs: 160, sm: 200 },
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
                // Si el logo es oscuro, invertirlo para dark mode:
                // filter: "brightness(0) invert(1)",
              }}
            />
          </Box>

          {/* Heading */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: C.text,
                mb: 0.5,
                fontWeight: 600,
                letterSpacing: "-0.5px",
                fontSize: "1.4rem",
              }}
            >
              Bienvenido de nuevo
            </Typography>
            <Typography variant="body2" sx={{ color: C.textMuted }}>
              Inicia sesión para continuar en tu clínica
            </Typography>
          </Box>

          {/* Error alert */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: 1.5,
                fontSize: "0.84rem",
                backgroundColor: C.dangerSubtle,
                color: C.danger,
                border: `1px solid ${C.danger}44`,
                "& .MuiAlert-icon": { color: C.danger },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Email */}
          <Box sx={{ mb: 2 }}>
            <TextField
              id="email"
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              autoFocus
              value={email}
              fullWidth
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
                if (error) setError("");
              }}
              onBlur={handleEmailBlur}
              error={!!emailError}
              helperText={emailError}
              sx={textFieldSx(!!emailError, !!email)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: emailError ? C.danger : email ? C.primary : C.textMuted,
                        transition: "color 0.2s",
                      }}
                    />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Password */}
          <Box sx={{ mb: 1 }}>
            <TextField
              id="password"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              fullWidth
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError("");
                if (error) setError("");
              }}
              onBlur={handlePasswordBlur}
              error={!!passwordError}
              helperText={passwordError}
              sx={textFieldSx(!!passwordError, !!password)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon
                      sx={{
                        fontSize: 18,
                        color: passwordError ? C.danger : password ? C.primary : C.textMuted,
                        transition: "color 0.2s",
                      }}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      sx={{
                        color: C.textMuted,
                        "&:hover": {
                          color: C.text,
                          backgroundColor: C.card,
                        },
                      }}
                    >
                      {showPassword
                        ? <VisibilityOffIcon sx={{ fontSize: 18 }} />
                        : <VisibilityIcon sx={{ fontSize: 18 }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* CTA Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 4,
              height: 48,
              backgroundColor: loading ? C.primaryMuted : C.primary,
              color: C.text,
              fontWeight: 500,
              fontSize: "0.95rem",
              letterSpacing: "0.01em",
              borderRadius: 1.5,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: C.primaryHover,
                boxShadow: `0 0 0 3px ${C.primary}33`,
              },
              "&:active": {
                backgroundColor: C.primaryMuted,
              },
              "&.Mui-disabled": {
                backgroundColor: C.primaryMuted,
                color: `${C.text}66`,
              },
              transition: "background-color 0.15s, box-shadow 0.15s",
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CircularProgress size={16} sx={{ color: C.text }} />
                <span>Verificando…</span>
              </Box>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}