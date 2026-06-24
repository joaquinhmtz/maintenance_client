import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hospitalSchema } from "../../../../schemas/hospital.schema";
import hospitalServices from "../../../services/hospital";
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
} from "@mui/material";
import {
    Badge as BadgeIcon,
} from "@mui/icons-material";
import { C } from "../../../theme/variables";
import useNotification from "../../../../hooks/useNotification";
import AppSnackbar from "../common/appSnackbar";

const defaultValues = {
    name: "",
    active: true
};

export default function ModalFormHospitals({ open, onClose, theme, idHospital = null }) {

    const isEdit = !!idHospital;

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(hospitalSchema),
        defaultValues
    });

    const {
        notification,
        showSuccess,
        showError,
        closeNotification
    } = useNotification();

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [saving, setSaving] = useState(false);

    const [hospLoaded, setHospLoaded] = useState(false);

    useEffect(() => {
        if (isEdit && idHospital) {
            setHospLoaded(false);
        } else {
            reset({ ...defaultValues });
            setHospLoaded(false);
        }
    }, [isEdit, idHospital, open]);

    useEffect(() => {
        if (isEdit && idHospital) {
            loadHospital();
        }
    }, [isEdit, idHospital]);

    const loadHospital = async () => {
        try {
            const response = await hospitalServices.getHospById(idHospital);
            const hosp = response?.data?.hospital;
            if (!hosp) throw new Error("Hospital no encontrado");
            reset({
                name: hosp.name ?? "",
                active: hosp.active
            });

            setHospLoaded(true);
        } catch (err) {
            console.error("Error al cargar el hospital:", err);
            showError("No se pudo cargar la información del hospital");
        }
    };

    const handleClose = ({ refresh = false }) => {
        reset();
        onClose({ refresh });
    };

    const onSubmit = async (data) => {
        try {
            setSaving(true);

            if (isEdit) {
                await hospitalServices.updateHospital(idHospital, data);
                showSuccess("Hospital actualizado correctamente");
            } else {
                await hospitalServices.saveHospital(data);
                showSuccess("Hospital registrado correctamente");
            }

            setTimeout(() => handleClose({ refresh: true }), 500);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al ${isEdit ? "actualizar" : "guardar"} el hospital`);
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
                <DialogTitle>
                    {isEdit ? "Editar hospital" : "Nuevo hospital"}
                </DialogTitle>

                <DialogContent>
                    <form id="user-form" onSubmit={handleSubmit(onSubmit)}>

                        {/* ── Información ── */}
                        <SectionLabel icon={<BadgeIcon />}>Información</SectionLabel>

                        <Grid container spacing={2}>
                            <Grid item xs={12} md={12}>
                                <Controller name="name" control={control} render={({ field }) => (
                                    <TextField {...field} label="Nombre" fullWidth size="small"
                                        error={!!errors.name} helperText={errors.name?.message}
                                        placeholder="Ej. Hospital del Niño" autoComplete="off" />
                                )} />
                            </Grid>
                        </Grid>
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