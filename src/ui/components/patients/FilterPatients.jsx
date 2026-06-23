import {
    Grid, 
    TextField,
    Card, 
    CardContent,
    Typography,
} from '@mui/material';
import { C } from '../../../theme/variables';

export default function FilterPatients({ filter, setFilter }) {
    return (
        <>
            <Grid item spacing={2} sx={{ mb: 3 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ fontSize: 15 }}>
                            Filtros de búsqueda
                        </Typography>
                        <Typography variant="body2" sx={{ color: C.grayBlue, mb: 2 }}>
                            Utiliza los siguientes filtros para refinar la lista de pacientes.
                        </Typography>

                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth size="small" label="Buscar por nombre, email, teléfono"
                                value={filter.search} onChange={e => setFilter(prev => ({ ...prev, search: e.target.value }))}
                            />
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </>
    );
}