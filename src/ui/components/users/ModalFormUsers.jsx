import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../../../schemas/user.schema";
import userServices from "../../../services/user";
import {
    Dialog,
    DialogTitle,
    DialogContent,
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
    IconButton
} from "@mui/material";
import {
    Badge as BadgeIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
} from "@mui/icons-material";
import { C } from "../../../theme/variables";
import utilServices from "../../../services/utils";
import PasswordStrength from "../common/passwordStrength";
import useNotification from "../../../../hooks/useNotification";
import AppSnackbar from "../common/appSnackbar";

export default function ModalFormUsers({ open, onClose, theme }) {

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: "",
            lastname: "",
            lastname2: "",
            profile: "",
            email: "",
            password: "",
            confirmPassword: "",
            active: true
        }
    });
    const {
        notification,
        showSuccess,
        showError,
        closeNotification
    } = useNotification();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [showPwd, setShowPwd] = useState(false);
    const [showCPwd, setShowCPwd] = useState(false);
    const [toast, setToast] = useState({ open: false, msg: "", severity: "success" });
    const [saving, setSaving] = useState(false);
    const [profiles, setProfiles] = useState([]);

    const password = watch("password");

    useEffect(() => {
        getProfiles();
    }, []);

    const handleClose = () => {
        reset();
        setShowPwd(false);
        setShowCPwd(false);
        onClose();
    };

    const getProfiles = async () => {
        try {
            const response = await utilServices.getCatalogProfiles();
            setProfiles(response?.data);
        } catch (err) {
            console.error("Error al obtener los perfiles: ", err);
            setToast({
                open: true,
                msg: "Hubo un problema al obtener los perfiles",
                severity: "error"
            });
        }
    }

    const onSubmit = async (data) => {

        try {

            setSaving(true);
            data["speciality"] = specialities.find(s => s._id === data.speciality);
            
            await userServices.saveUser(data);

            showSuccess("Doctor registrado correctamente");

            setTimeout(() => {
                handleClose();
            }, 500);

        } catch (error) {

            console.error(error);
            showError("Hubo un error al guardar el doctor");

        } finally {

            setSaving(false);

        }
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
                <DialogTitle>Nuevo usuario</DialogTitle>
                <DialogContent>
                    <SectionLabel icon={<BadgeIcon />}>Información personal</SectionLabel>

                    <form
                        id="user-form"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Nombre(s)"
                                            fullWidth
                                            size="small"
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            placeholder="Ej. Enrique"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="lastname"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Apellido paterno"
                                            fullWidth
                                            size="small"
                                            error={!!errors.lastname}
                                            helperText={errors.lastname?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="lastname2"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Apellido materno"
                                            fullWidth
                                            size="small"
                                            error={!!errors.lastname2}
                                            helperText={errors.lastname2?.message}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="profile"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl
                                            fullWidth
                                            size="small"
                                            error={!!errors.profile}
                                        >
                                            <InputLabel>
                                                Perfil
                                            </InputLabel>

                                            <Select
                                                {...field}
                                                label="Perfil"
                                            >
                                                {
                                                    profiles.map(item => (
                                                        <MenuItem
                                                            key={item._id}
                                                            value={item._id}
                                                        >
                                                            {item.value}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </Select>

                                            <FormHelperText>
                                                {errors.profile?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>

                        <SectionLabel icon={<LockIcon />}>Información de la cuenta</SectionLabel>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Correo electrónico"
                                            type="email"
                                            fullWidth
                                            size="small"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Contraseña"
                                            type={showPwd ? "text" : "password"}
                                            fullWidth
                                            size="small"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => setShowPwd(p => !p)} edge="end">
                                                            {showPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                {/* Barra de fortaleza */}
                                <PasswordStrength password={password} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="confirmPassword"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Confirmar contraseña"
                                            type={showCPwd ? "text" : "password"}
                                            fullWidth
                                            size="small"
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => setShowCPwd(p => !p)} edge="end">
                                                            {showCPwd ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )}
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
                        form="user-form"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>


            <AppSnackbar
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={closeNotification}
            />
        </>
    );
}