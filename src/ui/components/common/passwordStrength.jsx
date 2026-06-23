// components/PasswordStrength.jsx

import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText
} from "@mui/material";

export default function PasswordStrength({ password = "" }) {

    if (!password) return null;

    const checks = [
        {
            label: "Mínimo 8 caracteres",
            valid: password.length >= 8
        },
        {
            label: "Una letra mayúscula",
            valid: /[A-Z]/.test(password)
        },
        {
            label: "Una letra minúscula",
            valid: /[a-z]/.test(password)
        },
        {
            label: "Un número",
            valid: /\d/.test(password)
        },
        {
            label: "Un carácter especial",
            valid: /[^A-Za-z0-9]/.test(password)
        }
    ];

    const completed = checks.filter(c => c.valid).length;

    return (
        <Box sx={{ mt: 1 }}>

            <Box
                sx={{
                    width: "100%",
                    height: 6,
                    borderRadius: 4,
                    bgcolor: "divider",
                    overflow: "hidden",
                    mb: 1
                }}
            >
                <Box
                    sx={{
                        width: `${(completed / checks.length) * 100}%`,
                        height: "100%",
                        bgcolor:
                            completed <= 2
                                ? "error.main"
                                : completed <= 4
                                ? "warning.main"
                                : "success.main",
                        transition: ".3s"
                    }}
                />
            </Box>

            <List dense sx={{ p: 0 }}>
                {checks.map(item => (
                    <ListItem
                        key={item.label}
                        sx={{
                            py: 0,
                            px: 0
                        }}
                    >
                        <ListItemText
                            primary={`${item.valid ? "✓" : "○"} ${item.label}`}
                            primaryTypographyProps={{
                                fontSize: 12,
                                color: item.valid
                                    ? "success.main"
                                    : "text.secondary"
                            }}
                        />
                    </ListItem>
                ))}
            </List>

        </Box>
    );
}