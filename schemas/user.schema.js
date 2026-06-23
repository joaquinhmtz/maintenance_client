import { z } from "zod";

const baseUserSchema = z.object({
    name:      z.string().min(1, "El nombre es obligatorio"),
    lastname:  z.string().min(1, "El apellido paterno es obligatorio"),
    lastname2: z.string().optional(),
    profile:   z.string().min(1, "El perfil es obligatorio"),
    email:     z.string().email("Correo no válido"),
    hospitals: z.array(z.string()).min(1, "Selecciona al menos un hospital"),
    active:    z.boolean().optional(),
    // Campos de contraseña opcionales por defecto
    password:        z.string().optional(),
    confirmPassword: z.string().optional(),
    changePassword:  z.boolean().optional(), // flag de control
});

export const userSchema = baseUserSchema.superRefine((data, ctx) => {
    // Solo validamos contraseña si changePassword es true
    // (en alta siempre es true, en edición solo si el toggle está activo)
    if (data.changePassword) {
        if (!data.password || data.password.length < 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["password"],
                message: "La contraseña debe tener al menos 8 caracteres",
            });
        }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "Las contraseñas no coinciden",
            });
        }
    }
});