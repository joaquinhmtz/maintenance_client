import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card, CardContent, CardActions, Button, TextField,
    Grid, Box, Typography, FormControl, InputLabel,
    Select, MenuItem, FormHelperText, Divider, CircularProgress,
    Autocomplete, FormLabel, RadioGroup, FormControlLabel,
    Radio
} from "@mui/material";
import {
    LocationCity as LocationIcon
} from "@mui/icons-material";
import { requestSchema } from "../../../../schemas/request.schema";
import utilServices from "../../../services/utils";
import requestServices from "../../../services/request";
import useNotification from "./../../../../hooks/useNotification";
import PageHeader from "../../components/common/pageHeader";
import AppSnackbar from "../../components/common/appSnackbar";
import SectionLabel from "./../../components/common/sectionLabel";

export default function RequestForm({ isEdit = false }) {

    const navigate = useNavigate();
    const { id } = useParams();

    const {
        control,
        handleSubmit,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(requestSchema),
        defaultValues: {
            hospital: "",
            item: "",
            priority: "MEDIUM",
            typeService: "",
            description: "",
            responsible: "",
        }
    });

    const { notification, showSuccess, showError, closeNotification } = useNotification();

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const [hospitals, setHospitals] = useState([]);
    const [items, setItems] = useState([]);
    const [services, setServices] = useState([]);
    const [responsibles, setResponsibles] = useState([]);

    const hospitalSelected = watch("hospital");

    useEffect(() => {
        getHospitals();
        getTypeServices();
        getResponsibles();
    }, []);

    useEffect(() => {
        if (isEdit && id && hospitals.length && services.length && responsibles.length) {
            loadRequest();
        }
    }, [isEdit, id, hospitals, services, responsibles]);

    useEffect(() => {
        if (!hospitalSelected) return;
        const loadItems = async () => {
            try {
                const response = await utilServices.getItemsByHosp(hospitalSelected);
                setItems(response?.data || []);
            } catch (err) {
                console.error("Error al obtener modelos:", err);
            }
        };
        loadItems();
    }, [hospitalSelected]);

    const loadRequest = async () => {
        try {
            setLoading(true);
            const response = await requestServices.getReqById(id);
            const item = response?.data?.request;
            if (!item) throw new Error("Solicitud no encontrada");

            reset({
                folio: item.folio ?? item.folio ?? "",
                hospital: item.hospital ?? item.hospital ?? "",
                item: item.item ?? item.item ?? "",
                priority: item.priority ?? item.priority ?? "",
                typeService: item.typeService ?? item.typeService ?? "",
                description: item.description ?? item.description ?? "",
                responsible: item.responsible ?? item.responsible ?? "",
            });
        } catch (err) {
            console.error("Error al cargar la solicitud:", err);
            showError("No se pudo cargar la información de la solicitud");
        } finally {
            setLoading(false);
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

    const getTypeServices = async () => {
        try {
            const response = await utilServices.getCatalogByKey("typeService");
            setServices(response?.data || []);
        } catch (err) {
            console.error("Error al obtener los hospitales:", err);
            showError("Hubo un problema al obtener los hospitales");
        }
    };

    const getResponsibles = async () => {
        try {
            const response = await utilServices.getResponsibles();
            setResponsibles(response?.data || []);
        } catch (err) {
            console.error("Error al obtener responsables:", err);
        }
    };

    const onSubmit = async (data) => {
        try {
            console.log("todo ok")
            setSaving(true);

            if (isEdit) {
                await requestServices.updateReq(id, data);
                showSuccess("La solicitud actualizada correctamente");
            } else {
                await requestServices.saveReq(data);
                showSuccess("La solicitud registrada correctamente");
            }

            navigate("/requests");

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al ${isEdit ? "actualizar" : "guardar"} el equipo`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <PageHeader
                title={isEdit ? "Editar solicitud" : "Nueva solicitud"}
                subtitle="Gestión de requerimientos de servicio"
            />

            <Grid spacing={2} sx={{ mb: 3 }}>
                <Card>
                    {/* Indicador de carga mientras se obtiene el item en edición */}
                    {loading ? (
                        <CardContent sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                            <CircularProgress size={32} />
                        </CardContent>
                    ) : (
                        <CardContent>
                            <form id="user-form" onSubmit={handleSubmit(onSubmit)}>

                                <SectionLabel icon={<LocationIcon />}>Información procedente</SectionLabel>
                                <Grid container spacing={2} style={{ marginBottom: 16 }}>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="hospital"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.hospital}>
                                                    <InputLabel>Hospital</InputLabel>
                                                    <Select {...field} label="Hospital">
                                                        {hospitals.map(item => (
                                                            <MenuItem key={item._id} value={item._id}>{item.value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors.hospital?.message}</FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={8}>
                                        <Controller
                                            name="item"
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={items}
                                                    value={items.find(x => x._id === field.value) || null}
                                                    isOptionEqualToValue={(option, value) =>
                                                        option._id === value._id
                                                    }
                                                    onChange={(_, option) => field.onChange(option?._id || "")}
                                                    getOptionLabel={(option) => `${option.value} • ${option.brand} • ${option.model}`}
                                                    renderOption={(props, option) => (
                                                        <Box
                                                            component="li"
                                                            {...props}
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                alignItems: "flex-start",
                                                                py: 1,
                                                            }}
                                                        >
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {option.value}
                                                            </Typography>

                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                                sx={{ lineHeight: 1.2 }}
                                                            >
                                                                {option.brand} • {option.model}
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Equipo"
                                                            size="small"
                                                            error={!!errors.item}
                                                            helperText={errors.item?.message}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="priority"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl
                                                    fullWidth
                                                    size="small"
                                                    error={!!errors.priority}
                                                >
                                                    <FormLabel id="demo-radio-buttons-group-label">Prioridad</FormLabel>
                                                    <RadioGroup
                                                        row
                                                        defaultValue="MEDIUM"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.target.value)}
                                                    >
                                                        <FormControlLabel value="HIGH" control={<Radio color="error" />} label="Alta" />
                                                        <FormControlLabel value="MEDIUM" control={<Radio color="warning" />} label="Media" />
                                                        <FormControlLabel value="LOW" control={<Radio color="success" />} label="Baja" />
                                                    </RadioGroup>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="typeService"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.typeService}>
                                                    <InputLabel>Tipo servicio</InputLabel>
                                                    <Select {...field} label="Marca">
                                                        {services.map(item => (
                                                            <MenuItem key={item._id} value={item._id}>{item.value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors.typeService?.message}</FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="responsible"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.responsible}>
                                                    <InputLabel>Responsable</InputLabel>
                                                    <Select 
                                                        {...field} 
                                                        label="Responsable"
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
                                                        {errors.responsible?.message}
                                                    </FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                                    <Grid item xs={12}>
                                        <Controller
                                            name="description"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Descripción de la solicitud"
                                                    fullWidth
                                                    multiline
                                                    minRows={4}
                                                    maxRows={6}
                                                    size="small"
                                                    error={!!errors.description}
                                                    helperText={errors.description?.message}
                                                    placeholder="Describe el problema, síntomas del equipo o requerimiento..."
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                {/* <SectionLabel icon={<FeedIcon />}>Información del equipo</SectionLabel>
                                <Grid container spacing={2} style={{ marginTop: 8, marginBottom: 16 }}>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="Nombre"
                                                    fullWidth size="small"
                                                    error={!!errors.name}
                                                    helperText={errors.name?.message}
                                                    placeholder="Ej. Monitor de signos vitales"
                                                    autoComplete="off"
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="brand"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.brand}>
                                                    <InputLabel>Marca</InputLabel>
                                                    <Select {...field} label="Marca">
                                                        {brands.map(item => (
                                                            <MenuItem key={item._id} value={item._id}>{item.value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors.brand?.message}</FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="model"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.model}>
                                                    <InputLabel>Modelo</InputLabel>
                                                    <Select {...field} label="Modelo">
                                                        {models.map(item => (
                                                            <MenuItem key={item._id} value={item._id}>{item.value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors.model?.message}</FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="serie"
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label="No. serie"
                                                    fullWidth size="small"
                                                    error={!!errors.serie}
                                                    helperText={
                                                        errors.serie?.message
                                                        ?? (isEdit ? "El número de serie no puede modificarse" : undefined)
                                                    }
                                                    placeholder="Ej. CFG-EDE233"
                                                    autoComplete="off"
                                                    disabled={isEdit}
                                                    InputProps={{
                                                        readOnly: isEdit,
                                                    }}
                                                    sx={isEdit ? {
                                                        "& .MuiInputBase-input.Mui-disabled": {
                                                            WebkitTextFillColor: C.grayBlue,
                                                        }
                                                    } : undefined}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid> */}

                                <Divider />

                                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate("/requests")}
                                        disabled={saving}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        form="user-form"
                                        variant="contained"
                                        disabled={saving || isSubmitting || loading}
                                        startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
                                    >
                                        {isEdit ? "Actualizar" : "Guardar"}
                                    </Button>
                                </CardActions>

                            </form>
                        </CardContent>
                    )}
                </Card>
            </Grid>

            <AppSnackbar
                open={notification.open}
                message={notification.message}
                severity={notification.severity}
                onClose={closeNotification}
            />
        </>
    )
}