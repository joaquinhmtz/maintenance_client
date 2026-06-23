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
    IconButton,
    Collapse,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Chip,
} from "@mui/material";
import {
    Badge as BadgeIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    LocalHospital as HospitalIcon,
    KeyboardArrowDown as ArrowDownIcon,
    KeyboardArrowUp as ArrowUpIcon,
} from "@mui/icons-material";
import { C } from "../../../theme/variables";
import utilServices from "../../../services/utils";
import PasswordStrength from "../common/passwordStrength";
import useNotification from "../../../../hooks/useNotification";
import AppSnackbar from "../common/appSnackbar";

const ADMIN_PROFILE_ID = "6a39d75db00e468e7815a773";

const defaultValues = {
    name: "",
    lastname: "",
    lastname2: "",
    profile: "",
    email: "",
    hospitals: [],
    password: "",
    confirmPassword: "",
    active: true,
    changePassword: true
};

export default function ModalFormUsers({ open, onClose, theme, idUser = null }) {

    const isEdit = !!idUser;

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues
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
    const [saving, setSaving] = useState(false);
    const [profiles, setProfiles] = useState([]);
    const [hospitals, setHospitals] = useState([]);

    const [changePassword, setChangePassword] = useState(!isEdit);
    const [userLoaded, setUserLoaded] = useState(false);

    const password = watch("password");
    const profileSelected = watch("profile");
    const hospitalsSelected = watch("hospitals");

    useEffect(() => {
        if (isEdit && idUser) {
            setChangePassword(false);
            setValue("changePassword", false);
            setUserLoaded(false); // resetear al abrir
        } else {
            reset({ ...defaultValues, changePassword: true });
            setChangePassword(true);
            setUserLoaded(false);
        }
    }, [isEdit, idUser, open]);

    // ── Catálogos ────────────────────────────────────────────────────────────
    useEffect(() => {
        getProfiles();
        getHospitals();
    }, []);

    useEffect(() => {
        if (userLoaded) return;

        if (profileSelected === ADMIN_PROFILE_ID && hospitals.length > 0) {
            setValue("hospitals", hospitals.map(h => h._id));
        } else if (!isEdit) {
            // Solo limpiar en alta, nunca en edición
            setValue("hospitals", []);
        }
    }, [profileSelected, hospitals]);

    useEffect(() => {
        if (isEdit && idUser && profiles.length && hospitals.length) {
            loadUser();
        }
    }, [isEdit, idUser, profiles, hospitals]);

    const getProfiles = async () => {
        try {
            const response = await utilServices.getCatalogProfiles();
            setProfiles(response?.data || []);
        } catch (err) {
            console.error("Error al obtener los perfiles:", err);
            showError("Hubo un problema al obtener los perfiles");
        }
    };

    const getHospitals = async () => {
        try {
            const response = await utilServices.getHospitals();
            setHospitals(response?.data || []);
        } catch (err) {
            console.error("Error al obtener los hospitales:", err);
            showError("Hubo un problema al obtener los hospitales");
        }
    };

    const loadUser = async () => {
        try {
            const response = await userServices.getUserById(idUser);
            const item = response?.data?.user;
            if (!item) throw new Error("Item no encontrado");
            reset({
                name: item.name ?? "",
                lastname: item.lastname ?? "",
                lastname2: item.lastname2 ?? "",
                profile: item.profile ?? "",
                email: item.email ?? "",
                hospitals: item.hospitals ?? [],
                password: "",
                confirmPassword: "",
                active: item.active ?? true,
                changePassword: false,
            });

            setUserLoaded(true);
        } catch (err) {
            console.error("Error al cargar el usuario:", err);
            showError("No se pudo cargar la información del usuario");
        }
    };

    const handleClose = ({ refresh = false }) => {
        reset();
        setShowPwd(false);
        setShowCPwd(false);
        setChangePassword(!isEdit);
        onClose({ refresh });
    };

    const onSubmit = async (data) => {
        try {
            setSaving(true);

            const { changePassword: _flag, confirmPassword: _confirm, ...payload } = data;

            // Si no quiere cambiar contraseña, quitarla del payload
            if (!data.changePassword) {
                delete payload.password;
            }

            if (isEdit) {
                await userServices.updateUser(idUser, payload);
                showSuccess("Usuario actualizado correctamente");
            } else {
                await userServices.saveUser(payload);
                showSuccess("Usuario registrado correctamente");
            }

            setTimeout(() => handleClose({ refresh: true }), 500);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al ${isEdit ? "actualizar" : "guardar"} el usuario`);
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePassword = () => {
        const next = !changePassword;
        setChangePassword(next);
        setValue("changePassword", next);
        if (!next) {
            setValue("password", "");
            setValue("confirmPassword", "");
            setShowPwd(false);
            setShowCPwd(false);
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

    const isAdminProfile = profileSelected === ADMIN_PROFILE_ID;

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={fullScreen}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    {isEdit ? "Editar usuario" : "Nuevo usuario"}
                </DialogTitle>

                <DialogContent>
                    <form id="user-form" onSubmit={handleSubmit(onSubmit)}>

                        {/* ── Información personal ── */}
                        <SectionLabel icon={<BadgeIcon />}>Información personal</SectionLabel>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Controller name="name" control={control} render={({ field }) => (
                                    <TextField {...field} label="Nombre(s)" fullWidth size="small"
                                        error={!!errors.name} helperText={errors.name?.message}
                                        placeholder="Ej. Enrique" autoComplete="off" />
                                )} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller name="lastname" control={control} render={({ field }) => (
                                    <TextField {...field} label="Apellido paterno" fullWidth size="small"
                                        error={!!errors.lastname} helperText={errors.lastname?.message} autoComplete="off" />
                                )} />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller name="lastname2" control={control} render={({ field }) => (
                                    <TextField {...field} label="Apellido materno" fullWidth size="small"
                                        error={!!errors.lastname2} helperText={errors.lastname2?.message} autoComplete="off" />
                                )} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                            <Grid item xs={12} md={4}>
                                <Controller name="profile" control={control} render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.profile}>
                                        <InputLabel>Perfil</InputLabel>
                                        <Select {...field} label="Perfil">
                                            {profiles.map(item => (
                                                <MenuItem key={item._id} value={item._id}>{item.value}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{errors.profile?.message}</FormHelperText>
                                    </FormControl>
                                )} />
                            </Grid>
                        </Grid>

                        {/* ── Hospitales ── */}
                        <SectionLabel icon={<HospitalIcon />}>Hospitales asignados</SectionLabel>

                        <Grid container spacing={2} style={{ marginBottom: 16 }}>
                            <Grid item xs={12}>
                                <Controller name="hospitals" control={control} render={({ field }) => (
                                    <FormControl fullWidth size="small" error={!!errors.hospitals}>
                                        <InputLabel>Hospitales</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            label="Hospitales"
                                            input={<OutlinedInput label="Hospitales" />}
                                            disabled={isAdminProfile}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                                    {isAdminProfile ? (
                                                        <Chip label="Todos los hospitales" size="small"
                                                            sx={{ bgcolor: C.teal500, color: "#fff", fontWeight: 600 }} />
                                                    ) : (
                                                        selected.map(id => {
                                                            const h = hospitals.find(h => h._id === id);
                                                            return h ? (
                                                                <Chip key={id} label={h.value} size="small" />
                                                            ) : null;
                                                        })
                                                    )}
                                                </Box>
                                            )}
                                        >
                                            {hospitals.map(item => (
                                                <MenuItem key={item._id} value={item._id}>
                                                    <Checkbox
                                                        checked={field.value?.includes(item._id)}
                                                        size="small"
                                                        sx={{ py: 0, color: C.teal500, "&.Mui-checked": { color: C.teal500 } }}
                                                    />
                                                    <ListItemText primary={item.value} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>
                                            {errors.hospitals?.message
                                                ?? (isAdminProfile ? "El perfil administrador tiene acceso a todos los hospitales" : undefined)}
                                        </FormHelperText>
                                    </FormControl>
                                )} />
                            </Grid>
                        </Grid>

                        {/* ── Información de la cuenta ── */}
                        <SectionLabel icon={<LockIcon />}>Información de la cuenta</SectionLabel>

                        <Grid container spacing={2} style={{ marginBottom: 8 }}>
                            <Grid item xs={12} md={4}>
                                <Controller name="email" control={control} render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Correo electrónico"
                                        type="email"
                                        fullWidth size="small"
                                        error={!!errors.email}
                                        helperText={errors.email?.message
                                            ?? (isEdit ? "El correo no puede modificarse" : undefined)}
                                        disabled={isEdit}
                                        InputProps={{ readOnly: isEdit }}
                                        autoComplete="off"
                                        sx={isEdit ? {
                                            "& .MuiInputBase-input.Mui-disabled": {
                                                WebkitTextFillColor: C.grayBlue,
                                            }
                                        } : undefined}
                                    />
                                )} />
                            </Grid>
                        </Grid>

                        {/* Botón toggle — reemplazar el onClick inline */}
                        {isEdit && (
                            <Box sx={{ mb: 1 }}>
                                <Button
                                    size="small"
                                    variant="text"
                                    onClick={handleTogglePassword}  // 👈
                                    endIcon={changePassword ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                    sx={{
                                        color: C.teal500,
                                        fontWeight: 600,
                                        fontSize: 12,
                                        textTransform: "none",
                                        px: 0,
                                    }}
                                >
                                    {changePassword ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
                                </Button>
                            </Box>
                        )}

                        {/* ── Campos de contraseña ── */}
                        <Collapse in={changePassword} unmountOnExit>
                            <Grid container spacing={2} style={{ marginBottom: 16 }}>
                                <Grid item xs={12} md={4}>
                                    <Controller name="password" control={control} render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Contraseña"
                                            type={showPwd ? "text" : "password"}
                                            fullWidth size="small"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => setShowPwd(p => !p)} edge="end">
                                                            {showPwd
                                                                ? <VisibilityOffIcon fontSize="small" />
                                                                : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )} />
                                    <PasswordStrength password={password} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Controller name="confirmPassword" control={control} render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Confirmar contraseña"
                                            type={showCPwd ? "text" : "password"}
                                            fullWidth size="small"
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword?.message}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => setShowCPwd(p => !p)} edge="end">
                                                            {showCPwd
                                                                ? <VisibilityOffIcon fontSize="small" />
                                                                : <VisibilityIcon fontSize="small" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    )} />
                                </Grid>
                            </Grid>
                        </Collapse>

                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>Cancelar</Button>
                    <Button
                        type="submit"
                        form="user-form"
                        variant="contained"
                        disabled={isSubmitting || saving}
                    >
                        {isEdit ? "Actualizar" : "Guardar"}
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