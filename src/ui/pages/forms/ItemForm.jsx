import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 👈 useParams
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema } from "../../../../schemas/item.schema";
import itemServices from "../../../services/item";
import {
    Card, CardContent, CardActions, Button, TextField,
    Grid, Box, Typography, FormControl, InputLabel,
    Select, MenuItem, FormHelperText, Divider, CircularProgress
} from "@mui/material";
import { Feed as FeedIcon, LocationOn as LocationIcon } from "@mui/icons-material";
import { C } from "../../../theme/variables";
import utilServices from "../../../services/utils";
import useNotification from "./../../../../hooks/useNotification";
import PageHeader from "../../components/common/pageHeader";
import AppSnackbar from "../../components/common/appSnackbar";

export default function ItemForm({ isEdit = false }) {

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
        resolver: zodResolver(itemSchema),
        defaultValues: {
            hospital: "",
            name: "",
            brand: "",
            model: "",
            serie: "",
            category: "",
            area: "",
            active: true
        }
    });

    const { notification, showSuccess, showError, closeNotification } = useNotification();

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const [hospitals, setHospitals] = useState([]);
    const [areas, setAreas] = useState([]);
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);

    const brandSelected = watch("brand");

    // ── Carga inicial de catálogos ──────────────────────────────────────────
    useEffect(() => {
        getAreas();
        getBrands();
        getHospitals();
    }, []);

    useEffect(() => {
        if (isEdit && id && areas.length && brands.length && hospitals.length) {
            loadItem();
        }
    }, [isEdit, id, areas, brands, hospitals]);

    // ── Modelos reactivos a la marca seleccionada ───────────────────────────
    useEffect(() => {
        if (!brandSelected) return;
        const loadModels = async () => {
            try {
                const response = await utilServices.getModelsByBrand(brandSelected);
                setModels(response?.data || []);
            } catch (err) {
                console.error("Error al obtener modelos:", err);
            }
        };
        loadModels();
    }, [brandSelected]);

    // ── Fetch del item en edición ───────────────────────────────────────────
    const loadItem = async () => {
        try {
            setLoading(true);
            const response = await itemServices.getItemById(id);
            const item = response?.data?.item;
            if (!item) throw new Error("Item no encontrado");

            reset({
                hospital: item.hospital?._id ?? item.hospital ?? "",
                name: item.name ?? "",
                brand: item.brand?._id ?? item.brand ?? "",
                model: item.model?._id ?? item.model ?? "",
                serie: item.serie ?? "",
                area: item.area?._id ?? item.area ?? "",
                active: item.active ?? true,
            });
        } catch (err) {
            console.error("Error al cargar el equipo:", err);
            showError("No se pudo cargar la información del equipo");
        } finally {
            setLoading(false);
        }
    };

    // ── Validación de serie única (solo en alta) ────────────────────────────
    const validateSerieUnique = async (serie) => {
        if (!serie) return true;
        try {
            const response = await itemServices.checkSerieExists(serie);
            return !response?.data?.exists;
        } catch {
            return true;
        }
    };

    const getAreas = async () => {
        try {
            const response = await utilServices.getCatalogByKey("areas");
            setAreas(response?.data || []);
        } catch (err) {
            console.error("Error al obtener las áreas:", err);
            showError("Hubo un problema al obtener las áreas");
        }
    };

    const getBrands = async () => {
        try {
            const response = await utilServices.getCatalogBrands();
            setBrands(response?.data || []);
        } catch (err) {
            console.error("Error al obtener las marcas:", err);
            showError("Hubo un problema al obtener las marcas");
        }
    };

    const getHospitals = async () => {
        try {
            const response = await utilServices.getHospitalsByUser();
            setHospitals(response?.data || []);
        } catch (err) {
            console.error("Error al obtener los hospitales:", err);
            showError("Hubo un problema al obtener los hospitales");
        }
    };

    // ── Submit ──────────────────────────────────────────────────────────────
    const onSubmit = async (data) => {
        try {
            setSaving(true);

            // Validación de serie única solo en alta
            if (!isEdit) {
                const isUnique = await validateSerieUnique(data.serie);

                if (!isUnique) {
                    setError("serie", {
                        type: "manual",
                        message: "Ya existe un equipo con este número de serie"
                    });
                    return;
                }
            }

            if (isEdit) {
                await itemServices.updateItem(id, data);
                showSuccess("Equipo actualizado correctamente");
            } else {
                await itemServices.saveItem(data);
                showSuccess("Equipo registrado correctamente");
            }

            navigate("/items");

        } catch (error) {
            console.error(error);
            showError(`Hubo un error al ${isEdit ? "actualizar" : "guardar"} el equipo`);
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

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <>
            <PageHeader
                title={isEdit ? "Editar equipo" : "Nuevo equipo"}
                subtitle="Gestión de equipos para mantenimiento en el sistema"
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

                                <SectionLabel icon={<LocationIcon />}>Ubicación equipo</SectionLabel>
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
                                    <Grid item xs={12} md={4}>
                                        <Controller
                                            name="area"
                                            control={control}
                                            render={({ field }) => (
                                                <FormControl fullWidth size="small" error={!!errors.area}>
                                                    <InputLabel>Área</InputLabel>
                                                    <Select {...field} label="Área">
                                                        {areas.map(item => (
                                                            <MenuItem key={item._id} value={item._id}>{item.value}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    <FormHelperText>{errors.area?.message}</FormHelperText>
                                                </FormControl>
                                            )}
                                        />
                                    </Grid>
                                </Grid>

                                <SectionLabel icon={<FeedIcon />}>Información del equipo</SectionLabel>
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
                                </Grid>

                                <Divider />

                                <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate("/items")}
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
    );
}