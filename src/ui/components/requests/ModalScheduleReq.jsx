import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "../../../../schemas/scheduleReq.schema";
import utilServices from "../../../services/utils";
import requestServices from "../../../services/request";
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
    FormHelperText
} from "@mui/material";
import {
    CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { C } from "../../../theme/variables";
import useNotification from "../../../../hooks/useNotification";
import AppSnackbar from "../common/appSnackbar";

const defaultValues = {
    visitDate: "",
    visitManager: ""
};

export default function ModalScheduleReq({ 
    open, onClose, theme, idReq = null, folio = null, item = null, hospital = null 
}) {

    const isEdit = !!idReq;

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(scheduleSchema),
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
    
    const [responsibles, setResponsibles] = useState([]);

    useEffect(() => {
        getResponsibles();
    }, []);

    const getResponsibles = async () => {
        try {
            const response = await utilServices.getResponsibles();
            setResponsibles(response?.data || []);
        } catch (err) {
            console.error("Error al obtener responsables:", err);
        }
    };

    const handleClose = ({ refresh = false }) => {
        reset();
        onClose({ refresh });
    };

    const onSubmit = async (data) => {
        try {
            setSaving(true);

            const finalObj = {
                _id: idReq,
                ...data,
                item: item?._id,
                itemSnapshot: { ...item },
                hospital: hospital?._id
            };

            await requestServices.scheduleReq(idReq, finalObj);
            showSuccess("La solicitud programada correctamente");

            setTimeout(() => handleClose({ refresh: true }), 500);

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al programar la solicitud`);
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
                    {`${ folio } (Programar)`}
                </DialogTitle>

                <DialogContent>
                    <form id="user-form" onSubmit={handleSubmit(onSubmit)}>

                        <SectionLabel icon={<CalendarIcon />}>Programación</SectionLabel>
                        <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="visitDate"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Fecha de visita"
                                            type="date"
                                            fullWidth
                                            size="small"
                                            error={!!errors.visitDate}
                                            helperText={errors.visitDate?.message}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Controller
                                    name="visitManager"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth size="small" error={!!errors.visitManager}>
                                            <InputLabel>Responsable visita</InputLabel>
                                            <Select
                                                {...field}
                                                label="Responsable visita"
                                                renderValue={(selected) => {
                                                    const responsible = responsibles.find(
                                                        x => x._id === selected
                                                    );

                                                    return responsible?.fullname || "";
                                                }}
                                            >
                                                {responsibles.map(item => (
                                                    <MenuItem key={item._id} value={item._id}>
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <strong style={{ fontSize: 13 }}>
                                                                {item.fullname}
                                                            </strong>
                                                            <span style={{ fontSize: 12, color: "#666" }}>
                                                                {item.profile}
                                                            </span>
                                                        </div>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {errors.visitManager?.message}
                                            </FormHelperText>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={saving}>Cancelar</Button>
                    <Button
                        color="secondary"
                        type="submit"
                        form="user-form"
                        variant="contained"
                        disabled={isSubmitting || saving}
                        // onClick={() => {
                        //     setValue("action", "programar");
                        //     handleSubmit(onSubmit)();
                        // }}
                    >
                        Programar
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