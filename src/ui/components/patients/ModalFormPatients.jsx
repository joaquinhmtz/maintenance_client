import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { IMaskInput } from 'react-imask';
import { NumericFormat } from 'react-number-format';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Grid,
    Box,
    Typography,
    useMediaQuery,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    InputAdornment,
    IconButton,
    Input
} from "@mui/material";
import {
    Badge as BadgeIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
} from "@mui/icons-material";
import { C } from "./../../../theme/variables";

const EMPTY = {
    nombre: "", apellido: "", email: "", telefono: "",
    rol: "", especialidad: "", notas: "",
    password: "", confirmPassword: "",
    activo: true, enviarBienvenida: true, cambiarPassword: true,
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="+52 00 0000 0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

TextMaskCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default function ModalFormPatients({ open, onClose, theme }) {

    const navigate = useNavigate();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [showPwd, setShowPwd] = useState(false);
    const [showCPwd, setShowCPwd] = useState(false);
    const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
    const [saving, setSaving] = useState(false);

    const GENDERS = [
        "Masculino", "Femenino"
    ];
    const STRENGTH_LABELS = ["", "Débil", "Regular", "Buena", "Fuerte"];
    const STRENGTH_COLORS = ["", C.danger, C.warning, C.teal500, C.success];

    const set = useCallback((field) => (e) => {
        const val = e.target?.value ?? e;
        setForm(prev => ({ ...prev, [field]: val }));
        setErrors(prev => ({ ...prev, [field]: "" }));
    }, []);

    const handleClose = () => {
        onClose();
    };

    function calcStrength(pwd) {
        if (!pwd) return 0;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const strength = calcStrength(form.password);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const email = formJson.email;
        console.log(email);
        handleClose();
    };

    function SectionLabel({ icon, children }) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Box sx={{ color: C.teal500, display: "flex", fontSize: 14 }}>{icon}</Box>
                <Typography sx={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", color: C.grayBlue,
                }}>
                    {children}
                </Typography>
                <Box sx={{ flex: 1, height: "0.5px", bgcolor: "divider", ml: 1 }} />
            </Box>
        );
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Nuevo paciente</DialogTitle>
                <DialogContent>
                    <SectionLabel icon={<BadgeIcon />}>Información personal</SectionLabel>

                    <form onSubmit={handleSubmit} id="subscription-form">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Nombre(s)"
                                    required
                                    fullWidth
                                    size="small"
                                    onChange={set("name")}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    placeholder="Ej. Ana"
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Apellido paterno"
                                    required
                                    fullWidth
                                    size="small"
                                    onChange={set("lastName")}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    placeholder="Ej. García"
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Apellido materno"
                                    required
                                    fullWidth
                                    size="small"
                                    onChange={set("lastName2")}
                                    error={!!errors.lastName2}
                                    helperText={errors.lastName2}
                                    placeholder="Ej. Luna"
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    type="date"
                                    label="Fecha de nacimiento"
                                    required
                                    fullWidth
                                    size="small"
                                    onChange={set("birthdate")}
                                    error={!!errors.birthdate}
                                    helperText={errors.birthdate}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl
                                    fullWidth
                                    size="small"
                                    required
                                    error={!!errors.gender}
                                >
                                    <InputLabel>Género</InputLabel>
                                    <Select value={form.gender} label="Género" onChange={set("gender")}>
                                        {GENDERS.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                    </Select>
                                    {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>

                        <SectionLabel icon={<LockIcon />}>Contacto</SectionLabel>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Correo electrónico" required fullWidth size="small" type="email"
                                    value={form.email}
                                    onChange={set("email")}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    placeholder="usuario@dentalcare.mx"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    label="Teléfono"
                                    required
                                    fullWidth
                                    size="small"
                                    name="phoneNumber"
                                    value={form.phoneNumber || ""}
                                    onChange={set("phoneNumber")}
                                    error={!!errors.phoneNumber}
                                    helperText={errors.phoneNumber}
                                    InputProps={{
                                        inputComponent: TextMaskCustom,
                                    }}
                                />
                            </Grid>
                        </Grid>

                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="subscription-form"
                        color="primary"
                        disabled={saving}
                        variant="contained"
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}