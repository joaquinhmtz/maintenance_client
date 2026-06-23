import React, { useState } from 'react';
import {
    Box,
    Typography,
    Pagination
} from "@mui/material";
import { C } from "./../../../theme/variables";

export default function PaginationCmp({ total, pagination, setPagination, table = "usuarios"
 }) {

    const totalPages = Math.max(1, Math.ceil(total / pagination.limit || 10));

    return (
        <Box sx={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            px: 2, py: 1.5, borderTop: "0.5px solid", borderColor: "divider", flexWrap: "wrap", gap: 1,
        }}>
            <Typography sx={{ fontSize: 11, color: C.grayBlue }}>
                Mostrando {Math.min((pagination.page - 1) * pagination.limit + 1, total)}–{Math.min(pagination.page * pagination.limit, total)} de {total} {table}
            </Typography>
            <Pagination
                count={totalPages}
                page={pagination.page}
                onChange={(_, p) => setPagination(prev => ({ ...prev, page: p }))}
                size="small"
                sx={{
                    "& .MuiPaginationItem-root.Mui-selected": { bgcolor: C.teal500, color: "#fff" },
                    "& .MuiPaginationItem-root.Mui-selected:hover": { bgcolor: C.teal700 },
                }}
            />
        </Box>
    )
}