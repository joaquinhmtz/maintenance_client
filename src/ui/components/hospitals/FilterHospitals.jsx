import {
    Grid,
    TextField,
    Card,
    CardContent,
    Typography,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    Backspace as ClearIcon
} from "@mui/icons-material"
import { C } from '../../../theme/variables';
import { useState } from 'react';

export default function FilterHospitals({ filters, setFilters }) {

    const [filtersTmp, setFiltersTmp] = useState(filters);
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            setFilters(prev => ({ ...prev, ...filtersTmp }));
        }
    };

    const handleClear = () => {
        setFiltersTmp(prev => ({ ...prev, search: "" }));
        setFilters(prev => ({ ...prev, search: "" }));
    };

    return (
        <>
            <Grid item spacing={2} sx={{ mb: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontSize: 15 }}>
                            Filtros de búsqueda
                        </Typography>
                        <Typography variant="body2" sx={{ color: C.grayBlue, mb: 2 }}>
                            Utiliza los siguientes filtros para refinar la lista de hospitales.
                        </Typography>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Buscar por nombre"
                                value={filtersTmp.search}
                                onChange={e => setFiltersTmp(prev => ({ ...prev, search: e.target.value }))}
                                onKeyDown={handleKeyDown}
                                autoComplete='off'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                size="small"
                                                onClick={handleClear}
                                                disabled={!filtersTmp.search}
                                            >
                                                <ClearIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
}